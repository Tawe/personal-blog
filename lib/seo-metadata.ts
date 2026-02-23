import type { Metadata } from "next"

const BASE_URL = "https://johnmunn.tech"
const DEFAULT_IMAGE = "/me.jpeg"

const BASE_KEYWORDS = [
  "engineering leadership",
  "technical strategy",
  "software architecture",
  "AI systems",
  "technical writing",
]

type OpenGraphType = "website" | "article"

export interface BuildMetadataOptions {
  title: string
  description: string
  path: string
  keywords?: string[]
  image?: string
  imageAlt?: string
  openGraphType?: OpenGraphType
  noindex?: boolean
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  if (path === "/") return BASE_URL
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  image = DEFAULT_IMAGE,
  imageAlt = title,
  openGraphType = "website",
  noindex = false,
}: BuildMetadataOptions): Metadata {
  const canonical = absoluteUrl(path)
  const dedupedKeywords = Array.from(new Set([...keywords, ...BASE_KEYWORDS]))

  return {
    title,
    description,
    keywords: dedupedKeywords,
    authors: [{ name: "John Munn" }],
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "John Munn",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      locale: "en_US",
      type: openGraphType,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical,
    },
    robots: {
      index: !noindex,
      follow: true,
      googleBot: {
        index: !noindex,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}
