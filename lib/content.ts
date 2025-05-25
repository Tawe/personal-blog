import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface ArticleMetadata {
  title: string
  date: string
  excerpt?: string
  tags: string[]
  featured_image?: string
  reading_time?: number
  draft?: boolean
  slug: string
}

export interface Article extends ArticleMetadata {
  content: string
}

const contentDirectory = path.join(process.cwd(), "content")

export function getContentDirectory(section: string) {
  return path.join(contentDirectory, section)
}

export function getAllArticles(section: string): ArticleMetadata[] {
  const sectionDir = getContentDirectory(section)

  // Create directory if it doesn't exist
  if (!fs.existsSync(sectionDir)) {
    fs.mkdirSync(sectionDir, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(sectionDir)
  const articles = fileNames
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, "")
      const fullPath = path.join(sectionDir, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      // Calculate reading time if not provided
      const wordsPerMinute = 200
      const wordCount = content.split(/\s+/).length
      const readingTime = data.reading_time || Math.ceil(wordCount / wordsPerMinute)

      // Generate excerpt if not provided
      const excerpt = data.excerpt || content.slice(0, 150).replace(/[#*`]/g, "").trim() + "..."

      return {
        slug,
        title: data.title || "Untitled",
        date: data.date || new Date().toISOString().split("T")[0],
        excerpt,
        tags: data.tags || [],
        featured_image: data.featured_image,
        reading_time: readingTime,
        draft: data.draft || false,
      }
    })
    .filter((article) => !article.draft) // Filter out drafts in production
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return articles
}

export function getArticleBySlug(section: string, slug: string): Article | null {
  try {
    const sectionDir = getContentDirectory(section)
    const fullPath = path.join(sectionDir, `${slug}.md`)

    // Try .mdx if .md doesn't exist
    const finalPath = fs.existsSync(fullPath) ? fullPath : path.join(sectionDir, `${slug}.mdx`)

    if (!fs.existsSync(finalPath)) {
      return null
    }

    const fileContents = fs.readFileSync(finalPath, "utf8")
    const { data, content } = matter(fileContents)

    // Calculate reading time if not provided
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = data.reading_time || Math.ceil(wordCount / wordsPerMinute)

    // Generate excerpt if not provided
    const excerpt = data.excerpt || content.slice(0, 150).replace(/[#*`]/g, "").trim() + "..."

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString().split("T")[0],
      excerpt,
      tags: data.tags || [],
      featured_image: data.featured_image,
      reading_time: readingTime,
      draft: data.draft || false,
      content,
    }
  } catch (error) {
    console.error(`Error loading article ${slug}:`, error)
    return null
  }
}

export function getAllTags(section: string): string[] {
  const articles = getAllArticles(section)
  const allTags = articles.flatMap((article) => article.tags)
  return Array.from(new Set(allTags)).sort()
}
