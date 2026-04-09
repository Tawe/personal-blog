import type { Metadata } from "next"

import { ArticleHubPage } from "@/components/article-hub-page"
import { LEADERSHIP_CONFIG } from "@/lib/content-configs"
import { processContentDirectory } from "@/lib/content-api"
import { getDateTimestamp } from "@/lib/date-utils"
import { buildMetadata } from "@/lib/seo-metadata"

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Engineering Leadership Articles | John Munn",
    description:
      "Engineering leadership articles on team design, organizational judgment, accountability, communication, and leadership under pressure.",
    path: "/engineering-leadership-articles",
    keywords: [
      "engineering leadership articles",
      "engineering management articles",
      "technical leadership articles",
      "leadership strategy",
    ],
  })
}

export default async function EngineeringLeadershipArticlesPage() {
  const articles = await processContentDirectory(LEADERSHIP_CONFIG)
  const selectedArticles = [...articles]
    .sort((a, b) => getDateTimestamp(b.date) - getDateTimestamp(a.date))
    .slice(0, 12)
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      date: article.date,
      excerpt: article.excerpt,
      reading_time: article.reading_time,
      href: `/strategic-narratives/leadership-strategy/${article.slug}`,
      theme: "Leadership",
    }))

  return (
    <ArticleHubPage
      kicker="Leadership Guides"
      title="Engineering Leadership Articles"
      lead="A practical library of engineering leadership writing on team health, accountability, strategy, communication, and the organizational realities around software delivery."
      description="These essays focus on the work around the work: leading people, shaping systems, navigating ambiguity, and helping organizations make better decisions under pressure."
      schemaName="Engineering Leadership Articles"
      schemaDescription="A curated collection of engineering leadership articles by John Munn on management, organizational design, accountability, and strategy."
      schemaUrl="https://johnmunn.tech/engineering-leadership-articles"
      schemaAbout={["Engineering leadership", "Technical leadership", "Organizational design", "Engineering management"]}
      backHref="/strategic-narratives/leadership-strategy"
      backLabel="Back to Leadership Collection"
      introTitle="What You’ll Find Here"
      introDescription="The goal is not leadership theater. It is clearer thinking about how teams operate, where decisions degrade, and what strong leadership looks like in real systems."
      topics={[
        {
          title: "Team Design",
          body: "How structure, ownership, and communication shape the quality and speed of engineering work.",
        },
        {
          title: "Leadership Judgment",
          body: "How to make better calls under ambiguity, pressure, and competing incentives.",
        },
        {
          title: "Organizational Reality",
          body: "Why systems, incentives, politics, and culture matter as much as good intentions.",
        },
      ]}
      articlesTitle="Featured Leadership Reading"
      articlesDescription="A focused starting point if you’re looking for engineering leadership articles rather than the broader writing index."
      articles={selectedArticles}
    />
  )
}
