import fs from "fs"
import path from "path"
import matter from "gray-matter"

// Base content metadata interface
export interface BaseContentMetadata {
  title: string
  date: string
  excerpt?: string
  tags: string[]
  featured_image?: string
  reading_time?: number
  draft?: boolean
  slug: string
}

// Extended interfaces for specific content types
export interface ArticleMetadata extends BaseContentMetadata {
  // Leadership insights specific fields
  medium_link?: string
  devto_link?: string
  substack_link?: string
}

export interface TechnicalArticleMetadata extends BaseContentMetadata {
  updated?: string
  difficulty: "beginner" | "intermediate" | "advanced"
  type: "tutorial" | "guide" | "analysis" | "documentation"
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

// Content with full content
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

// Unified content utilities
const contentDirectory = path.join(process.cwd(), "content")

function getContentDirectory(section: string) {
  return path.join(contentDirectory, section)
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

function processContentFile<T extends BaseContentMetadata>(
  fileName: string,
  sectionDir: string,
  additionalProcessor?: (data: any, content: string) => Partial<T>,
): T {
  const slug = fileName.replace(/\.(md|mdx)$/, "")
  const fullPath = path.join(sectionDir, fileName)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  const readingTime = calculateReadingTime(content, data.reading_time)
  const excerpt = generateExcerpt(content, data.excerpt)

  const baseMetadata = {
    slug,
    title: data.title || "Untitled",
    date: data.date || new Date().toISOString().split("T")[0],
    excerpt,
    tags: data.tags || [],
    featured_image: data.featured_image,
    reading_time: readingTime,
    draft: data.draft || false,
  }

  const additionalData = additionalProcessor ? additionalProcessor(data, content) : {}

  return { ...baseMetadata, ...additionalData } as T
}

// Generic content fetching functions
export function getAllContent<T extends BaseContentMetadata>(
  section: string,
  processor?: (data: any, content: string) => Partial<T>,
): T[] {
  const sectionDir = getContentDirectory(section)

  if (!fs.existsSync(sectionDir)) {
    fs.mkdirSync(sectionDir, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(sectionDir)
  const content = fileNames
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((fileName) => processContentFile<T>(fileName, sectionDir, processor))
    .filter((item) => !item.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return content
}

export function getContentBySlug<T extends BaseContentMetadata, U extends T & { content: string }>(
  section: string,
  slug: string,
  processor?: (data: any, content: string) => Partial<T>,
): U | null {
  try {
    const sectionDir = getContentDirectory(section)
    const fullPath = path.join(sectionDir, `${slug}.md`)
    const finalPath = fs.existsSync(fullPath) ? fullPath : path.join(sectionDir, `${slug}.mdx`)

    if (!fs.existsSync(finalPath)) {
      return null
    }

    const fileContents = fs.readFileSync(finalPath, "utf8")
    const { data, content } = matter(fileContents)

    const readingTime = calculateReadingTime(content, data.reading_time)
    const excerpt = generateExcerpt(content, data.excerpt)

    const baseMetadata = {
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

    const additionalData = processor ? processor(data, content) : {}

    return { ...baseMetadata, ...additionalData } as U
  } catch (error) {
    console.error(`Error loading content ${slug}:`, error)
    return null
  }
}

export function getAllTags(section: string): string[] {
  const content = getAllContent(section)
  const allTags = content.flatMap((item) => item.tags)
  return Array.from(new Set(allTags)).sort()
}

// Specific content type functions
export function getAllArticles(): ArticleMetadata[] {
  return getAllContent<ArticleMetadata>("leadership", (data) => ({
    medium_link: data.medium_link,
    devto_link: data.devto_link,
    substack_link: data.substack_link,
  }))
}

export function getArticleBySlug(slug: string): Article | null {
  return getContentBySlug<ArticleMetadata, Article>("leadership", slug, (data) => ({
    medium_link: data.medium_link,
    devto_link: data.devto_link,
    substack_link: data.substack_link,
  }))
}

export function getAllTechnicalArticles(): TechnicalArticleMetadata[] {
  return getAllContent<TechnicalArticleMetadata>("technical-writings", (data, content) => ({
    updated: data.updated,
    difficulty: data.difficulty || "intermediate",
    type: data.type || "guide",
    code_languages: data.code_languages || [],
    recently_updated: data.updated ? new Date(data.updated) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : false,
  }))
}

export function getTechnicalArticleBySlug(slug: string): TechnicalArticle | null {
  return getContentBySlug<TechnicalArticleMetadata, TechnicalArticle>("technical-writings", slug, (data, content) => {
    const codeBlockMatch = content.match(/```[\s\S]*?```/)
    return {
      updated: data.updated,
      difficulty: data.difficulty || "intermediate",
      type: data.type || "guide",
      code_languages: data.code_languages || [],
      recently_updated: data.updated ? new Date(data.updated) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : false,
      code_preview: codeBlockMatch ? codeBlockMatch[0] : undefined,
    }
  })
}

export function getAllArtumiContent(): ArtumiContentMetadata[] {
  return getAllContent<ArtumiContentMetadata>("artumin", (data) => ({
    type: data.type || "lore",
    categories: data.categories || [],
    region: data.region,
    status: data.status || "complete",
    connections: data.connections || [],
  }))
}

export function getArtumiContentBySlug(slug: string): ArtumiContent | null {
  return getContentBySlug<ArtumiContentMetadata, ArtumiContent>("artumin", slug, (data) => ({
    type: data.type || "lore",
    categories: data.categories || [],
    region: data.region,
    status: data.status || "complete",
    connections: data.connections || [],
  }))
}

export function getAllDndContent(): DndContentMetadata[] {
  return getAllContent<DndContentMetadata>("dnd-musings", (data) => ({
    type: data.type || "thought-piece",
    system: data.system || "system-agnostic",
    level_range: data.level_range,
    availability: data.availability || "free",
    duration: data.duration,
    price: data.price,
    platform: data.platform,
    external_url: data.external_url,
    rating: data.rating,
    playtested: data.playtested || false,
  }))
}

export function getDndContentBySlug(slug: string): DndContent | null {
  return getContentBySlug<DndContentMetadata, DndContent>("dnd-musings", slug, (data) => ({
    type: data.type || "thought-piece",
    system: data.system || "system-agnostic",
    level_range: data.level_range,
    availability: data.availability || "free",
    duration: data.duration,
    price: data.price,
    platform: data.platform,
    external_url: data.external_url,
    rating: data.rating,
    playtested: data.playtested || false,
  }))
}

// Utility functions
export function getAllArtumiCategories(): string[] {
  const content = getAllArtumiContent()
  const allCategories = content.flatMap((item) => item.categories)
  return Array.from(new Set(allCategories)).sort()
}

export function getAllArtumiRegions(): string[] {
  const content = getAllArtumiContent()
  const allRegions = content.map((item) => item.region).filter(Boolean) as string[]
  return Array.from(new Set(allRegions)).sort()
}

export function getAllTechnicalTags(): string[] {
  return getAllTags("technical-writings")
}

export function getAllCodeLanguages(): string[] {
  const articles = getAllTechnicalArticles()
  const allLanguages = articles.flatMap((article) => article.code_languages || [])
  return Array.from(new Set(allLanguages)).sort()
}

export function getAllDndTags(): string[] {
  return getAllTags("dnd-musings")
}

export function getAllDndSystems(): string[] {
  const content = getAllDndContent()
  const allSystems = content.map((item) => item.system)
  return Array.from(new Set(allSystems)).sort()
}

export function getRelatedArtumiContent(slug: string, connections: string[]): ArtumiContentMetadata[] {
  const allContent = getAllArtumiContent()
  return allContent.filter(
    (content) => content.slug !== slug && (connections.includes(content.slug) || content.connections?.includes(slug)),
  )
}

export function getRelatedDndContent(slug: string, tags: string[], type: string): DndContentMetadata[] {
  const allContent = getAllDndContent()
  return allContent
    .filter((content) => content.slug !== slug)
    .filter((content) => content.type === type || tags.some((tag) => content.tags.includes(tag)))
    .slice(0, 3)
}
