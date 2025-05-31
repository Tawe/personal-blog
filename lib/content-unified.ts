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

export function getAllArticles(contentFolder: string) {
  // Fetch from API route instead
  return [];
}

export function getArticleBySlug(contentFolder: string, slug: string) {
  // Fetch from API route instead
  return null;
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

export function filterArticles(articles: any[], filters: any) {
  // Filtering logic can remain if needed
  return articles;
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
