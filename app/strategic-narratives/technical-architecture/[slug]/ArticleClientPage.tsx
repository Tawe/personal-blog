import { SharedArticleTemplate } from "@/components/shared-article-template"

interface ArticleClientPageProps {
  article: any
}

const config = {
  contentFolder: "technical-writings" as const,
  baseUrl: "/strategic-narratives/technical-architecture",
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
