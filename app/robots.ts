import { MetadataRoute } from 'next'

const baseUrl = 'https://alsayed-mourad.com' // Should be dynamic based on environment

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/private/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
