import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Cache redirects for 5 minutes to avoid hitting DB on every request
let redirectsCache: { source_path: string; destination_path: string; redirect_type: number }[] | null = null
let cacheTimestamp = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function getRedirects() {
  const now = Date.now()
  if (redirectsCache && now - cacheTimestamp < CACHE_TTL) {
    return redirectsCache
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey || supabaseUrl === "https://placeholder.supabase.co") {
      return []
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })

    const { data } = await supabase
      .from("redirects")
      .select("source_path, destination_path, redirect_type")
      .eq("is_active", true)

    redirectsCache = data || []
    cacheTimestamp = now
    return redirectsCache
  } catch {
    return []
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip static files, API routes, and admin pages
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/admin")
  ) {
    return NextResponse.next()
  }

  try {
    const redirects = await getRedirects()
    const match = redirects.find((r) => r.source_path === pathname)

    if (match) {
      const destination = match.destination_path.startsWith("http")
        ? match.destination_path
        : `${request.nextUrl.origin}${match.destination_path}`

      // Fire-and-forget: increment hit count
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (supabaseUrl && supabaseKey && supabaseUrl !== "https://placeholder.supabase.co") {
        const supabase = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        })
        void supabase.rpc("increment_redirect_hits", { source: pathname })
      }

      return NextResponse.redirect(destination, {
        status: match.redirect_type || 301,
      })
    }
  } catch {
    // Don't block requests if redirect logic fails
  }

  return NextResponse.next()
}

export default proxy
