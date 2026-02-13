import { SharedArticleTemplate } from "@/components/shared-article-template"

interface ArticleClientPageProps {
  article: any
}

const config = {
  contentFolder: "leadership" as const,
  baseUrl: "/strategic-narratives/leadership-strategy",
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
