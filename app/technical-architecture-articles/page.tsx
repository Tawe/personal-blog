import type { Metadata } from "next"

import { ArticleHubPage } from "@/components/article-hub-page"
import { TECHNICAL_CONFIG } from "@/lib/content-configs"
import { processContentDirectory } from "@/lib/content-api"
import { getDateTimestamp } from "@/lib/date-utils"
import { buildMetadata } from "@/lib/seo-metadata"

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Technical Architecture Articles | John Munn",
    description:
      "Technical architecture articles on system design, event-driven systems, AI architecture, platform tradeoffs, and operational consequences.",
    path: "/technical-architecture-articles",
    keywords: [
      "technical architecture articles",
      "software architecture articles",
      "system design articles",
      "technical architecture",
    ],
  })
}

export default async function TechnicalArchitectureArticlesPage() {
  const articles = await processContentDirectory(TECHNICAL_CONFIG)
  const selectedArticles = [...articles]
    .sort((a, b) => getDateTimestamp(b.date) - getDateTimestamp(a.date))
    .slice(0, 12)
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      date: article.date,
      excerpt: article.excerpt,
      reading_time: article.reading_time,
      href: `/strategic-narratives/technical-architecture/${article.slug}`,
      theme: "Technical",
    }))

  return (
    <ArticleHubPage
      kicker="Architecture Guides"
      title="Technical Architecture Articles"
      lead="A practical set of technical architecture articles on system design, scaling, AI systems, and the tradeoffs that shape real engineering decisions."
      description="These pieces are written to help teams reason more clearly about boundaries, failure modes, architecture patterns, and the operational consequences of technical choices."
      schemaName="Technical Architecture Articles"
      schemaDescription="A curated collection of technical architecture articles by John Munn covering system design, software architecture, AI systems, and operations."
      schemaUrl="https://johnmunn.tech/technical-architecture-articles"
      schemaAbout={["Technical architecture", "System design", "Software architecture", "AI systems"]}
      backHref="/strategic-narratives/technical-architecture"
      backLabel="Back to Technical Collection"
      introTitle="What You’ll Find Here"
      introDescription="The emphasis is not technical performance for its own sake. It is architecture that helps teams move, recover, and scale without losing clarity."
      topics={[
        {
          title: "System Design",
          body: "Patterns, boundaries, and decisions that define how software behaves under growth and change.",
        },
        {
          title: "Operational Reality",
          body: "Why reliability, incidents, observability, and ownership matter as much as the design on paper.",
        },
        {
          title: "AI and Modern Platforms",
          body: "Architecture tradeoffs in AI systems, cloud platforms, retrieval, agents, and developer workflows.",
        },
      ]}
      articlesTitle="Featured Architecture Reading"
      articlesDescription="A focused starting point for readers specifically looking for technical architecture content."
      articles={selectedArticles}
    />
  )
}
