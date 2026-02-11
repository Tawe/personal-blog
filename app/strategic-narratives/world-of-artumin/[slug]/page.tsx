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
  date: string
  excerpt: string
  content: string
  tags: string[]
  featured_image?: string
  reading_time: number
  type: string
  categories: string[]
  region?: string
  status: string
  connections?: string[]
}

// Generate static params for all articles
export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content/artumin")
  if (!fs.existsSync(contentDir)) {
    return []
  }
  const files = fs.readdirSync(contentDir)
  const markdownFiles = files.filter((file) => file.endsWith(".md"))
  
  return markdownFiles.map((filename) => ({
    slug: generateSlug(filename)
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const contentDir = path.join(process.cwd(), "content/artumin")
  // Use lightweight version to avoid bundling gray-matter/marked at build time
  const { getArticleLightweight } = await import("@/lib/article-utils")
  const article = getArticleLightweight({
    contentDir,
    slug,
    defaultType: "artumin",
    customFields: {
      type: "artumin",
    },
  })

  return generateArticleMetadata({
    article,
    slug,
    basePath: "/strategic-narratives/world-of-artumin",
    sectionName: "World of Artumin",
    defaultDescription: "World of Artumin content by John Munn",
  })
}

async function loadArticle(slug: string): Promise<Article | null> {
  const contentDir = path.join(process.cwd(), "content/artumin")
  const article = await getArticle({
    contentDir,
    slug,
    defaultType: "artumin",
    customFields: {
      type: "artumin",
    },
  })

  if (!article) return null

  return {
    ...article,
    categories: article.categories || [],
    status: article.status || "published",
  } as Article
}

export default async function WorldOfArtumiArticlePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const article = await loadArticle(slug)
  
  if (!article) {
    notFound()
  }

  const articleUrl = `https://johnmunn.tech/strategic-narratives/world-of-artumin/${slug}`

  return (
    <>
      <ArticleStructuredData 
        article={article} 
        articleUrl={articleUrl}
        articleSection="World of Artumin"
        type="Article"
      />
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "/" },
          { name: "Writing", url: "/writing" },
          { name: article.title, url: `/strategic-narratives/world-of-artumin/${slug}` }
        ]}
      />
      <ArticleClientPage article={article} />
    </>
  )
}
