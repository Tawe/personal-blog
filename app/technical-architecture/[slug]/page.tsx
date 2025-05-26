import { notFound } from "next/navigation"
import { getArticleBySlug, getAllArticles } from "@/lib/content-unified"
import { SharedArticleTemplate } from "@/components/shared-article-template"
import type { HubConfig } from "@/lib/types"

const technicalConfig: HubConfig = {
  title: "Technical Architecture",
  description: "Deep dives into system design, scalability, and technology decisions",
  contentFolder: "technical-writings",
  baseUrl: "/technical-architecture",
  breadcrumbPath: "Strategic Narratives > Technical Architecture",
  theme: {
    primary: "blue",
    secondary: "slate",
    accent: "cyan",
  },
}

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const articles = getAllArticles("technical-writings")
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const decodedSlug = decodeURIComponent(params.slug)
  const article = getArticleBySlug("technical-writings", decodedSlug)

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

export default function TechnicalArchitectureArticlePage({ params }: PageProps) {
  const decodedSlug = decodeURIComponent(params.slug)
  const article = getArticleBySlug("technical-writings", decodedSlug)

  if (!article) {
    notFound()
  }

  return <SharedArticleTemplate article={article} config={technicalConfig} />
}
