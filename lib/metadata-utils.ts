import { Metadata } from "next"
import { ArticleMetadata } from "./article-utils"

export interface GenerateArticleMetadataOptions {
  article: ArticleMetadata | null
  slug: string
  basePath: string
  sectionName: string
  defaultTitle?: string
  defaultDescription?: string
}

/**
 * Generates Next.js metadata for article pages
 * Provides consistent SEO metadata across all article types
 */
export function generateArticleMetadata(
  options: GenerateArticleMetadataOptions
): Metadata {
  const {
    article,
    slug,
    basePath,
    sectionName,
    defaultTitle = "Article",
    defaultDescription = `${sectionName} article by John Munn`,
  } = options

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    }
  }

  const title = article.title || defaultTitle
  const description = article.excerpt || article.subtitle || defaultDescription
  const url = `https://johnmunn.tech${basePath}/${slug}`

  return {
    title,
    description,
    keywords: article.tags || [],
    authors: [{ name: "John Munn" }],
    openGraph: {
      title,
      description,
      url,
      siteName: "John Munn - Technical Leader",
      images: article.featured_image
        ? [
            {
              url: article.featured_image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [
            {
              url: "/me.jpeg",
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
      locale: "en_US",
      type: "article",
      publishedTime: article.date instanceof Date
        ? article.date.toISOString()
        : article.date?.includes('T') ? article.date : `${article.date}T00:00:00Z`,
      authors: ["John Munn"],
      tags: article.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.featured_image
        ? [article.featured_image]
        : ["/me.jpeg"],
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
  } as Metadata
}

