import { SharedArticleTemplate } from "@/components/shared-article-template"
import type { Series } from "@/lib/series-utils"

interface ArticleClientPageProps {
  article: any
  seriesContext?: {
    series: Series
    currentIndex: number
  }
}

const config = {
  contentFolder: "technical-writings" as const,
  baseUrl: "/strategic-narratives/technical-architecture",
}

export function ArticleClientPage({ article, seriesContext }: ArticleClientPageProps) {
  return (
    <SharedArticleTemplate
      article={article}
      seriesContext={seriesContext}
      config={config}
      backUrl="/writing"
      backLabel="Back to Writing"
      breadcrumbLabel="Writing"
    />
  )
}
