import { Metadata } from "next"
import { ArticleMetadata } from "./article-utils"
import { buildMetadata } from "./seo-metadata"

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
    return buildMetadata({
      title: "Article Not Found",
      description: "The requested article could not be found.",
      path: `${basePath}/${slug}`,
      noindex: true,
    })
  }

  const title = article.title || defaultTitle
  const description = article.excerpt || article.subtitle || defaultDescription
  const url = `https://johnmunn.tech${basePath}/${slug}`
  const titleKeyword = title.trim()
  const subtitleKeyword = article.subtitle?.trim()

  const metadata = buildMetadata({
    title,
    description,
    path: `${basePath}/${slug}`,
    keywords: [
      ...(article.tags || []),
      titleKeyword,
      `${titleKeyword} article`,
      ...(subtitleKeyword ? [subtitleKeyword] : []),
      `${sectionName.toLowerCase()} article`,
      "engineering insights",
      "John Munn",
    ],
    image: article.featured_image || "/me.jpeg",
    imageAlt: title,
    openGraphType: "article",
  })

  const openGraph = metadata.openGraph as Record<string, unknown> | undefined
  if (openGraph && openGraph.type === "article") {
    const publishedDate =
      typeof article.date === "string"
        ? (article.date.includes("T") ? article.date : `${article.date}T00:00:00Z`)
        : ""
    const modifiedDate =
      typeof article.updated === "string"
        ? (article.updated.includes("T") ? article.updated : `${article.updated}T00:00:00Z`)
        : publishedDate

    openGraph.publishedTime = publishedDate
    openGraph.modifiedTime = modifiedDate
    openGraph.authors = ["John Munn"]
    openGraph.tags = article.tags || []
  }

  return metadata
}
