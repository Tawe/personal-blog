import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Get the base URL from the request to handle different environments
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`

  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Disallow admin or private areas (if any)
# Disallow: /admin/
# Disallow: /private/
`

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  })
}
