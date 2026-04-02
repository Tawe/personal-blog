import { SharedArticleTemplate } from "@/components/shared-article-template"

interface ArticleClientPageProps {
  article: any
  relatedArticles?: any[]
}

const config = {
  contentFolder: "dnd-musings" as const,
  baseUrl: "/strategic-narratives/dnd-ttrpgs",
}

export function ArticleClientPage({ article, relatedArticles }: ArticleClientPageProps) {
  return (
    <SharedArticleTemplate
      article={article}
      relatedArticles={relatedArticles}
      config={config}
      backUrl="/writing"
      backLabel="Back to Writing"
      breadcrumbLabel="Writing"
    />
  )
}
