import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"
import { generateSlug, findFileBySlug } from "./slug-utils"

export interface ArticleMetadata {
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

export interface GetArticleOptions {
  contentDir: string
  slug: string
  defaultType?: string
  customFields?: Record<string, any>
}

/**
 * Fetches a single article by slug from a content directory
 * Handles markdown parsing, frontmatter extraction, and content processing
 */
export async function getArticle(
  options: GetArticleOptions
): Promise<ArticleMetadata | null> {
  const { contentDir, slug, defaultType, customFields = {} } = options

  try {
    const matchingFile = findFileBySlug(contentDir, slug)

    if (!matchingFile) {
      return null
    }

    const filePath = path.join(contentDir, matchingFile)
    const fileContent = fs.readFileSync(filePath, "utf8")
    const { data: frontmatter, content } = matter(fileContent)
    const htmlContent = await marked(content)

    // Calculate reading time (average 200 words per minute)
    const readingTime =
      frontmatter.reading_time ||
      Math.ceil(content.split(" ").length / 200)

    // Generate excerpt
    const excerpt =
      frontmatter.excerpt || content.substring(0, 150) + "..."

    // Base article metadata
    const article: ArticleMetadata = {
      slug,
      title: frontmatter.title || matchingFile.replace(".md", ""),
      subtitle: frontmatter.subtitle,
      date: frontmatter.date || new Date().toISOString(),
      excerpt,
      content: htmlContent,
      tags: frontmatter.tags || [],
      featured_image: frontmatter.featured_image || frontmatter.image,
      reading_time: readingTime,
      featured: frontmatter.featured || false,
      ...customFields,
    }

    // Add common optional fields
    if (frontmatter.medium_link) article.medium_link = frontmatter.medium_link
    if (frontmatter.devto_link) article.devto_link = frontmatter.devto_link
    if (frontmatter.substack_link)
      article.substack_link = frontmatter.substack_link
    if (frontmatter.dndbeyond_link || frontmatter.ddb_link)
      article.dndbeyond_link = frontmatter.dndbeyond_link || frontmatter.ddb_link
    if (frontmatter.updated) article.updated = frontmatter.updated

    // Merge frontmatter fields (allowing overrides)
    Object.keys(frontmatter).forEach((key) => {
      if (!article[key]) {
        article[key] = frontmatter[key]
      }
    })

    return article
  } catch (error) {
    console.error("Error loading article:", error)
    return null
  }
}

