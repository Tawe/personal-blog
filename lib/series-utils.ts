import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { getDateTimestamp } from "@/lib/date-utils"
import { generateSlug } from "@/lib/slug-utils"

type WritingSection = "leadership" | "technical"

interface SectionConfig {
  section: WritingSection
  contentDir: string
  basePath: string
}

const WRITING_SECTIONS: SectionConfig[] = [
  {
    section: "leadership",
    contentDir: path.join(process.cwd(), "content/leadership"),
    basePath: "/strategic-narratives/leadership-strategy",
  },
  {
    section: "technical",
    contentDir: path.join(process.cwd(), "content/technical-writings"),
    basePath: "/strategic-narratives/technical-architecture",
  },
]

export interface SeriesEntry {
  slug: string
  title: string
  date: string
  excerpt: string
  reading_time?: number
  series_order?: number
  section: WritingSection
  href: string
}

export interface Series {
  name: string
  slug: string
  description?: string
  entries: SeriesEntry[]
}

function parseSeriesOrder(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return undefined
}

function compareSeriesEntries(a: SeriesEntry, b: SeriesEntry): number {
  const aOrder = a.series_order
  const bOrder = b.series_order

  if (typeof aOrder === "number" && typeof bOrder === "number" && aOrder !== bOrder) {
    return aOrder - bOrder
  }
  if (typeof aOrder === "number" && typeof bOrder !== "number") {
    return -1
  }
  if (typeof aOrder !== "number" && typeof bOrder === "number") {
    return 1
  }

  const dateDiff = getDateTimestamp(a.date) - getDateTimestamp(b.date)
  if (dateDiff !== 0) {
    return dateDiff
  }

  return a.title.localeCompare(b.title)
}

export function getAllSeries(): Series[] {
  const grouped = new Map<string, Series>()

  for (const sectionConfig of WRITING_SECTIONS) {
    if (!fs.existsSync(sectionConfig.contentDir)) {
      continue
    }

    const files = fs.readdirSync(sectionConfig.contentDir).filter((file) => file.endsWith(".md"))
    for (const file of files) {
      const filePath = path.join(sectionConfig.contentDir, file)
      const fileContent = fs.readFileSync(filePath, "utf8")
      const { data, content } = matter(fileContent)

      if (data.draft === true || typeof data.series !== "string" || !data.series.trim()) {
        continue
      }

      const seriesName = data.series.trim()
      const seriesSlug = data.series_slug ? generateSlug(String(data.series_slug)) : generateSlug(seriesName)
      if (!seriesSlug) {
        continue
      }

      const entrySlug = generateSlug(file)
      const entry: SeriesEntry = {
        slug: entrySlug,
        title: typeof data.title === "string" && data.title.trim() ? data.title.trim() : file.replace(/\.md$/, ""),
        date: typeof data.date === "string" && data.date.trim() ? data.date.trim() : new Date().toISOString(),
        excerpt:
          typeof data.excerpt === "string" && data.excerpt.trim()
            ? data.excerpt.trim()
            : content.slice(0, 180).replace(/\s+/g, " ").trim() + "...",
        reading_time: typeof data.reading_time === "number" ? data.reading_time : undefined,
        series_order: parseSeriesOrder(data.series_order),
        section: sectionConfig.section,
        href: `${sectionConfig.basePath}/${entrySlug}`,
      }

      const existing = grouped.get(seriesSlug)
      if (!existing) {
        grouped.set(seriesSlug, {
          name: seriesName,
          slug: seriesSlug,
          description: typeof data.series_description === "string" ? data.series_description.trim() : undefined,
          entries: [entry],
        })
        continue
      }

      if (!existing.description && typeof data.series_description === "string" && data.series_description.trim()) {
        existing.description = data.series_description.trim()
      }
      existing.entries.push(entry)
    }
  }

  return Array.from(grouped.values())
    .map((series) => ({
      ...series,
      entries: [...series.entries].sort(compareSeriesEntries),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getSeriesBySlug(slug: string): Series | null {
  return getAllSeries().find((series) => series.slug === slug) ?? null
}
