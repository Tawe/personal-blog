import { notFound } from "next/navigation"
import { getTechnicalArticleBySlug, getAllTechnicalArticles } from "@/lib/content"
import { ArticleClientPage } from "./ArticleClientPage"

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const articles = await getAllTechnicalArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const decodedSlug = decodeURIComponent(params.slug)
  const article = await getTechnicalArticleBySlug(decodedSlug)

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

export default async function TechnicalArchitectureArticlePage({ params }: PageProps) {
  const decodedSlug = decodeURIComponent(params.slug)
  const article = await getTechnicalArticleBySlug(decodedSlug)

  if (!article) {
    notFound()
  }

  return <ArticleClientPage article={article} />
}
