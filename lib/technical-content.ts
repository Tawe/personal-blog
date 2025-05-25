import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface TechnicalArticleMetadata {
  title: string
  date: string
  updated?: string
  excerpt?: string
  tags: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  type: "tutorial" | "guide" | "analysis" | "documentation"
  reading_time?: number
  featured_image?: string
  code_languages?: string[]
  recently_updated?: boolean
  draft?: boolean
  slug: string
}

export interface TechnicalArticle extends TechnicalArticleMetadata {
  content: string
  code_preview?: string
}

const technicalContentDirectory = path.join(process.cwd(), "content", "technical-writings")

export function getAllTechnicalArticles(): TechnicalArticleMetadata[] {
  // Create directory if it doesn't exist
  if (!fs.existsSync(technicalContentDirectory)) {
    fs.mkdirSync(technicalContentDirectory, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(technicalContentDirectory)
  const articles = fileNames
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, "")
      const fullPath = path.join(technicalContentDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      // Calculate reading time if not provided
      const wordsPerMinute = 200
      const wordCount = content.split(/\s+/).length
      const readingTime = data.reading_time || Math.ceil(wordCount / wordsPerMinute)

      // Generate excerpt if not provided
      const excerpt = data.excerpt || content.slice(0, 150).replace(/[#*`]/g, "").trim() + "..."

      // Check if recently updated (within last 30 days)
      const recently_updated = data.updated
        ? new Date(data.updated) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        : false

      return {
        slug,
        title: data.title || "Untitled",
        date: data.date || new Date().toISOString().split("T")[0],
        updated: data.updated,
        excerpt,
        tags: data.tags || [],
        difficulty: data.difficulty || "intermediate",
        type: data.type || "guide",
        reading_time: readingTime,
        featured_image: data.featured_image,
        code_languages: data.code_languages || [],
        recently_updated,
        draft: data.draft || false,
      }
    })
    .filter((article) => !article.draft) // Filter out drafts in production
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return articles
}

export function getTechnicalArticleBySlug(slug: string): TechnicalArticle | null {
  try {
    const fullPath = path.join(technicalContentDirectory, `${slug}.md`)

    // Try .mdx if .md doesn't exist
    const finalPath = fs.existsSync(fullPath) ? fullPath : path.join(technicalContentDirectory, `${slug}.mdx`)

    if (!fs.existsSync(finalPath)) {
      return null
    }

    const fileContents = fs.readFileSync(finalPath, "utf8")
    const { data, content } = matter(fileContents)

    // Extract first code block for preview
    const codeBlockMatch = content.match(/```[\s\S]*?```/)
    const code_preview = codeBlockMatch ? codeBlockMatch[0] : undefined

    // Calculate reading time if not provided
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = data.reading_time || Math.ceil(wordCount / wordsPerMinute)

    // Generate excerpt if not provided
    const excerpt = data.excerpt || content.slice(0, 150).replace(/[#*`]/g, "").trim() + "..."

    // Check if recently updated (within last 30 days)
    const recently_updated = data.updated
      ? new Date(data.updated) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      : false

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString().split("T")[0],
      updated: data.updated,
      excerpt,
      tags: data.tags || [],
      difficulty: data.difficulty || "intermediate",
      type: data.type || "guide",
      reading_time: readingTime,
      featured_image: data.featured_image,
      code_languages: data.code_languages || [],
      recently_updated,
      draft: data.draft || false,
      content,
      code_preview,
    }
  } catch (error) {
    console.error(`Error loading technical article ${slug}:`, error)
    return null
  }
}

export function getAllTechnicalTags(): string[] {
  const articles = getAllTechnicalArticles()
  const allTags = articles.flatMap((article) => article.tags)
  return Array.from(new Set(allTags)).sort()
}

export function getAllCodeLanguages(): string[] {
  const articles = getAllTechnicalArticles()
  const allLanguages = articles.flatMap((article) => article.code_languages || [])
  return Array.from(new Set(allLanguages)).sort()
}
