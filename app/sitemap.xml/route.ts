import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { generateSlug } from "@/lib/slug-utils"

// Optimize for smaller bundle size
export const runtime = 'nodejs'
export const revalidate = 3600 // Revalidate every hour (cache for 1 hour)

// Simple frontmatter parser to avoid bundling gray-matter
function parseFrontmatter(content: string): { draft?: boolean; date?: string } {
  const frontmatter: { draft?: boolean; date?: string } = {}
  
  // Match YAML frontmatter between --- markers
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/)
  if (!frontmatterMatch) {
    return frontmatter
  }
  
  const frontmatterText = frontmatterMatch[1]
  
  // Extract draft field
  const draftMatch = frontmatterText.match(/^draft:\s*(true|false)/m)
  if (draftMatch) {
    frontmatter.draft = draftMatch[1] === 'true'
  }
  
  // Extract date field (supports various formats)
  const dateMatch = frontmatterText.match(/^date:\s*(.+)$/m)
  if (dateMatch) {
    frontmatter.date = dateMatch[1].trim().replace(/['"]/g, '')
  }
  
  return frontmatter
}

export async function GET(request: Request) {
  // Always use canonical HTTPS non-www URL for sitemap
  const baseUrl = "https://johnmunn.tech"
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
    "/services",
    "/services/team-building", 
    "/services/mentoring",
    "/workbench",
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
    { dir: "content/projects", routes: ["/workbench"] },
  ]

  for (const section of contentSections) {
    const contentDir = path.join(process.cwd(), section.dir)
    
    if (fs.existsSync(contentDir)) {
      const files = fs.readdirSync(contentDir)
      const markdownFiles = files.filter((file) => file.endsWith(".md"))
      
      for (const filename of markdownFiles) {
        // Basic validation: ensure it's a .md file and doesn't contain path traversal attempts
        // More permissive since generateSlug will sanitize the output anyway
        if (!filename.endsWith(".md") || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
          continue
        }
        const filePath = path.join(contentDir, filename)
        const fileContent = fs.readFileSync(filePath, "utf8")
        const frontmatter = parseFrontmatter(fileContent)
        
        // Skip draft projects/articles
        if (frontmatter.draft === true) {
          continue
        }
        
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
