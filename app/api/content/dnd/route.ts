import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"

export async function GET() {
  try {
    const contentDir = path.join(process.cwd(), "content/dnd-musings")

    if (!fs.existsSync(contentDir)) {
      return NextResponse.json({ articles: [] })
    } 

    const files = fs.readdirSync(contentDir)
    const markdownFiles = files.filter((file) => file.endsWith(".md"))

    const articles = markdownFiles.map((filename) => {
      const filePath = path.join(contentDir, filename)
      const fileContent = fs.readFileSync(filePath, "utf8")
      const { data: frontmatter, content } = matter(fileContent)

      const slug = filename.replace(".md", "").toLowerCase().replace(/\s+/g, "-")

      return {
        slug,
        title: frontmatter.title || filename.replace(".md", ""),
        subtitle: frontmatter.subtitle,
        date: frontmatter.date || new Date().toISOString(),
        excerpt: frontmatter.excerpt || content.substring(0, 150) + "...",
        content: marked(content), // Convert markdown to HTML
        tags: frontmatter.tags || [],
        featured_image: frontmatter.featured_image || frontmatter.image,
        reading_time: frontmatter.reading_time || Math.ceil(content.split(" ").length / 200),
        type: frontmatter.type || "homebrew",
        system: frontmatter.system || "D&D 5e",
        level_range: frontmatter.level_range,
        availability: frontmatter.availability || "free",
        duration: frontmatter.duration,
        price: frontmatter.price,
        platform: frontmatter.platform,
        external_url: frontmatter.external_url,
        rating: frontmatter.rating,
        playtested: frontmatter.playtested || false,
      }
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("Error loading D&D articles:", error)
    return NextResponse.json({ articles: [] })
  }
}
