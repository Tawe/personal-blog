import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"

const categoryMap = {
  leadership: "leadership",
  technical: "technical-writings",
  artumin: "artumin",
  dnd: "dnd-musings",
}

export async function GET(request: Request, { params }: { params: { category: string; slug: string } }) {
  try {
    const { category, slug } = params
    const contentFolder = categoryMap[category as keyof typeof categoryMap]

    if (!contentFolder) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const contentDir = path.join(process.cwd(), `content/${contentFolder}`)

    if (!fs.existsSync(contentDir)) {
      return NextResponse.json({ error: "Content directory not found" }, { status: 404 })
    }

    const files = fs.readdirSync(contentDir)
    const markdownFiles = files.filter((file) => file.endsWith(".md"))

    // Find the file that matches the slug
    const matchingFile = markdownFiles.find((filename) => {
      const fileSlug = filename.replace(".md", "").toLowerCase().replace(/\s+/g, "-")
      return fileSlug === slug
    })

    if (!matchingFile) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const filePath = path.join(contentDir, matchingFile)
    const fileContent = fs.readFileSync(filePath, "utf8")
    const { data: frontmatter, content } = matter(fileContent)

    const article = {
      slug,
      title: frontmatter.title || matchingFile.replace(".md", ""),
      subtitle: frontmatter.subtitle,
      date: frontmatter.date || new Date().toISOString(),
      excerpt: frontmatter.excerpt || content.substring(0, 150) + "...",
      content: marked(content),
      tags: frontmatter.tags || [],
      featured_image: frontmatter.featured_image || frontmatter.image,
      reading_time: frontmatter.reading_time || Math.ceil(content.split(" ").length / 200),
      featured: frontmatter.featured || false,
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
