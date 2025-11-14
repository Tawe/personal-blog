import fs from "fs"
import path from "path"
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
 * Lightweight version that only parses frontmatter for metadata (build-time use)
 * Does NOT process markdown to HTML or import gray-matter/marked
 */
export function getArticleLightweight(
  options: GetArticleOptions
): ArticleMetadata | null {
  const { contentDir, slug, defaultType, customFields = {} } = options

  try {
    const matchingFile = findFileBySlug(contentDir, slug)

    if (!matchingFile) {
      return null
    }

    const filePath = path.join(contentDir, matchingFile)
    const fileContent = fs.readFileSync(filePath, "utf8")
    
    // Parse frontmatter manually to avoid importing gray-matter at build time
    const frontmatterMatch = fileContent.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
    let frontmatter: any = {}
    let content = fileContent
    
    if (frontmatterMatch) {
      const frontmatterText = frontmatterMatch[1]
      content = frontmatterMatch[2]
      
      // Simple YAML parsing for common fields
      const titleMatch = frontmatterText.match(/^title:\s*(.+)$/m)
      const subtitleMatch = frontmatterText.match(/^subtitle:\s*(.+)$/m)
      const dateMatch = frontmatterText.match(/^date:\s*(.+)$/m)
      const excerptMatch = frontmatterText.match(/^excerpt:\s*(.+)$/m)
      const tagsMatch = frontmatterText.match(/^tags:\s*\[(.*?)\]/s)
      const imageMatch = frontmatterText.match(/^featured_image:\s*(.+)$/m)
      const readingTimeMatch = frontmatterText.match(/^reading_time:\s*(\d+)$/m)
      const featuredMatch = frontmatterText.match(/^featured:\s*(true|false)$/m)
      const mediumLinkMatch = frontmatterText.match(/^medium_link:\s*(.+)$/m)
      const devtoLinkMatch = frontmatterText.match(/^devto_link:\s*(.+)$/m)
      const substackLinkMatch = frontmatterText.match(/^substack_link:\s*(.+)$/m)
      const dndbeyondLinkMatch = frontmatterText.match(/^dndbeyond_link:\s*(.+)$/m)
      const ddbLinkMatch = frontmatterText.match(/^ddb_link:\s*(.+)$/m)
      const updatedMatch = frontmatterText.match(/^updated:\s*(.+)$/m)
      
      if (titleMatch) frontmatter.title = titleMatch[1].trim().replace(/^["']|["']$/g, "")
      if (subtitleMatch) frontmatter.subtitle = subtitleMatch[1].trim().replace(/^["']|["']$/g, "")
      if (dateMatch) frontmatter.date = dateMatch[1].trim().replace(/^["']|["']$/g, "")
      if (excerptMatch) frontmatter.excerpt = excerptMatch[1].trim().replace(/^["']|["']$/g, "")
      if (imageMatch) frontmatter.featured_image = imageMatch[1].trim().replace(/^["']|["']$/g, "")
      if (readingTimeMatch) frontmatter.reading_time = parseInt(readingTimeMatch[1])
      if (featuredMatch) frontmatter.featured = featuredMatch[1] === "true"
      if (mediumLinkMatch) frontmatter.medium_link = mediumLinkMatch[1].trim().replace(/^["']|["']$/g, "")
      if (devtoLinkMatch) frontmatter.devto_link = devtoLinkMatch[1].trim().replace(/^["']|["']$/g, "")
      if (substackLinkMatch) frontmatter.substack_link = substackLinkMatch[1].trim().replace(/^["']|["']$/g, "")
      if (dndbeyondLinkMatch) frontmatter.dndbeyond_link = dndbeyondLinkMatch[1].trim().replace(/^["']|["']$/g, "")
      if (ddbLinkMatch) frontmatter.ddb_link = ddbLinkMatch[1].trim().replace(/^["']|["']$/g, "")
      if (updatedMatch) frontmatter.updated = updatedMatch[1].trim().replace(/^["']|["']$/g, "")
      
      if (tagsMatch) {
        const tagsStr = tagsMatch[1]
        frontmatter.tags = tagsStr
          .split(",")
          .map(t => t.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean)
      } else {
        frontmatter.tags = []
      }
    }

    // Calculate reading time
    const readingTime =
      frontmatter.reading_time ||
      Math.ceil(content.split(" ").length / 200)

    // Generate excerpt
    const excerpt =
      frontmatter.excerpt || content.substring(0, 150) + "..."

    // Base article metadata (no HTML content processing)
    const article: ArticleMetadata = {
      slug,
      title: frontmatter.title || matchingFile.replace(".md", ""),
      subtitle: frontmatter.subtitle,
      date: frontmatter.date || new Date().toISOString(),
      excerpt,
      content: "", // Don't process markdown at build time
      tags: frontmatter.tags || [],
      featured_image: frontmatter.featured_image || frontmatter.image,
      reading_time: readingTime,
      featured: frontmatter.featured || false,
      ...customFields,
    }

    // Add common optional fields
    if (frontmatter.medium_link) article.medium_link = frontmatter.medium_link
    if (frontmatter.devto_link) article.devto_link = frontmatter.devto_link
    if (frontmatter.substack_link) article.substack_link = frontmatter.substack_link
    if (frontmatter.dndbeyond_link || frontmatter.ddb_link)
      article.dndbeyond_link = frontmatter.dndbeyond_link || frontmatter.ddb_link
    if (frontmatter.updated) article.updated = frontmatter.updated

    return article
  } catch (error) {
    console.error("Error loading article:", error)
    return null
  }
}

/**
 * Fetches a single article by slug from a content directory
 * Handles markdown parsing, frontmatter extraction, and content processing
 * Use getArticleLightweight for build-time (generateMetadata) to avoid bundling issues
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
    
    // Dynamic import to avoid bundling at build time
    const matterModule = await import("gray-matter")
    const matter = matterModule.default || matterModule
    const { data: frontmatter, content } = matter(fileContent)
    
    // Use configured marked with syntax highlighting
    const { getConfiguredMarked } = await import("@/lib/markdown-config")
    const markedParse = await getConfiguredMarked()
    const htmlContent = markedParse(content)

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

