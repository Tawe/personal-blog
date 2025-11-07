import fs from "fs"

/**
 * Generates a consistent slug from a filename or string
 * Used across the application for URL generation
 */
export function generateSlug(filename: string): string {
  return filename
    .replace(".md", "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
}

/**
 * Finds a markdown file that matches a given slug
 */
export function findFileBySlug(
  contentDir: string,
  slug: string
): string | null {
  if (!fs.existsSync(contentDir)) {
    return null
  }

  const files = fs.readdirSync(contentDir)
  const markdownFiles = files.filter((file: string) => file.endsWith(".md"))

  return (
    markdownFiles.find((filename: string) => {
      const fileSlug = generateSlug(filename)
      return fileSlug === slug
    }) || null
  )
}

