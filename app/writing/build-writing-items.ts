import type { ProcessedArticle } from "@/lib/content-api"

import type { WritingItem } from "./WritingIndexClient"

export function buildWritingItems(leadership: ProcessedArticle[], technical: ProcessedArticle[]): WritingItem[] {
  return [
    ...leadership.map((article) => ({
      slug: article.slug,
      title: article.title,
      date: article.date,
      excerpt: article.excerpt,
      reading_time: article.reading_time,
      series: typeof article.series === "string" ? article.series : undefined,
      theme: "Leadership" as const,
      href: `/strategic-narratives/leadership-strategy/${article.slug}`,
    })),
    ...technical.map((article) => ({
      slug: article.slug,
      title: article.title,
      date: article.date,
      excerpt: article.excerpt,
      reading_time: article.reading_time,
      series: typeof article.series === "string" ? article.series : undefined,
      theme: "Technical" as const,
      href: `/strategic-narratives/technical-architecture/${article.slug}`,
    })),
  ]
}
