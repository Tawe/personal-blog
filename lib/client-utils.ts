// Client-safe utility functions that don't use Node.js modules
import { getDateTimestamp, parseDatePreservingCalendar } from "@/lib/date-utils"

export interface FilterOptions {
  search: string
  tags: string[]
  dateRange: { start: string; end: string }
  readingTime: { min: number; max: number }
  featured: boolean | null
}

export interface SortOption {
  field: "date" | "title" | "reading_time"
  direction: "asc" | "desc"
}

export type ViewMode = "grid" | "list"

export interface Article {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  featured_image?: string
  reading_time: number
  draft?: boolean
  featured?: boolean
  medium_link?: string
  devto_link?: string
  substack_link?: string
}

export function filterArticles<T extends Article>(articles: T[], filters: FilterOptions): T[] {
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
      const articleDate = parseDatePreservingCalendar(article.date)
      if (filters.dateRange.start && articleDate < parseDatePreservingCalendar(filters.dateRange.start)) return false
      if (filters.dateRange.end && articleDate > parseDatePreservingCalendar(filters.dateRange.end)) return false
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

export function sortArticles<T extends Article>(articles: T[], sort: SortOption): T[] {
  return [...articles].sort((a, b) => {
    let comparison = 0

    switch (sort.field) {
      case "date":
        comparison = getDateTimestamp(a.date) - getDateTimestamp(b.date)
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
