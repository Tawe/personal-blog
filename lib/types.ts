export interface Article {
  title: string
  date: string
  excerpt: string
  tags: string[]
  featured_image?: string
  reading_time: number
  draft: boolean
  slug: string
  content?: string
  featured?: boolean
  medium_link?: string
  devto_link?: string
  substack_link?: string
}

export interface FilterOptions {
  search: string
  tags: string[]
  dateRange: {
    start: string
    end: string
  }
  readingTime: {
    min: number
    max: number
  }
  featured: boolean | null
}

export interface SortOption {
  field: "date" | "title" | "reading_time"
  direction: "asc" | "desc"
}

export type ViewMode = "grid" | "list"

export interface HubConfig {
  title: string
  description: string
  contentFolder: string
  baseUrl: string
  breadcrumbPath: string
  theme: {
    primary: string
    secondary: string
    accent: string
  }
}
