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
      excerpt: frontmatter.excerpt || content.substring(0, 150) + "...",
      content: marked(content), // Convert markdown to HTML
      tags: frontmatter.tags || [],
      featured_image: frontmatter.featured_image || frontmatter.image,
      reading_time: frontmatter.reading_time || Math.ceil(content.split(" ").length / 200),
    }

    // Add default type if provided
    if (defaultType) {
      baseArticle.type = frontmatter.type || defaultType
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
    const articles = processContentDirectory(config)
    return NextResponse.json({ articles })
  } catch (error) {
    const contentType = path.basename(config.contentDir)
    console.error(`Error loading ${contentType} articles:`, error)
    return NextResponse.json({ articles: [] })
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
