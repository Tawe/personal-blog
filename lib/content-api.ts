import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"

export interface ContentConfig {
  contentDir: string
  defaultType?: string
  customFields?: { [key: string]: any }
}

export interface ProcessedArticle {
  slug: string
  title: string
  subtitle?: string
  date: string
  excerpt: string
  content: string
  tags: string[]
  featured_image?: string
  reading_time: number
  [key: string]: any // Allow for content-type specific fields
}

function sanitizeExcerpt(raw: string, length = 150): string {
  const text = raw
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, "") // inline/code blocks
    .replace(/^>\s?/gm, "") // blockquotes
    .replace(/^#{1,6}\s*/gm, "") // headings
    .replace(/[\*_~\[\]#>]/g, "") // emphasis and misc md chars
    .replace(/\n+/g, " ")
    .trim()
  return (text.slice(0, length).trim() + (text.length > length ? "..." : ""))
}

export function processContentDirectory(config: ContentConfig): ProcessedArticle[] {
  const { contentDir, defaultType, customFields = {} } = config

  if (!fs.existsSync(contentDir)) {
    return []
  }

  const files = fs.readdirSync(contentDir)
  const markdownFiles = files.filter((file) => file.endsWith(".md"))

  const articles = markdownFiles.map((filename) => {
    const filePath = path.join(contentDir, filename)
    const fileContent = fs.readFileSync(filePath, "utf8")
    const { data: frontmatter, content } = matter(fileContent)

    const slug = filename
      .replace(".md", "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, "") // Remove leading/trailing hyphens

    // Base article structure
    const baseArticle: ProcessedArticle = {
      slug,
      title: frontmatter.title || filename.replace(".md", ""),
      subtitle: frontmatter.subtitle,
      date: frontmatter.date || new Date().toISOString(),
      excerpt: frontmatter.excerpt || sanitizeExcerpt(content, 180),
      content: marked(content), // Convert markdown to HTML
      tags: frontmatter.tags || [],
      featured_image: frontmatter.featured_image || frontmatter.image,
      reading_time: frontmatter.reading_time || Math.ceil(content.split(" ").length / 200),
    }

    // Add any additional custom fields from frontmatter
    Object.keys(customFields).forEach((key) => {
      if (frontmatter[key] !== undefined) {
        baseArticle[key] = frontmatter[key]
      } else if (customFields[key] !== undefined) {
        baseArticle[key] = customFields[key]
      }
    })

    // Add any other frontmatter fields not already included
    Object.keys(frontmatter).forEach((key) => {
      if (!baseArticle.hasOwnProperty(key)) {
        baseArticle[key] = frontmatter[key]
      }
    })

    return baseArticle
  })

  return articles
}

export function createContentApiResponse(config: ContentConfig) {
  try {
    // Check if content directory exists
    if (!fs.existsSync(config.contentDir)) {
      console.error(`Content directory does not exist: ${config.contentDir}`)
      return NextResponse.json({ 
        articles: [],
        error: `Content directory not found: ${config.contentDir}`,
        tags: []
      })
    }
    
    const articles = processContentDirectory(config)
    
    // Extract unique tags from all articles
    const allTags = new Set<string>()
    articles.forEach(article => {
      if (article.tags && Array.isArray(article.tags)) {
        article.tags.forEach(tag => allTags.add(tag))
      }
    })
    
    return NextResponse.json({ 
      articles,
      tags: Array.from(allTags).sort()
    })
  } catch (error) {
    const contentType = path.basename(config.contentDir)
    console.error(`Error loading ${contentType} articles:`, error)
    return NextResponse.json({ 
      articles: [],
      tags: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export function getArticleBySlug(config: ContentConfig, slug: string): ProcessedArticle | null {
  const articles = processContentDirectory(config)
  return articles.find(article => article.slug === slug) || null
}

export function getAllArticles(config: ContentConfig): ProcessedArticle[] {
  return processContentDirectory(config)
}

export function createSingleArticleApiResponse(config: ContentConfig, slug: string) {
  try {
    const article = getArticleBySlug(config, slug)
    
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({ article })
  } catch (error) {
    const contentType = path.basename(config.contentDir)
    console.error(`Error loading ${contentType} article:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
