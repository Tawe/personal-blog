// NOTE: All content fetching and markdown parsing should be done via API routes or server functions, not in this file. This file should only contain client-safe utilities and types.

import type { Article, FilterOptions, SortOption } from "./types"

// Example client-safe utility functions (implement as needed)
export function getAllArticles(contentFolder: string) {
  // Fetch from API route instead
  return [];
}

export function getArticleBySlug(contentFolder: string, slug: string) {
  // Fetch from API route instead
  return null;
}

export function getAllTags(contentFolder: string): string[] {
  // Fetch from API route instead
  return [];
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
        comparison = (a.reading_time || 0) - (b.reading_time || 0)
        break
    }

    return sort.direction === "desc" ? -comparison : comparison
  })
}
