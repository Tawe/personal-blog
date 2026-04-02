import { SharedArticleTemplate } from "@/components/shared-article-template"

interface ArticleClientPageProps {
  article: any
}

const config = {
  contentFolder: "dnd-musings" as const,
  baseUrl: "/strategic-narratives/dnd-ttrpgs",
}

export function ArticleClientPage({ article }: ArticleClientPageProps) {
  return (
    <SharedArticleTemplate
      article={article}
      config={config}
      backUrl="/writing"
      backLabel="Back to Writing"
      breadcrumbLabel="Writing"
    />
  )
}
