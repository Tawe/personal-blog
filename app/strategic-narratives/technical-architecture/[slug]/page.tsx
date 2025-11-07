import { notFound } from "next/navigation"
import { ArticleClientPage } from "./ArticleClientPage"
import { ArticleStructuredData } from "@/components/article-structured-data"
import { BreadcrumbSchema } from "@/components/breadcrumb-schema"
import { getArticle } from "@/lib/article-utils"
import { generateArticleMetadata } from "@/lib/metadata-utils"
import { generateSlug } from "@/lib/slug-utils"
import fs from "fs"
import path from "path"

interface Article {
  slug: string
  title: string
  subtitle?: string
  date: string
  excerpt: string
  content: string
  tags: string[]
  featured_image?: string
  reading_time: number
  difficulty: string
  type: string
  code_languages?: string[]
  updated?: string
  medium_link?: string
  devto_link?: string
  substack_link?: string
  featured?: boolean
}

// Generate static params for all articles
export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content/technical-writings")
  const files = fs.readdirSync(contentDir)
  const markdownFiles = files.filter((file) => file.endsWith(".md"))
  
  return markdownFiles.map((filename) => ({
    slug: generateSlug(filename)
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const contentDir = path.join(process.cwd(), "content/technical-writings")
  const article = await getArticle({
    contentDir,
    slug,
    defaultType: "technical",
    customFields: {
      type: "technical",
      difficulty: "intermediate",
    },
  })

  return generateArticleMetadata({
    article,
    slug,
    basePath: "/strategic-narratives/technical-architecture",
    sectionName: "Technical Architecture",
    defaultDescription: "Technical architecture article by John Munn",
  })
}

async function loadArticle(slug: string): Promise<Article | null> {
  const contentDir = path.join(process.cwd(), "content/technical-writings")
  const article = await getArticle({
    contentDir,
    slug,
    defaultType: "technical",
    customFields: {
      type: "technical",
      difficulty: "intermediate",
    },
  })

  if (!article) return null

  return {
    ...article,
    difficulty: article.difficulty || "intermediate",
    code_languages: article.code_languages || [],
  } as Article
}

export default async function TechnicalArchitectureArticlePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const article = await loadArticle(slug)
  
  if (!article) {
    notFound()
  }

  const articleUrl = `https://johnmunn.tech/strategic-narratives/technical-architecture/${slug}`

  return (
    <>
      <ArticleStructuredData 
        article={article} 
        articleUrl={articleUrl}
        articleSection="Technical Architecture"
        type="BlogPosting"
      />
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "/" },
          { name: "Strategic Narratives", url: "/strategic-narratives" },
          { name: "Technical Architecture", url: "/strategic-narratives/technical-architecture" },
          { name: article.title, url: `/strategic-narratives/technical-architecture/${slug}` }
        ]}
      />
      <ArticleClientPage article={article} />
    </>
  )
}
