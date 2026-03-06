import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { urls, engine = "all" } = body

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json(
                { error: "يرجى تحديد الروابط" },
                { status: 400 }
            )
        }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://elsayed-mourad.online"
        const sitemapUrl = `${baseUrl}/sitemap.xml`
        const results: { url: string; google?: string; bing?: string }[] = []

        for (const url of urls.slice(0, 50)) {
            const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`
            const result: { url: string; google?: string; bing?: string } = { url: fullUrl }

            // Ping Google
            if (engine === "all" || engine === "google") {
                try {
                    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
                    const res = await fetch(googlePingUrl, { method: "GET" })
                    result.google = res.ok ? "success" : "failed"
                } catch {
                    result.google = "failed"
                }
            }

            // Ping Bing via IndexNow
            if (engine === "all" || engine === "bing") {
                try {
                    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
                    const res = await fetch(bingPingUrl, { method: "GET" })
                    result.bing = res.ok ? "success" : "failed"
                } catch {
                    result.bing = "failed"
                }
            }

            results.push(result)
        }

        return NextResponse.json({
            success: true,
            message: `تم إرسال ${results.length} رابط لمحركات البحث`,
            results,
        })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "حدث خطأ" },
            { status: 500 }
        )
    }
}
