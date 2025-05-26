import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const contentDir = path.join(process.cwd(), "content/leadership")

    if (!fs.existsSync(contentDir)) {
      return NextResponse.json({ error: "Content directory not found" }, { status: 404 })
    }

    const files = fs.readdirSync(contentDir)
    const markdownFiles = files.filter((file) => file.endsWith(".md"))

    // Find the file that matches the slug
    const matchingFile = markdownFiles.find((filename) => {
      const fileSlug = filename
        .replace(".md", "")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
      return fileSlug === slug
    })

    if (!matchingFile) {
      console.log(`No matching file found for slug: ${slug}`)
      console.log(
        `Available files:`,
        markdownFiles.map((f) => f.replace(".md", "").toLowerCase().replace(/\s+/g, "-")),
      )
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const filePath = path.join(contentDir, matchingFile)
    const fileContent = fs.readFileSync(filePath, "utf8")
    const { data: frontmatter, content } = matter(fileContent)

    const article = {
      slug,
      title: frontmatter.title || matchingFile.replace(".md", ""),
      date: frontmatter.date || new Date().toISOString(),
      excerpt: frontmatter.excerpt || content.substring(0, 150) + "...",
      content: marked(content),
      tags: frontmatter.tags || [],
      featured_image: frontmatter.featured_image || frontmatter.image,
      reading_time: frontmatter.reading_time || Math.ceil(content.split(" ").length / 200),
      medium_link: frontmatter.medium_link,
      devto_link: frontmatter.devto_link,
      substack_link: frontmatter.substack_link,
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error("Error loading article:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
