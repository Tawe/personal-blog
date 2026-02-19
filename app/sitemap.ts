import { MetadataRoute } from "next"
import fs from "fs"
import path from "path"
import { generateSlug } from "@/lib/slug-utils"

const BASE_URL = "https://johnmunn.tech"

interface ContentFile {
  slug: string
  lastModified: Date
}

function getContentFiles(dir: string): ContentFile[] {
  const contentDir = path.join(process.cwd(), dir)
  if (!fs.existsSync(contentDir)) return []

  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".md"))
    .filter((f) => {
      const content = fs.readFileSync(path.join(contentDir, f), "utf-8")
      return !content.match(/^draft:\s*true/m)
    })
    .map((f) => {
      const filePath = path.join(contentDir, f)
      const content = fs.readFileSync(filePath, "utf-8")
      const dateMatch = content.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m)
      const lastModified = dateMatch
        ? new Date(dateMatch[1])
        : fs.statSync(filePath).mtime
      return { slug: generateSlug(f), lastModified }
    })
}

function articlePages(
  files: ContentFile[],
  basePath: string
): MetadataRoute.Sitemap {
  return files.map(({ slug, lastModified }) => ({
    url: `${BASE_URL}/${basePath}/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/strategic-narratives`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/strategic-narratives/leadership-strategy`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/strategic-narratives/technical-architecture`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/strategic-narratives/world-of-artumin`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/strategic-narratives/dnd-ttrpgs`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/services/mentoring`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/services/team-building`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/vision`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ]

  return [
    ...staticPages,
    ...articlePages(getContentFiles("content/leadership"), "strategic-narratives/leadership-strategy"),
    ...articlePages(getContentFiles("content/technical-writings"), "strategic-narratives/technical-architecture"),
    ...articlePages(getContentFiles("content/artumin"), "strategic-narratives/world-of-artumin"),
    ...articlePages(getContentFiles("content/dnd-musings"), "strategic-narratives/dnd-ttrpgs"),
    ...articlePages(getContentFiles("content/projects"), "workbench"),
  ]
}
