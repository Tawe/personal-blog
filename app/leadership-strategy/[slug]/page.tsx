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
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const articles = getAllArticles(LEADERSHIP_CONFIG)
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const article = getArticleBySlug(LEADERSHIP_CONFIG, decodedSlug)

  if (!article) {
    return {
      title: "Article Not Found",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const url = `https://johnmunn.tech${leadershipConfig.baseUrl}/${slug}`

  return {
    title: `${article.title} | John Munn`,
    description: article.excerpt || article.subtitle || leadershipConfig.description,
    keywords: article.tags || [],
    authors: [{ name: "John Munn" }],
    openGraph: {
      title: article.title,
      description: article.excerpt || article.subtitle || leadershipConfig.description,
      url,
      siteName: "John Munn - Technical Leader",
      type: "article",
      publishedTime: article.date,
      authors: ["John Munn"],
      tags: article.tags || [],
      images: article.featured_image
        ? [
            {
              url: article.featured_image,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : [
            {
              url: "/me.jpeg",
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || article.subtitle || leadershipConfig.description,
      images: article.featured_image ? [article.featured_image] : ["/me.jpeg"],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default async function LeadershipStrategyArticlePage({ params }: PageProps) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const article = getArticleBySlug(LEADERSHIP_CONFIG, decodedSlug)

  if (!article) {
    notFound()
  }

  return <SharedArticleTemplate article={article} config={leadershipConfig} />
}
