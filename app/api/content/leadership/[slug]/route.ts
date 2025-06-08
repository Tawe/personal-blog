import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    console.log("API called with slug:", params.slug)

    const contentDir = path.join(process.cwd(), "content/leadership")
    console.log("Content directory:", contentDir)

    if (!fs.existsSync(contentDir)) {
      console.log("Content directory does not exist")
      return NextResponse.json({ error: "Content directory not found" }, { status: 404 })
    }

    const files = fs.readdirSync(contentDir)
    console.log("Files found:", files)

    const markdownFiles = files.filter((file) => file.endsWith(".md"))
    console.log("Markdown files:", markdownFiles)

    // Find the file that matches the slug
    const matchingFile = markdownFiles.find((filename) => {
      const fileSlug = filename.replace(".md", "").toLowerCase().replace(/\s+/g, "-")
      console.log(`Comparing slug "${params.slug}" with file slug "${fileSlug}"`)
      return fileSlug === params.slug
    })

    if (!matchingFile) {
      console.log("No matching file found for slug:", params.slug)
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    console.log("Found matching file:", matchingFile)

    const filePath = path.join(contentDir, matchingFile)
    const fileContent = fs.readFileSync(filePath, "utf8")
    const { data: frontmatter, content } = matter(fileContent)

    console.log("Raw content length:", content.length)
    console.log("Content preview:", content.substring(0, 200))

    // Configure marked for better HTML output
    marked.setOptions({
      breaks: true,
      gfm: true,
    })

    const htmlContent = marked(content)
    console.log("HTML content length:", htmlContent.length)
    console.log("HTML preview:", htmlContent.substring(0, 200))

    return NextResponse.json({
      article: {
        slug: params.slug,
        title: frontmatter.title || matchingFile.replace(".md", ""),
        subtitle: frontmatter.subtitle,
        date: frontmatter.date || new Date().toISOString(),
        excerpt: frontmatter.excerpt || content.substring(0, 150) + "...",
        content: htmlContent,
        tags: frontmatter.tags || [],
        featured_image: frontmatter.featured_image || frontmatter.image,
        reading_time: frontmatter.reading_time || Math.ceil(content.split(" ").length / 200),
        featured: frontmatter.featured || false,
        medium_link: frontmatter.medium_link,
        devto_link: frontmatter.devto_link,
        substack_link: frontmatter.substack_link,
      },
    })
  } catch (error) {
    console.error("Error loading article:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
