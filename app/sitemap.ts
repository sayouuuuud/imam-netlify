import { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

// تحديث الخريطة مرة واحدة يومياً لتقليل الضغط على Supabase
export const revalidate = 86400; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.elsayed-mourad.online" // تم تعديل الرابط الأساسي

  // 1. Static Routes
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/dars",
    "/khutba",
    "/books",
    "/articles",
    "/videos",
    "/schedule",
    "/projects",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }))

  try {
    // 2. Dynamic Content from Supabase
    const [
      { data: sermons },
      { data: lessons },
      { data: books },
      { data: articles },
    ] = await Promise.all([
      supabase.from("sermons").select("slug, updated_at").order("updated_at", { ascending: false }),
      supabase.from("lessons").select("slug, updated_at").order("updated_at", { ascending: false }),
      supabase.from("books").select("slug, updated_at").order("updated_at", { ascending: false }),
      supabase.from("articles").select("slug, updated_at").order("updated_at", { ascending: false }),
    ])

    const dynamicRoutes: MetadataRoute.Sitemap = []

    // إضافة encodeURI لتشفير الـ Slugs العربية بشكل صحيح
    sermons?.forEach((item) => {
      dynamicRoutes.push({
        url: `${baseUrl}/khutba/${encodeURI(item.slug)}`,
        lastModified: new Date(item.updated_at),
        changeFrequency: "weekly",
        priority: 0.7,
      })
    })

    lessons?.forEach((item) => {
      dynamicRoutes.push({
        url: `${baseUrl}/dars/${encodeURI(item.slug)}`,
        lastModified: new Date(item.updated_at),
        changeFrequency: "weekly",
        priority: 0.7,
      })
    })

    books?.forEach((item) => {
      dynamicRoutes.push({
        url: `${baseUrl}/books/${encodeURI(item.slug)}`,
        lastModified: new Date(item.updated_at),
        changeFrequency: "monthly",
        priority: 0.6,
      })
    })

    articles?.forEach((item) => {
      dynamicRoutes.push({
        url: `${baseUrl}/articles/${encodeURI(item.slug)}`,
        lastModified: new Date(item.updated_at),
        changeFrequency: "weekly",
        priority: 0.7,
      })
    })

    return [...staticRoutes, ...dynamicRoutes]
  } catch (error) {
    console.error("Sitemap generation error:", error)
    return staticRoutes
  }
}
