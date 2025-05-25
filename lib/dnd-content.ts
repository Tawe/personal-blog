import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface DndContentMetadata {
  title: string
  date: string
  type: "thought-piece" | "mechanic" | "monster" | "magic-item" | "npc" | "adventure" | "product"
  excerpt?: string
  system: "5e" | "pathfinder" | "system-agnostic"
  level_range?: string
  tags: string[]
  featured_image?: string
  availability: "free" | "premium" | "commercial"
  duration?: string
  price?: string
  platform?: "dmsguild" | "drivethrurpg" | "itch"
  external_url?: string
  rating?: string
  playtested?: boolean
  draft?: boolean
  slug: string
}

export interface DndContent extends DndContentMetadata {
  content: string
}

const dndContentDirectory = path.join(process.cwd(), "content", "dnd-musings")

export function getAllDndContent(): DndContentMetadata[] {
  // Create directory if it doesn't exist
  if (!fs.existsSync(dndContentDirectory)) {
    fs.mkdirSync(dndContentDirectory, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(dndContentDirectory)
  const content = fileNames
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, "")
      const fullPath = path.join(dndContentDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      // Generate excerpt if not provided
      const excerpt = data.excerpt || content.slice(0, 200).replace(/[#*`]/g, "").trim() + "..."

      return {
        slug,
        title: data.title || "Untitled",
        date: data.date || new Date().toISOString().split("T")[0],
        type: data.type || "thought-piece",
        excerpt,
        system: data.system || "system-agnostic",
        level_range: data.level_range,
        tags: data.tags || [],
        featured_image: data.featured_image,
        availability: data.availability || "free",
        duration: data.duration,
        price: data.price,
        platform: data.platform,
        external_url: data.external_url,
        rating: data.rating,
        playtested: data.playtested || false,
        draft: data.draft || false,
      }
    })
    .filter((content) => !content.draft) // Filter out drafts in production
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return content
}

export function getDndContentBySlug(slug: string): DndContent | null {
  try {
    const fullPath = path.join(dndContentDirectory, `${slug}.md`)

    // Try .mdx if .md doesn't exist
    const finalPath = fs.existsSync(fullPath) ? fullPath : path.join(dndContentDirectory, `${slug}.mdx`)

    if (!fs.existsSync(finalPath)) {
      return null
    }

    const fileContents = fs.readFileSync(finalPath, "utf8")
    const { data, content } = matter(fileContents)

    // Generate excerpt if not provided
    const excerpt = data.excerpt || content.slice(0, 200).replace(/[#*`]/g, "").trim() + "..."

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString().split("T")[0],
      type: data.type || "thought-piece",
      excerpt,
      system: data.system || "system-agnostic",
      level_range: data.level_range,
      tags: data.tags || [],
      featured_image: data.featured_image,
      availability: data.availability || "free",
      duration: data.duration,
      price: data.price,
      platform: data.platform,
      external_url: data.external_url,
      rating: data.rating,
      playtested: data.playtested || false,
      draft: data.draft || false,
      content,
    }
  } catch (error) {
    console.error(`Error loading D&D content ${slug}:`, error)
    return null
  }
}

export function getAllDndTags(): string[] {
  const content = getAllDndContent()
  const allTags = content.flatMap((item) => item.tags)
  return Array.from(new Set(allTags)).sort()
}

export function getAllDndSystems(): string[] {
  const content = getAllDndContent()
  const allSystems = content.map((item) => item.system)
  return Array.from(new Set(allSystems)).sort()
}

export function getRelatedDndContent(slug: string, tags: string[], type: string): DndContentMetadata[] {
  const allContent = getAllDndContent()
  return allContent
    .filter((content) => content.slug !== slug)
    .filter((content) => content.type === type || tags.some((tag) => content.tags.includes(tag)))
    .slice(0, 3)
}
