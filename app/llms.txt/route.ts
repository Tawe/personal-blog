import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { generateSlug } from "@/lib/slug-utils"

export const runtime = "nodejs"
export const revalidate = 3600

const BASE_URL = "https://johnmunn.tech"

interface LlmContentItem {
  title: string
  description: string
  url: string
  date: string
  tags: string[]
}

const CONTENT_SECTIONS = [
  {
    label: "Technical Architecture",
    dir: "content/technical-writings",
    route: "/strategic-narratives/technical-architecture",
  },
  {
    label: "Leadership Strategy",
    dir: "content/leadership",
    route: "/strategic-narratives/leadership-strategy",
  },
  {
    label: "World of Artumin",
    dir: "content/artumin",
    route: "/strategic-narratives/world-of-artumin",
  },
  {
    label: "D&D and TTRPGs",
    dir: "content/dnd-musings",
    route: "/strategic-narratives/dnd-ttrpgs",
  },
  {
    label: "Projects",
    dir: "content/projects",
    route: "/projects",
  },
]

function stripQuotes(value: string): string {
  return value.trim().replace(/^["']|["']$/g, "")
}

function parseFrontmatter(content: string) {
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/)
  const text = frontmatterMatch?.[1] || ""
  const titleMatch = text.match(/^title:\s*(.+)$/m)
  const dateMatch = text.match(/^date:\s*(.+)$/m)
  const excerptMatch = text.match(/^excerpt:\s*(.+)$/m)
  const descriptionMatch = text.match(/^description:\s*(.+)$/m)
  const draftMatch = text.match(/^draft:\s*(true|false)\s*$/m)
  const inlineTagsMatch = text.match(/^tags:\s*\[(.*?)\]\s*$/ms)
  const blockTagsMatch = text.match(/^tags:\s*\n((?:\s*-\s*.+\n?)*)/m)

  const tags = inlineTagsMatch
    ? inlineTagsMatch[1]
        .split(",")
        .map(stripQuotes)
        .filter(Boolean)
    : blockTagsMatch
      ? blockTagsMatch[1]
          .split("\n")
          .map((line) => line.match(/^\s*-\s*(.+)\s*$/)?.[1] || "")
          .map(stripQuotes)
          .filter(Boolean)
      : []

  return {
    title: titleMatch ? stripQuotes(titleMatch[1]) : "",
    date: dateMatch ? stripQuotes(dateMatch[1]) : "",
    description: excerptMatch
      ? stripQuotes(excerptMatch[1])
      : descriptionMatch
        ? stripQuotes(descriptionMatch[1])
        : "",
    draft: draftMatch?.[1] === "true",
    tags,
  }
}

function getPublishedItems(section: (typeof CONTENT_SECTIONS)[number]): LlmContentItem[] {
  const contentDir = path.join(process.cwd(), section.dir)
  if (!fs.existsSync(contentDir)) return []

  return fs
    .readdirSync(contentDir)
    .filter((filename) => filename.endsWith(".md"))
    .flatMap((filename) => {
      const filePath = path.join(contentDir, filename)
      const fileContent = fs.readFileSync(filePath, "utf8")
      const frontmatter = parseFrontmatter(fileContent)

      if (frontmatter.draft) return []

      const slug = generateSlug(filename)
      return [
        {
          title: frontmatter.title || filename.replace(/\.md$/, ""),
          description: frontmatter.description,
          url: `${BASE_URL}${section.route}/${slug}`,
          date: frontmatter.date,
          tags: frontmatter.tags,
        },
      ]
    })
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
}

function formatItem(item: LlmContentItem): string {
  const metadata = [
    item.date ? `published ${item.date}` : "",
    item.tags.length ? `topics: ${item.tags.join(", ")}` : "",
  ].filter(Boolean)
  const metadataText = metadata.length ? ` (${metadata.join("; ")})` : ""
  const descriptionText = item.description ? ` - ${item.description}` : ""

  return `- [${item.title}](${item.url})${metadataText}${descriptionText}`
}

export async function GET() {
  const sections = CONTENT_SECTIONS.map((section) => {
    const items = getPublishedItems(section)
    if (!items.length) return ""

    return `## ${section.label}\n\n${items.map(formatItem).join("\n")}`
  }).filter(Boolean)

  const body = `# John Munn

> Engineering leadership, technical architecture, AI systems strategy, and product-minded software writing by John Munn.

Primary site: ${BASE_URL}
RSS feed: ${BASE_URL}/feed.xml
Sitemap: ${BASE_URL}/sitemap.xml

## Use This Content For

- Understanding John Munn's published writing, projects, and technical perspective.
- Citing canonical article URLs from johnmunn.tech.
- Discovering AI systems, software architecture, engineering leadership, and product strategy articles.

${sections.join("\n\n")}
`

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
