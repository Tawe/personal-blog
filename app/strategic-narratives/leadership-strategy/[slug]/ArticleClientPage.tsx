import { SharedArticleTemplate } from "@/components/shared-article-template"
import type { Series } from "@/lib/series-utils"

interface ArticleClientPageProps {
  article: any
  relatedArticles?: any[]
  seriesContext?: {
    series: Series
    currentIndex: number
  }
}

const config = {
  contentFolder: "leadership" as const,
  baseUrl: "/strategic-narratives/leadership-strategy",
}

export function ArticleClientPage({ article, relatedArticles, seriesContext }: ArticleClientPageProps) {
  return (
    <SharedArticleTemplate
      article={article}
      relatedArticles={relatedArticles}
      seriesContext={seriesContext}
      config={config}
      backUrl="/writing"
      backLabel="Back to Writing"
      breadcrumbLabel="Writing"
    />
  )
}
