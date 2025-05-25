import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface ArtumiContentMetadata {
  title: string
  date: string
  type: "story" | "lore" | "character" | "location" | "history" | "organization"
  excerpt?: string
  categories: string[]
  region?: string
  featured_image?: string
  status: "complete" | "in-progress" | "planned"
  connections?: string[]
  reading_time?: number
  draft?: boolean
  slug: string
}

export interface ArtumiContent extends ArtumiContentMetadata {
  content: string
}

const artumiContentDirectory = path.join(process.cwd(), "content", "artumin")

export function getAllArtumiContent(): ArtumiContentMetadata[] {
  // Create directory if it doesn't exist
  if (!fs.existsSync(artumiContentDirectory)) {
    fs.mkdirSync(artumiContentDirectory, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(artumiContentDirectory)
  const content = fileNames
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, "")
      const fullPath = path.join(artumiContentDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      // Calculate reading time if not provided
      const wordsPerMinute = 200
      const wordCount = content.split(/\s+/).length
      const readingTime = data.reading_time || Math.ceil(wordCount / wordsPerMinute)

      // Generate excerpt if not provided
      const excerpt = data.excerpt || content.slice(0, 200).replace(/[#*`]/g, "").trim() + "..."

      return {
        slug,
        title: data.title || "Untitled",
        date: data.date || new Date().toISOString().split("T")[0],
        type: data.type || "lore",
        excerpt,
        categories: data.categories || [],
        region: data.region,
        featured_image: data.featured_image,
        status: data.status || "complete",
        connections: data.connections || [],
        reading_time: readingTime,
        draft: data.draft || false,
      }
    })
    .filter((content) => !content.draft) // Filter out drafts in production
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return content
}

export function getArtumiContentBySlug(slug: string): ArtumiContent | null {
  try {
    const fullPath = path.join(artumiContentDirectory, `${slug}.md`)

    // Try .mdx if .md doesn't exist
    const finalPath = fs.existsSync(fullPath) ? fullPath : path.join(artumiContentDirectory, `${slug}.mdx`)

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
    const excerpt = data.excerpt || content.slice(0, 200).replace(/[#*`]/g, "").trim() + "..."

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString().split("T")[0],
      type: data.type || "lore",
      excerpt,
      categories: data.categories || [],
      region: data.region,
      featured_image: data.featured_image,
      status: data.status || "complete",
      connections: data.connections || [],
      reading_time: readingTime,
      draft: data.draft || false,
      content,
    }
  } catch (error) {
    console.error(`Error loading Artumin content ${slug}:`, error)
    return null
  }
}

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

export function getRelatedArtumiContent(slug: string, connections: string[]): ArtumiContentMetadata[] {
  const allContent = getAllArtumiContent()
  return allContent.filter(
    (content) => content.slug !== slug && (connections.includes(content.slug) || content.connections?.includes(slug)),
  )
}
