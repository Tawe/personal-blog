import { notFound } from "next/navigation"
import { getArticleBySlug, getAllArticles } from "@/lib/content"
import { ArticleClientPage } from "./ArticleClientPage"

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const article = getArticleBySlug(decodeURIComponent(params.slug))

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
  const article = getArticleBySlug(decodeURIComponent(params.slug))

  if (!article) {
    notFound()
  }

  return <ArticleClientPage article={article} />
}
