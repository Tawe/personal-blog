import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { generateSlug } from "@/lib/slug-utils"

// Dynamic import to prevent bundling
const getMatter = () => import("gray-matter").then((m) => m.default)

export async function GET(request: Request) {
  // Get the base URL from the request to handle different environments
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`
  const urls = []

  // Add robots.txt reference
  urls.push({
    loc: `${baseUrl}/robots.txt`,
    lastmod: new Date().toISOString(),
    changefreq: "yearly",
    priority: "0.1",
  })

  // Static pages
  const staticPages = [
    "",
    "/vision",
    "/team-building", 
    "/mentoring",
    "/contact",
    "/strategic-narratives",
    "/strategic-narratives/leadership-strategy",
    "/strategic-narratives/technical-architecture",
    "/strategic-narratives/dnd-ttrpgs",
    "/strategic-narratives/world-of-artumin",
  ]

  staticPages.forEach((page) => {
    urls.push({
      loc: `${baseUrl}${page}`,
      lastmod: new Date().toISOString(),
      changefreq: page === "" ? "weekly" : "monthly",
      priority: page === "" ? "1.0" : "0.8",
    })
  })

  // Dynamic content pages - includes both strategic-narratives and standalone leadership-strategy routes
  const contentSections = [
    { dir: "content/leadership", routes: ["/strategic-narratives/leadership-strategy", "/leadership-strategy"] },
    { dir: "content/technical-writings", routes: ["/strategic-narratives/technical-architecture"] },
    { dir: "content/dnd-musings", routes: ["/strategic-narratives/dnd-ttrpgs"] },
    { dir: "content/artumin", routes: ["/strategic-narratives/world-of-artumin"] },
  ]

  for (const section of contentSections) {
    const contentDir = path.join(process.cwd(), section.dir)
    
    if (fs.existsSync(contentDir)) {
      const files = fs.readdirSync(contentDir)
      const markdownFiles = files.filter((file) => file.endsWith(".md"))

      // Load matter once per section to avoid repeated imports
      const matter = await getMatter()
      
      for (const filename of markdownFiles) {
        // Validate filename to prevent path traversal
        if (!filename.match(/^[a-zA-Z0-9\s\-_\.]+\.md$/)) {
          continue
        }
        const filePath = path.join(contentDir, filename)
        const fileContent = fs.readFileSync(filePath, "utf8")
        const { data: frontmatter } = matter(fileContent)
        
        const slug = generateSlug(filename)
        // Use file modification time or frontmatter date, whichever is more recent
        const fileStats = fs.statSync(filePath)
        const fileModTime = new Date(fileStats.mtime).toISOString()
        const frontmatterDate = frontmatter.date ? new Date(frontmatter.date).toISOString() : null
        const lastmod = frontmatterDate && new Date(frontmatterDate) > new Date(fileModTime) 
          ? frontmatterDate 
          : fileModTime
        
        // Add URLs for all routes this content appears on
        section.routes.forEach((route) => {
          urls.push({
            loc: `${baseUrl}${route}/${slug}`,
            lastmod,
            changefreq: "monthly",
            priority: "0.7",
          })
        })
      }
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
