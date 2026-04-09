import type { Metadata } from "next"

import { ArticleHubPage } from "@/components/article-hub-page"
import { LEADERSHIP_CONFIG, TECHNICAL_CONFIG } from "@/lib/content-configs"
import { processContentDirectory } from "@/lib/content-api"
import { getDateTimestamp } from "@/lib/date-utils"
import { buildMetadata } from "@/lib/seo-metadata"

function isAiSystemsArticle(article: { title: string; excerpt: string; tags?: string[] }) {
  const haystack = `${article.title} ${article.excerpt} ${(article.tags || []).join(" ")}`.toLowerCase()
  return [" ai", "agent", "agents", "rag", "retrieval", "eval", "evaluation", "llm", "model", "prompt", "governance"].some((term) =>
    haystack.includes(term.trim())
  )
}

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "AI Systems Strategy | John Munn",
    description:
      "AI systems strategy articles on architecture, governance, evaluation, delivery tradeoffs, and how organizations actually adopt AI responsibly.",
    path: "/ai-systems-strategy",
    keywords: [
      "AI systems strategy",
      "AI architecture strategy",
      "AI governance articles",
      "AI evaluation strategy",
    ],
  })
}

export default async function AiSystemsStrategyPage() {
  const [leadership, technical] = await Promise.all([
    processContentDirectory(LEADERSHIP_CONFIG),
    processContentDirectory(TECHNICAL_CONFIG),
  ])

  const selectedArticles = [...leadership, ...technical]
    .filter(isAiSystemsArticle)
    .sort((a, b) => getDateTimestamp(b.date) - getDateTimestamp(a.date))
    .slice(0, 12)
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      date: article.date,
      excerpt: article.excerpt,
      reading_time: article.reading_time,
      href:
        leadership.some((leadershipArticle) => leadershipArticle.slug === article.slug)
          ? `/strategic-narratives/leadership-strategy/${article.slug}`
          : `/strategic-narratives/technical-architecture/${article.slug}`,
      theme:
        leadership.some((leadershipArticle) => leadershipArticle.slug === article.slug)
          ? "Leadership"
          : "Technical",
    }))

  return (
    <ArticleHubPage
      kicker="AI Strategy Guides"
      title="AI Systems Strategy"
      lead="Writing on AI systems strategy, evaluation, governance, architecture, and the organizational tradeoffs that determine whether AI work creates leverage or just new failure modes."
      description="This page brings together the technical and leadership sides of AI systems work: what to build, how to evaluate it, where the risk lives, and how teams should reason about adoption under real business pressure."
      schemaName="AI Systems Strategy"
      schemaDescription="A curated collection of AI systems strategy articles by John Munn across AI architecture, evaluation, governance, and organizational adoption."
      schemaUrl="https://johnmunn.tech/ai-systems-strategy"
      schemaAbout={["AI systems", "AI strategy", "AI governance", "AI evaluation", "Technical architecture"]}
      backHref="/writing"
      backLabel="Back to Writing"
      introTitle="What You’ll Find Here"
      introDescription="The useful AI conversation is rarely just about models. It is about system design, evaluation, risk, organizational behavior, and the economics of adopting these tools responsibly."
      topics={[
        {
          title: "Architecture",
          body: "How retrieval, agents, context, prompts, and infrastructure choices shape AI system behavior.",
        },
        {
          title: "Evaluation and Control",
          body: "How to measure whether an AI system is helping, drifting, leaking risk, or simply moving cost elsewhere.",
        },
        {
          title: "Adoption Strategy",
          body: "How teams, leaders, and organizations make better choices about where AI fits and where it does not.",
        },
      ]}
      articlesTitle="Featured AI Systems Reading"
      articlesDescription="A curated path through the parts of your writing most relevant to AI systems strategy and AI architecture decision-making."
      articles={selectedArticles}
    />
  )
}
