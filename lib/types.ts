// Client-safe types only - no Node.js imports

export interface BaseContentMetadata {
  title: string
  subtitle?: string
  date: string
  excerpt?: string
  tags: string[]
  featured_image?: string
  reading_time?: number
  draft?: boolean
  slug: string
  website_exclusive?: boolean
  series?: string
  series_slug?: string
  series_order?: number
  series_description?: string
}

export interface ArticleMetadata extends BaseContentMetadata {
  medium_link?: string
  devto_link?: string
  substack_link?: string
  linkedin_link?: string
}

export interface TechnicalArticleMetadata extends BaseContentMetadata {
  updated?: string
  code_languages?: string[]
  recently_updated?: boolean
}

export interface ArtumiContentMetadata extends BaseContentMetadata {
  type: "story" | "lore" | "character" | "location" | "history" | "organization"
  categories: string[]
  region?: string
  status: "complete" | "in-progress" | "planned"
  connections?: string[]
}

export interface DndContentMetadata extends BaseContentMetadata {
  type: "thought-piece" | "mechanic" | "monster" | "magic-item" | "npc" | "adventure" | "product"
  system: "5e" | "pathfinder" | "system-agnostic"
  level_range?: string
  availability: "free" | "premium" | "commercial"
  duration?: string
  price?: string
  platform?: "dmsguild" | "drivethrurpg" | "itch"
  external_url?: string
  rating?: string
  playtested?: boolean
}

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

export interface Article extends ArticleMetadata {
  content: string
}

export interface TechnicalArticle extends TechnicalArticleMetadata {
  content: string
  code_preview?: string
}

export interface ArtumiContent extends ArtumiContentMetadata {
  content: string
}

export interface DndContent extends DndContentMetadata {
  content: string
}

export interface HubConfig {
  title?: string
  description?: string
  contentFolder: "leadership" | "technical-writings" | "artumin" | "dnd-musings"
  baseUrl: string
}
