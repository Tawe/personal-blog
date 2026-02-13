import { SharedArticleTemplate } from "@/components/shared-article-template"

interface ArticleClientPageProps {
  article: any
}

const config = {
  contentFolder: "artumin" as const,
  baseUrl: "/strategic-narratives/world-of-artumin",
}

export function ArticleClientPage({ article }: ArticleClientPageProps) {
  return (
    <SharedArticleTemplate
      article={article}
      config={config}
      backUrl="/strategic-narratives/world-of-artumin"
      backLabel="Back to World of Artumin"
      breadcrumbLabel="World of Artumin"
    />
  )
}
