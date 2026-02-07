import { NextRequest, NextResponse } from 'next/server'
import { createClient } from "@/lib/supabase/server"

// Cache chunk sizes to avoid repeated HEAD requests
// Key: full split url string, Value: array of chunk sizes
const sizeCache = new Map<string, number[]>()

async function getChunkSizes(urls: string[]): Promise<number[]> {
    const cacheKey = urls.join('|')
    if (sizeCache.has(cacheKey)) {
        return sizeCache.get(cacheKey)!
    }

    // Fetch headers in parallel
    const sizes = await Promise.all(urls.map(async (url) => {
        try {
            const res = await fetch(url, { method: 'HEAD' })
            const len = res.headers.get('content-length')
            if (len) return parseInt(len, 10)
            return 0
        } catch (e) {
            console.error('Error fetching head for chunk:', url, e)
            return 0
        }
    }))

    // Cache valid results
    if (sizes.every(s => s > 0)) {
        sizeCache.set(cacheKey, sizes)
    }

    return sizes
}

// Cache manifest data to avoid repeated JSON fetches
// Key: manifest url, Value: parsed manifest object
const manifestCache = new Map<string, any>()

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const fileUrl = searchParams.get('url')
        const inline = searchParams.get('inline') === 'true'

        // "filename" or fallback
        const filename = searchParams.get('filename') || 'book.pdf'

        if (!fileUrl) {
            return NextResponse.json({ error: 'URL required' }, { status: 400 })
        }

        const id = searchParams.get("id")

        // Get client info for tracking
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || ''
        const userAgent = request.headers.get('user-agent') || ''

        // --- Logic: Increment Download Count ---
        // Only count if it's a download (not inline view) and we have an ID
        if (!inline && id) {
            const supabase = await createClient()
            try {
                const { error } = await supabase.rpc('increment_downloads', { row_id: id, table_name: 'books' })
                if (error) {
                    // Fallback
                    const { data: book } = await supabase.from('books').select('download_count').eq('id', id).single()
                    if (book) {
                        await supabase.from('books').update({ download_count: (book.download_count || 0) + 1 }).eq('id', id)
                    }
                }
            } catch (err) {
                console.error("Failed to increment download count:", err)
            }
        }


        // 1. Handle SPLIT FILE and MANIFEST (Virtual File System)
        if (fileUrl.startsWith('split:') || fileUrl.startsWith('manifest:')) {
            let parts: string[] = []
            let chunkSizes: number[] = []
            let totalSize = 0
            let isManifest = false
            let manifest: any = null

            if (fileUrl.startsWith('manifest:')) {
                isManifest = true
                const manifestUrl = fileUrl.replace('manifest:', '')

                // Check cache first
                if (manifestCache.has(manifestUrl)) {
                    manifest = manifestCache.get(manifestUrl)
                } else {
                    // Fetch manifest file
                    const manifestRes = await fetch(manifestUrl)
                    if (!manifestRes.ok) {
                        return NextResponse.json({ error: 'Failed to fetch manifest' }, { status: 502 })
                    }
                    // Attempt JSON parse, fallback to text split if needed (though audio route assumes JSON)
                    const text = await manifestRes.text()
                    try {
                        manifest = JSON.parse(text)
                    } catch {
                        // Backward compat: if not JSON, assume list of URLs separated by newline
                        parts = text.split('\n').map(x => x.trim()).filter(x => x.startsWith('http'))
                        manifest = { chunks: parts }
                    }

                    // Cache it
                    manifestCache.set(manifestUrl, manifest)
                }

                if (Array.isArray(manifest)) {
                    // Handle simple array format
                    parts = manifest
                    manifest = { chunks: parts }
                } else if (manifest.chunks && Array.isArray(manifest.chunks)) {
                    parts = manifest.chunks
                } else if (parts.length === 0) {
                    return NextResponse.json({ error: 'Invalid manifest format' }, { status: 502 })
                }
            } else {
                // Legacy split url support
                parts = fileUrl.replace('split:', '').split('||')
            }

            if (isManifest && manifest.sizes && manifest.totalSize) {
                console.log(`✅ Using Manifest Metadata: ${manifest.sizes.length} chunks, Total: ${manifest.totalSize}`)
                chunkSizes = manifest.sizes
                totalSize = manifest.totalSize
            } else {
                if (isManifest) console.warn(`⚠️ Manifest Metadata Missing! Fallback to HEAD requests.`)
                // Fallback to HEAD requests (slower)
                chunkSizes = await getChunkSizes(parts)
                totalSize = chunkSizes.reduce((a, b) => a + b, 0)
            }

            if (totalSize === 0) {
                return NextResponse.json({ error: 'Failed to calculate total size' }, { status: 500 })
            }

            // For PDF, we usually send the whole file, but we support Range for viewers that request it
            const rangeHeader = request.headers.get('range')
            let start = 0
            let end = totalSize - 1
            const isFullDownload = !rangeHeader

            if (rangeHeader) {
                const rangeParts = rangeHeader.replace(/bytes=/, '').split('-')
                start = parseInt(rangeParts[0], 10)
                end = rangeParts[1] ? parseInt(rangeParts[1], 10) : totalSize - 1
            }

            // Ensure valid range
            if (start >= totalSize || end >= totalSize) {
                return new NextResponse(null, {
                    status: 416,
                    headers: { 'Content-Range': `bytes */${totalSize}` }
                })
            }

            // Calculate chunks to stream
            let currentOffset = 0
            const chunksToStream: { url: string, start: number, end: number }[] = []

            for (let i = 0; i < parts.length; i++) {
                const chunkSize = chunkSizes[i]
                const chunkStart = currentOffset
                const chunkEnd = currentOffset + chunkSize - 1

                // Check overlap
                if (chunkEnd >= start && chunkStart <= end) {
                    // Calculate relative start/end inside this specific chunk
                    const relativeStart = Math.max(0, start - chunkStart)
                    const relativeEnd = Math.min(chunkSize - 1, end - chunkStart)

                    chunksToStream.push({
                        url: parts[i],
                        start: relativeStart,
                        end: relativeEnd,
                    })
                }
                currentOffset += chunkSize
            }

            // If it's a full download/inline view and not a specific range request,
            // we might want to just merge everything.
            // But the Streaming Response logic works for both full and partial (start=0, end=total-1).

            // Create Streaming Response
            const stream = new ReadableStream({
                async start(controller) {
                    for (const chunkInfo of chunksToStream) {
                        if (request.signal.aborted) {
                            controller.close()
                            return
                        }

                        try {
                            const res = await fetch(chunkInfo.url, {
                                headers: {
                                    'Range': `bytes=${chunkInfo.start}-${chunkInfo.end}`,
                                    // 'Accept-Encoding': 'identity'
                                },
                                signal: request.signal
                            })

                            if (!res.ok) throw new Error(`Upstream request failed: ${res.status}`)
                            if (!res.body) continue

                            const reader = res.body.getReader()
                            while (true) {
                                if (request.signal.aborted) {
                                    reader.cancel()
                                    controller.close()
                                    return
                                }
                                const { done, value } = await reader.read()
                                if (done) break
                                controller.enqueue(value)
                            }

                        } catch (e: any) {
                            if (e.name === 'AbortError' || request.signal.aborted) return
                            console.error('Stream error:', e)
                            controller.error(e)
                            return
                        }
                    }
                    controller.close()
                }
            })

            const disposition = inline ? 'inline' : `attachment; filename="${filename}"`

            const headers: Record<string, string> = {
                'Content-Type': 'application/pdf',
                'Content-Length': (end - start + 1).toString(),
                'Accept-Ranges': 'bytes',
                'Cache-Control': 'public, max-age=86400, immutable',
                'Content-Disposition': disposition,
                'Access-Control-Allow-Origin': '*',
            }
            // Only add Content-Range for partial requests
            if (!isFullDownload) {
                headers['Content-Range'] = `bytes ${start}-${end}/${totalSize}`
            }

            return new NextResponse(stream, {
                status: isFullDownload ? 200 : 206,
                headers
            })
        }

        // 2. Handle Regular Files (Pass-through Proxy)
        // Rate limiting
        // We will skip strict rate limiting for now to ensure compatibility with "backup technique" request

        const res = await fetch(fileUrl, {
            headers: {
                ...(request.headers.get('range') && { 'Range': request.headers.get('range')! })
            }
        })

        const responseHeaders: Record<string, string> = {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*',
        }

        if (res.headers.get('Content-Length')) {
            responseHeaders['Content-Length'] = res.headers.get('Content-Length')!
        }
        if (res.headers.get('Content-Range')) {
            responseHeaders['Content-Range'] = res.headers.get('Content-Range')!
        }

        return new NextResponse(res.body, {
            status: res.status,
            headers: responseHeaders
        })

    } catch (error) {
        console.error('PDF Proxy Error:', error)
        return NextResponse.json({
            error: 'Server Error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
