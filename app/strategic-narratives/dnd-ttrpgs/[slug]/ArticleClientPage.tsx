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
      backUrl="/strategic-narratives/dnd-ttrpgs"
      backLabel="Back to D&D and TTRPGs"
      breadcrumbLabel="D&D and TTRPGs"
    />
  )
}
