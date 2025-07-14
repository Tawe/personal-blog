import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const contentDir = path.join(process.cwd(), "content/technical-writings")
    const files = fs.readdirSync(contentDir)
    const markdownFiles = files.filter((file) => file.endsWith(".md"))
    const matchingFile = markdownFiles.find((filename) => {
      const fileSlug = filename.replace(".md", "").toLowerCase().replace(/\s+/g, "-")
      return fileSlug === params.slug
    })
    if (!matchingFile) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }
    const filePath = path.join(contentDir, matchingFile)
    const fileContent = fs.readFileSync(filePath, "utf8")
    const { data: frontmatter, content } = matter(fileContent)
    const htmlContent = marked(content)
    
    const response = NextResponse.json({
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
    
    // Add caching headers for Vercel
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600')
    response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=3600')
    
    return response
  } catch (error) {
    console.error("Error loading article:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 