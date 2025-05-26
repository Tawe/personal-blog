import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"
import type { Article, FilterOptions, SortOption } from "./types"

const contentDirectory = path.join(process.cwd(), "content")

function getContentDirectory(folder: string) {
  return path.join(contentDirectory, folder)
}

function calculateReadingTime(content: string, providedTime?: number): number {
  if (providedTime) return providedTime
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

function generateExcerpt(content: string, providedExcerpt?: string, length = 150): string {
  if (providedExcerpt) return providedExcerpt
  return content.slice(0, length).replace(/[#*`]/g, "").trim() + "..."
}

function processMarkdownFile(fileName: string, folderPath: string): Article {
  const slug = fileName.replace(/\.(md|mdx)$/, "")
  const fullPath = path.join(folderPath, fileName)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  const readingTime = calculateReadingTime(content, data.reading_time)
  const excerpt = generateExcerpt(content, data.excerpt)

  return {
    slug,
    title: data.title || "Untitled",
    date: data.date || new Date().toISOString().split("T")[0],
    excerpt,
    tags: data.tags || [],
    featured_image: data.featured_image,
    reading_time: readingTime,
    draft: data.draft || false,
    featured: data.featured || false,
    medium_link: data.medium_link,
    devto_link: data.devto_link,
    substack_link: data.substack_link,
    content: marked(content),
  }
}

export function getAllArticles(contentFolder: string): Article[] {
  try {
    const folderPath = getContentDirectory(contentFolder)

    if (!fs.existsSync(folderPath)) {
      console.warn(`Content folder ${contentFolder} does not exist, creating empty directory`)
      fs.mkdirSync(folderPath, { recursive: true })
      return []
    }

    const fileNames = fs.readdirSync(folderPath)
    const articles = fileNames
      .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
      .map((fileName) => {
        try {
          return processMarkdownFile(fileName, folderPath)
        } catch (error) {
          console.error(`Error processing file ${fileName}:`, error)
          return null
        }
      })
      .filter((article): article is Article => article !== null)
      .filter((article) => !article.draft)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return articles
  } catch (error) {
    console.error(`Error loading articles from ${contentFolder}:`, error)
    return []
  }
}

export function getArticleBySlug(contentFolder: string, slug: string): Article | null {
  try {
    const decodedSlug = decodeURIComponent(slug)
    const folderPath = getContentDirectory(contentFolder)

    // Try different file extensions and slug formats
    const possibleFiles = [`${decodedSlug}.md`, `${decodedSlug}.mdx`, `${slug}.md`, `${slug}.mdx`]

    for (const fileName of possibleFiles) {
      const fullPath = path.join(folderPath, fileName)
      if (fs.existsSync(fullPath)) {
        return processMarkdownFile(fileName, folderPath)
      }
    }

    console.warn(`Article not found: ${slug} in ${contentFolder}`)
    return null
  } catch (error) {
    console.error(`Error loading article ${slug}:`, error)
    return null
  }
}

export function getAllTags(contentFolder: string): string[] {
  try {
    const articles = getAllArticles(contentFolder)
    const allTags = articles.flatMap((article) => article.tags)
    return Array.from(new Set(allTags)).sort()
  } catch (error) {
    console.error(`Error loading tags from ${contentFolder}:`, error)
    return []
  }
}

export function filterArticles(articles: Article[], filters: FilterOptions): Article[] {
  return articles.filter((article) => {
    // Search filter
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase()
      const titleMatch = article.title.toLowerCase().includes(searchLower)
      const excerptMatch = article.excerpt.toLowerCase().includes(searchLower)
      const tagMatch = article.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      if (!titleMatch && !excerptMatch && !tagMatch) return false
    }

    // Tag filter
    if (filters.tags.length > 0) {
      if (!filters.tags.every((tag) => article.tags.includes(tag))) return false
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      const articleDate = new Date(article.date)
      if (filters.dateRange.start && articleDate < new Date(filters.dateRange.start)) return false
      if (filters.dateRange.end && articleDate > new Date(filters.dateRange.end)) return false
    }

    // Reading time filter
    if (filters.readingTime.min > 0 || filters.readingTime.max < 60) {
      if (article.reading_time < filters.readingTime.min || article.reading_time > filters.readingTime.max) {
        return false
      }
    }

    // Featured filter
    if (filters.featured !== null) {
      if (article.featured !== filters.featured) return false
    }

    return true
  })
}

export function sortArticles(articles: Article[], sort: SortOption): Article[] {
  return [...articles].sort((a, b) => {
    let comparison = 0

    switch (sort.field) {
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        break
      case "title":
        comparison = a.title.localeCompare(b.title)
        break
      case "reading_time":
        comparison = a.reading_time - b.reading_time
        break
    }

    return sort.direction === "desc" ? -comparison : comparison
  })
}
