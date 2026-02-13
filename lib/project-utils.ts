import fs from "fs"
import path from "path"
import { generateSlug, findFileBySlug } from "./slug-utils"

export interface ProjectMetadata {
  slug: string
  title: string
  description: string
  subtitle?: string
  status: "active" | "experimental" | "archived"
  tags: string[]
  github?: string | null
  demo?: string | null
  icon: string
  featured_image?: string
  date: string
  content?: string // Full markdown content (for detail pages)
}

export interface GetProjectOptions {
  contentDir: string
  slug: string
}

/**
 * Lightweight version that only parses frontmatter for metadata (build-time use)
 */
export function getProjectLightweight(
  options: GetProjectOptions
): ProjectMetadata | null {
  const { contentDir, slug } = options

  try {
    const matchingFile = findFileBySlug(contentDir, slug)

    if (!matchingFile) {
      return null
    }

    const filePath = path.join(contentDir, matchingFile)
    const fileContent = fs.readFileSync(filePath, "utf8")
    
    // Parse frontmatter manually to avoid importing gray-matter at build time
    const frontmatterMatch = fileContent.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
    let frontmatter: any = {}
    
    if (frontmatterMatch) {
      const frontmatterText = frontmatterMatch[1]
      
      // Simple YAML parsing for project fields
      const titleMatch = frontmatterText.match(/^title:\s*(.+)$/m)
      const descMatch = frontmatterText.match(/^description:\s*(.+)$/m)
      const subtitleMatch = frontmatterText.match(/^subtitle:\s*(.+)$/m)
      const statusMatch = frontmatterText.match(/^status:\s*(.+)$/m)
      const githubMatch = frontmatterText.match(/^github:\s*(.+)$/m)
      const demoMatch = frontmatterText.match(/^demo:\s*(.+)$/m)
      const iconMatch = frontmatterText.match(/^icon:\s*(.+)$/m)
      const imageMatch = frontmatterText.match(/^featured_image:\s*(.+)$/m)
      const dateMatch = frontmatterText.match(/^date:\s*(.+)$/m)
      // Handle both YAML array formats: [item1, item2] and - item1\n  - item2
      const tagsArrayMatch = frontmatterText.match(/^tags:\s*\[(.*?)\]/s)
      const tagsListMatch = frontmatterText.match(/^tags:\s*\n((?:\s*-\s*.+\n?)+)/m)
      
      if (titleMatch) frontmatter.title = titleMatch[1].trim().replace(/^["']|["']$/g, "")
      if (descMatch) frontmatter.description = descMatch[1].trim().replace(/^["']|["']$/g, "")
      if (subtitleMatch) frontmatter.subtitle = subtitleMatch[1].trim().replace(/^["']|["']$/g, "")
      if (statusMatch) frontmatter.status = statusMatch[1].trim().replace(/^["']|["']$/g, "")
      if (githubMatch) frontmatter.github = githubMatch[1].trim().replace(/^["']|["']$/g, "")
      if (demoMatch) frontmatter.demo = demoMatch[1].trim().replace(/^["']|["']$/g, "")
      if (iconMatch) frontmatter.icon = iconMatch[1].trim().replace(/^["']|["']$/g, "")
      if (imageMatch) frontmatter.featured_image = imageMatch[1].trim().replace(/^["']|["']$/g, "")
      if (dateMatch) frontmatter.date = dateMatch[1].trim().replace(/^["']|["']$/g, "")
      
      if (tagsArrayMatch) {
        // Handle [item1, item2] format
        const tagsStr = tagsArrayMatch[1]
        frontmatter.tags = tagsStr
          .split(",")
          .map(t => t.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean)
      } else if (tagsListMatch) {
        // Handle - item1\n  - item2 format
        const tagsList = tagsListMatch[1]
        frontmatter.tags = tagsList
          .split("\n")
          .map(line => line.replace(/^\s*-\s*/, "").trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean)
      } else {
        frontmatter.tags = []
      }
    }

    // Base project metadata
    const project: ProjectMetadata = {
      slug,
      title: frontmatter.title || matchingFile.replace(".md", ""),
      description: frontmatter.description || "",
      subtitle: frontmatter.subtitle || "",
      status: frontmatter.status || "active",
      tags: frontmatter.tags || [],
      github: frontmatter.github || null,
      demo: frontmatter.demo || null,
      icon: frontmatter.icon || "Code",
      featured_image: frontmatter.featured_image,
      date: frontmatter.date || new Date().toISOString(),
    }

    return project
  } catch (error) {
    console.error("Error loading project:", error)
    return null
  }
}

/**
 * Fetches a single project by slug from a content directory
 * Includes full markdown content for detail pages
 */
export async function getProject(
  options: GetProjectOptions
): Promise<ProjectMetadata | null> {
  const { contentDir, slug } = options

  try {
    const matchingFile = findFileBySlug(contentDir, slug)

    if (!matchingFile) {
      return null
    }

    const filePath = path.join(contentDir, matchingFile)
    const fileContent = fs.readFileSync(filePath, "utf8")
    
    // Dynamic import to avoid bundling at build time
    const matterModule = await import("gray-matter")
    const matter = matterModule.default || matterModule
    const { data: frontmatter, content } = matter(fileContent)
    
    // Use configured marked with syntax highlighting
    const { getConfiguredMarked } = await import("@/lib/markdown-config")
    const markedParse = await getConfiguredMarked()
    const htmlContent = markedParse(content)

    // Base project metadata
    const project: ProjectMetadata = {
      slug,
      title: frontmatter.title || matchingFile.replace(".md", ""),
      description: frontmatter.description || "",
      subtitle: frontmatter.subtitle || "",
      status: frontmatter.status || "active",
      tags: frontmatter.tags || [],
      github: frontmatter.github || null,
      demo: frontmatter.demo || null,
      icon: frontmatter.icon || "Code",
      featured_image: frontmatter.featured_image,
      date: frontmatter.date || new Date().toISOString(),
      content: htmlContent,
    }

    return project
  } catch (error) {
    console.error("Error loading project:", error)
    return null
  }
}

/**
 * Gets all projects from a content directory
 */
export async function getAllProjects(contentDir: string): Promise<ProjectMetadata[]> {
  if (!fs.existsSync(contentDir)) {
    return []
  }

  try {
    const files = fs.readdirSync(contentDir)
    const markdownFiles = files.filter((file) => file.endsWith(".md"))

    const projects = await Promise.all(
      markdownFiles.map(async (filename) => {
        const slug = generateSlug(filename)
        const project = await getProject({ contentDir, slug })
        return project
      })
    )

    // Filter out nulls and drafts, then sort by date (newest first)
    return projects
      .filter((p): p is ProjectMetadata => p !== null)
      .filter((p) => !(p as any).draft) // Filter out draft projects
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateB - dateA // Descending order (newest first)
      })
  } catch (error) {
    console.error("Error loading projects:", error)
    return []
  }
}
