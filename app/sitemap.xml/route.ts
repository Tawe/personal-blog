import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

export async function GET() {
  const baseUrl = "https://johnmunn.dev"
  const urls = []

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

  // Dynamic content pages
  const contentSections = [
    { dir: "content/leadership", route: "/strategic-narratives/leadership-strategy" },
    { dir: "content/technical-writings", route: "/strategic-narratives/technical-architecture" },
    { dir: "content/dnd-musings", route: "/strategic-narratives/dnd-ttrpgs" },
    { dir: "content/artumin", route: "/strategic-narratives/world-of-artumin" },
  ]

  for (const section of contentSections) {
    const contentDir = path.join(process.cwd(), section.dir)
    
    if (fs.existsSync(contentDir)) {
      const files = fs.readdirSync(contentDir)
      const markdownFiles = files.filter((file) => file.endsWith(".md"))

      markdownFiles.forEach((filename) => {
        // Validate filename to prevent path traversal
        if (!filename.match(/^[a-zA-Z0-9\s\-_\.]+\.md$/)) {
          return
        }
        const filePath = path.join(contentDir, filename)
        const fileContent = fs.readFileSync(filePath, "utf8")
        const { data: frontmatter } = matter(fileContent)
        
        const slug = filename.replace(".md", "").toLowerCase().replace(/\s+/g, "-")
        const lastmod = frontmatter.date ? new Date(frontmatter.date).toISOString() : new Date().toISOString()
        
        urls.push({
          loc: `${baseUrl}${section.route}/${slug}`,
          lastmod,
          changefreq: "monthly",
          priority: "0.7",
        })
      })
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
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
