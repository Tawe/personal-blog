import { notFound } from "next/navigation"
import { ArticleClientPage } from "./ArticleClientPage"
import { ArticleStructuredData } from "@/components/article-structured-data"
import { FAQStructuredData } from "@/components/faq-structured-data"
import { BreadcrumbSchema } from "@/components/breadcrumb-schema"
import { getArticle } from "@/lib/article-utils"
import { generateArticleMetadata } from "@/lib/metadata-utils"
import { generateSlug } from "@/lib/slug-utils"
import { getSeriesBySlug, type Series } from "@/lib/series-utils"
import { getRelatedArticles } from "@/lib/related-content"
import { processContentDirectory } from "@/lib/content-api"
import fs from "fs"
import path from "path"

interface Article {
  slug: string
  title: string
  subtitle?: string
  date: string
  excerpt: string
  content: string
  tags: string[]
  featured_image?: string
  reading_time: number
  difficulty: string
  type: string
  code_languages?: string[]
  updated?: string
  medium_link?: string
  devto_link?: string
  substack_link?: string
  linkedin_link?: string
  featured?: boolean
  series?: string
  series_slug?: string
  series_order?: number
}

interface ArticleSeriesContext {
  series: Series
  currentIndex: number
}

const ARTICLE_FAQ_BY_SLUG: Record<string, Array<{ question: string; answer: string }>> = {
  "how-to-measure-ai-productivity-when-the-cost-moves-instead-of-disappearing": [
    {
      question: "How should engineering leaders measure AI productivity?",
      answer:
        "Measure how AI changes the whole delivery system, not just drafting speed. Track flow, quality, learning, codebase health, and economic cost per durable outcome so you can see where work accelerates and where cost shifts downstream.",
    },
    {
      question: "Why is throughput alone a bad metric for AI productivity?",
      answer:
        "Throughput can improve while review burden, defects, rework, or code entropy get worse. That means AI may be speeding up local output while reducing overall system health and making safe delivery harder.",
    },
    {
      question: "What metrics matter most after an AI rollout in engineering?",
      answer:
        "Useful signals include cycle time by workflow stage, PR revision rounds, escaped defects, rollback frequency, onboarding time, code duplication, architectural consistency, and total cost per validated useful change.",
    },
    {
      question: "How do you tell whether AI created leverage or just moved cost?",
      answer:
        "Compare the pre-AI baseline to post-AI performance by work type. If drafting gets faster but review queues, incidents, learning debt, or architecture drag rise, the system is not gaining leverage. It is relocating cost.",
    },
  ],
  "holding-engineering-teams-accountable-for-delivery": [
    {
      question: "How do you hold engineering teams accountable without micromanaging?",
      answer:
        "Set delivery expectations at the team level, make flow visible with cycle time, lead time, WIP, and deployment frequency, and reduce work size so the team can self-correct quickly without constant managerial oversight.",
    },
    {
      question: "Why are individual developer productivity metrics harmful?",
      answer:
        "Metrics like story points per developer, tickets closed, or lines of code are easy to game and often damage collaboration. They shift effort toward optimizing numbers instead of improving delivery outcomes.",
    },
    {
      question: "What metrics should engineering leaders track instead of velocity?",
      answer:
        "Track system-level flow metrics: cycle time, lead time, work in progress, and deployment frequency. These show whether work is moving reliably from idea to production and where the delivery system is slowing down.",
    },
    {
      question: "What role does engineering leadership play in accountability?",
      answer:
        "Leadership should design the conditions for delivery: clear priorities, limited parallel work, smaller deliverables, and visible flow. Accountability improves when the system supports success instead of fighting the team.",
    },
  ],
  "mental-models-a-senior-engineering-leader-uses-and-how-to-know-when-youre-using-the-wrong-one": [
    {
      question: "What is the central argument of this mental models article?",
      answer:
        "Senior leadership effectiveness comes less from collecting many frameworks and more from choosing the right model for the situation. Most failures come from applying a neat model to a messy reality.",
    },
    {
      question: "How should engineering leaders use mental models in practice?",
      answer:
        "Use models as situational lenses: sense-making for ambiguity, reversibility for compounding decisions, risk and signal for early warnings, and alignment models for scaling decision quality.",
    },
    {
      question: "What warning signs suggest the wrong leadership model is being used?",
      answer:
        "Common signals include analysis paralysis, permission-seeking behavior, green metrics with rising friction, and repeated claims that difficult decisions can always be fixed later.",
    },
    {
      question: "Who is this leadership article written for?",
      answer:
        "The piece targets senior engineering leaders, including managers, directors, and technical leaders working across organizational complexity, ownership boundaries, and high-stakes decisions.",
    },
  ],
  "ai-is-about-to-make-leadership-harder-unless-you-learn-to-tame-it": [
    {
      question: "Why does AI make leadership harder, not easier?",
      answer:
        "AI makes leadership harder because it improves the polish of work faster than it improves the underlying judgment behind it. Leaders now have to distinguish between fluent outputs, genuine capability, and AI-assisted performance.",
    },
    {
      question: "What should leaders evaluate in an AI-assisted workplace?",
      answer:
        "Leaders should evaluate judgment under assistance: whether someone can explain their reasoning, adapt when context changes, verify weak AI outputs, and retain ownership in high-consequence decisions.",
    },
    {
      question: "How can leaders use AI without weakening team development?",
      answer:
        "Use AI to accelerate execution and support thinking, but protect the work that still builds judgment: writing from scratch, reasoning through ambiguity, handling hard conversations, and making accountable decisions in real time.",
    },
  ],
}

// Generate static params for all articles
export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content/leadership")
  const files = fs.readdirSync(contentDir)
  const markdownFiles = files.filter((file) => file.endsWith(".md"))
  
  return markdownFiles.map((filename) => ({
    slug: generateSlug(filename)
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const contentDir = path.join(process.cwd(), "content/leadership")
  // Use lightweight version to avoid bundling gray-matter/marked at build time
  const { getArticleLightweight } = await import("@/lib/article-utils")
  const article = getArticleLightweight({
    contentDir,
    slug,
    defaultType: "leadership",
    customFields: {
      type: "leadership",
      difficulty: "intermediate",
    },
  })

  return generateArticleMetadata({
    article,
    slug,
    basePath: "/strategic-narratives/leadership-strategy",
    sectionName: "Leadership & Strategy",
    defaultDescription: "Leadership strategy article by John Munn",
  })
}

async function loadArticle(slug: string): Promise<Article | null> {
  const contentDir = path.join(process.cwd(), "content/leadership")
  const article = await getArticle({
    contentDir,
    slug,
    defaultType: "leadership",
    customFields: {
      type: "leadership",
      difficulty: "intermediate",
    },
  })

  if (!article) return null

  return {
    ...article,
    difficulty: article.difficulty || "intermediate",
    code_languages: article.code_languages || [],
  } as Article
}

export default async function LeadershipStrategyArticlePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const article = await loadArticle(slug)
  
  if (!article) {
    notFound()
  }

  const articleUrl = `https://johnmunn.tech/strategic-narratives/leadership-strategy/${slug}`
  const relatedArticles = getRelatedArticles(
    article,
    await processContentDirectory({
      contentDir: path.join(process.cwd(), "content/leadership"),
      defaultType: "leadership",
      customFields: {
        type: "leadership",
        difficulty: "intermediate",
      },
    })
  )
  const activeSeriesSlug = article.series_slug ? generateSlug(article.series_slug) : article.series ? generateSlug(article.series) : ""
  let seriesContext: ArticleSeriesContext | undefined
  if (activeSeriesSlug) {
    const series = getSeriesBySlug(activeSeriesSlug)
    if (series) {
      const currentIndex = series.entries.findIndex((entry) => entry.href === `/strategic-narratives/leadership-strategy/${slug}`)
      if (currentIndex >= 0) {
        seriesContext = { series, currentIndex }
      }
    }
  }

  return (
    <>
      <ArticleStructuredData 
        article={article} 
        articleUrl={articleUrl}
        articleSection="Leadership & Strategy"
        type="BlogPosting"
      />
      <FAQStructuredData items={ARTICLE_FAQ_BY_SLUG[slug] || []} />
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "/" },
          { name: "Writing", url: "/writing" },
          { name: article.title, url: `/strategic-narratives/leadership-strategy/${slug}` }
        ]}
      />
      <ArticleClientPage article={article} relatedArticles={relatedArticles} seriesContext={seriesContext} />
    </>
  )
}
