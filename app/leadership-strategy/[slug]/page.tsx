import { notFound } from "next/navigation"
import { getArticleBySlug, getAllArticles } from "@/lib/content-api"
import { LEADERSHIP_CONFIG } from "@/lib/content-configs"
import { SharedArticleTemplate } from "@/components/shared-article-template"
import type { HubConfig } from "@/lib/types"

const leadershipConfig: HubConfig = {
  title: "Leadership Strategy",
  description: "Insights on building teams, driving innovation, and leading through complexity",
  contentFolder: "leadership",
  baseUrl: "/leadership-strategy",
  breadcrumbPath: "Strategic Narratives > Leadership Strategy",
  theme: {
    primary: "green",
    secondary: "slate",
    accent: "emerald",
  },
}

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const articles = getAllArticles(LEADERSHIP_CONFIG)
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const decodedSlug = decodeURIComponent(params.slug)
  const article = getArticleBySlug(LEADERSHIP_CONFIG, decodedSlug)

  if (!article) {
    return {
      title: "Article Not Found",
    }
  }

  return {
    title: `${article.title} | John Munn`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.featured_image ? [article.featured_image] : [],
    },
  }
}

export default function LeadershipStrategyArticlePage({ params }: PageProps) {
  const decodedSlug = decodeURIComponent(params.slug)
  const article = getArticleBySlug(LEADERSHIP_CONFIG, decodedSlug)

  if (!article) {
    notFound()
  }

  return <SharedArticleTemplate article={article} config={leadershipConfig} />
}
