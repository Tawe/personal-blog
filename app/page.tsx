import { Metadata } from "next"
import HomePageClient from "./home-client"
import { processContentDirectory } from "@/lib/content-api"
import { LEADERSHIP_CONFIG, TECHNICAL_CONFIG } from "@/lib/content-configs"
import { getDateTimestamp } from "@/lib/date-utils"
import { buildMetadata } from "@/lib/seo-metadata"
import { getAllProjectsLightweight } from "@/lib/project-utils"
import path from "path"

export const metadata: Metadata = buildMetadata({
  title: "John Munn - Technical Leader & Engineering Strategist",
  description:
    "Technical leader, engineering strategist, and team builder. Writing on leadership, technical architecture, and AI system tradeoffs.",
  path: "/",
  keywords: [
    "engineering leadership",
    "technical leader",
    "technical architecture",
    "AI strategy",
    "software engineering management",
  ],
  image: "/me.jpeg",
  imageAlt: "John Munn - Technical Leader & Engineering Strategist",
})

export default async function HomePage() {
  const [leadership, technical] = await Promise.all([
    processContentDirectory(LEADERSHIP_CONFIG),
    processContentDirectory(TECHNICAL_CONFIG),
  ])
  const projects = getAllProjectsLightweight(path.join(process.cwd(), "content/projects"))

  const articles = [
    ...leadership.map((article) => ({
      slug: article.slug,
      title: article.title,
      date: article.date,
      excerpt: article.excerpt,
      readingTime: article.reading_time,
      category: "Leadership",
      href: `/strategic-narratives/leadership-strategy/${article.slug}`,
    })),
    ...technical.map((article) => ({
      slug: article.slug,
      title: article.title,
      date: article.date,
      excerpt: article.excerpt,
      readingTime: article.reading_time,
      category: "Technical",
      href: `/strategic-narratives/technical-architecture/${article.slug}`,
    })),
  ]
    .sort((a, b) => getDateTimestamp(b.date) - getDateTimestamp(a.date))
    .slice(0, 3)

  const featuredProject = projects[0]
    ? {
        slug: projects[0].slug,
        title: projects[0].title,
        description: projects[0].description,
        status: projects[0].status,
        tags: projects[0].tags,
        href: `/projects/${projects[0].slug}`,
        github: projects[0].github || undefined,
        demo: projects[0].demo || undefined,
        featuredImage: projects[0].featured_image,
      }
    : null

  return <HomePageClient articles={articles} featuredProject={featuredProject} />
}
