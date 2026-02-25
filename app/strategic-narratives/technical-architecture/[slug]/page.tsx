import { notFound } from "next/navigation"
import { ArticleClientPage } from "./ArticleClientPage"
import { ArticleStructuredData } from "@/components/article-structured-data"
import { FAQStructuredData } from "@/components/faq-structured-data"
import { BreadcrumbSchema } from "@/components/breadcrumb-schema"
import { getArticle } from "@/lib/article-utils"
import { generateArticleMetadata } from "@/lib/metadata-utils"
import { generateSlug } from "@/lib/slug-utils"
import { getSeriesBySlug, type Series } from "@/lib/series-utils"
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
  "how-to-architect-secure-ai-agents-before-they-architect-your-incident": [
    {
      question: "Why are AI agents riskier than chatbots?",
      answer:
        "Chatbots typically return text and stop, while agents can plan, call tools, and change systems. That additional autonomy introduces security risk if permissions and controls are not tightly governed.",
    },
    {
      question: "What is the first security control to implement for an AI agent?",
      answer:
        "Start with least-privilege access and a dedicated non-human identity. Scope tools and permissions so the agent can only perform approved actions in approved environments.",
    },
    {
      question: "How should high-risk agent actions be handled?",
      answer:
        "High-risk actions such as data deletion or production-impacting changes should require explicit human approval, with full logging of who approved, what changed, and why.",
    },
    {
      question: "How do teams reduce prompt-injection risk in agent systems?",
      answer:
        "Treat external or retrieved content as untrusted input, and place policy enforcement between model output and tool execution so instructions from untrusted text cannot directly trigger privileged actions.",
    },
    {
      question: "What should be monitored after deployment?",
      answer:
        "Monitor tool-call patterns, parameters, and outcomes. Alert on behavioral drift, especially when an agent starts invoking tools or capabilities it rarely or never used before.",
    },
  ],
}

// Generate static params for all articles
export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content/technical-writings")
  const files = fs.readdirSync(contentDir)
  const markdownFiles = files.filter((file) => file.endsWith(".md"))
  
  return markdownFiles.map((filename) => ({
    slug: generateSlug(filename)
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const contentDir = path.join(process.cwd(), "content/technical-writings")
  // Use lightweight version to avoid bundling gray-matter/marked at build time
  const { getArticleLightweight } = await import("@/lib/article-utils")
  const article = getArticleLightweight({
    contentDir,
    slug,
    defaultType: "technical",
    customFields: {
      type: "technical",
      difficulty: "intermediate",
    },
  })

  return generateArticleMetadata({
    article,
    slug,
    basePath: "/strategic-narratives/technical-architecture",
    sectionName: "Technical Architecture",
    defaultDescription: "Technical architecture article by John Munn",
  })
}

async function loadArticle(slug: string): Promise<Article | null> {
  const contentDir = path.join(process.cwd(), "content/technical-writings")
  const article = await getArticle({
    contentDir,
    slug,
    defaultType: "technical",
    customFields: {
      type: "technical",
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

export default async function TechnicalArchitectureArticlePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const article = await loadArticle(slug)
  
  if (!article) {
    notFound()
  }

  const articleUrl = `https://johnmunn.tech/strategic-narratives/technical-architecture/${slug}`
  const activeSeriesSlug = article.series_slug ? generateSlug(article.series_slug) : article.series ? generateSlug(article.series) : ""
  let seriesContext: ArticleSeriesContext | undefined
  if (activeSeriesSlug) {
    const series = getSeriesBySlug(activeSeriesSlug)
    if (series) {
      const currentIndex = series.entries.findIndex((entry) => entry.href === `/strategic-narratives/technical-architecture/${slug}`)
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
        articleSection="Technical Architecture"
        type="BlogPosting"
      />
      <FAQStructuredData items={ARTICLE_FAQ_BY_SLUG[slug] || []} />
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "/" },
          { name: "Writing", url: "/writing" },
          { name: article.title, url: `/strategic-narratives/technical-architecture/${slug}` }
        ]}
      />
      <ArticleClientPage article={article} seriesContext={seriesContext} />
    </>
  )
}
