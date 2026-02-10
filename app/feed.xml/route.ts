import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { generateSlug } from "@/lib/slug-utils"

export const runtime = 'nodejs'
export const revalidate = 3600

function parseFrontmatter(content: string): {
  title?: string
  date?: string
  excerpt?: string
  draft?: boolean
  tags?: string[]
} {
  const result: any = {}
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/)
  if (!match) return result

  const text = match[1]

  const titleMatch = text.match(/^title:\s*(.+)$/m)
  if (titleMatch) result.title = titleMatch[1].trim().replace(/^["']|["']$/g, "")

  const dateMatch = text.match(/^date:\s*(.+)$/m)
  if (dateMatch) result.date = dateMatch[1].trim().replace(/^["']|["']$/g, "")

  const excerptMatch = text.match(/^excerpt:\s*(.+)$/m)
  if (excerptMatch) result.excerpt = excerptMatch[1].trim().replace(/^["']|["']$/g, "")

  const draftMatch = text.match(/^draft:\s*(true|false)/m)
  if (draftMatch) result.draft = draftMatch[1] === 'true'

  const tagsMatch = text.match(/^tags:\s*\[(.*?)\]/s)
  if (tagsMatch) {
    result.tags = tagsMatch[1]
      .split(",")
      .map((t: string) => t.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean)
  }

  return result
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const baseUrl = "https://johnmunn.tech"

  const contentSections = [
    { dir: "content/leadership", route: "/strategic-narratives/leadership-strategy" },
    { dir: "content/technical-writings", route: "/strategic-narratives/technical-architecture" },
    { dir: "content/dnd-musings", route: "/strategic-narratives/dnd-ttrpgs" },
    { dir: "content/artumin", route: "/strategic-narratives/world-of-artumin" },
  ]

  const items: { title: string; link: string; description: string; pubDate: string; categories: string[] }[] = []

  for (const section of contentSections) {
    const contentDir = path.join(process.cwd(), section.dir)

    if (!fs.existsSync(contentDir)) continue

    const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".md"))

    for (const filename of files) {
      if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) continue

      const filePath = path.join(contentDir, filename)
      const fileContent = fs.readFileSync(filePath, "utf8")
      const frontmatter = parseFrontmatter(fileContent)

      if (frontmatter.draft === true) continue

      const slug = generateSlug(filename)
      const title = frontmatter.title || filename.replace(".md", "")
      const description = frontmatter.excerpt || ""
      const pubDate = frontmatter.date ? new Date(frontmatter.date).toUTCString() : new Date().toUTCString()
      const categories = frontmatter.tags || []

      items.push({
        title,
        link: `${baseUrl}${section.route}/${slug}`,
        description,
        pubDate,
        categories,
      })
    }
  }

  // Sort by date descending
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>John Munn</title>
    <link>${baseUrl}</link>
    <description>Engineering leader and writer. Systems, teams, and the work of building things that last.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
${item.categories.map((cat) => `      <category>${escapeXml(cat)}</category>`).join("\n")}
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
