import { notFound } from "next/navigation"
import { ArticleClientPage } from "./ArticleClientPage"
import { ArticleStructuredData } from "@/components/article-structured-data"
import { BreadcrumbSchema } from "@/components/breadcrumb-schema"
import { getArticle } from "@/lib/article-utils"
import { generateArticleMetadata } from "@/lib/metadata-utils"
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
  system: string
  level_range?: string
  availability: string
  duration?: string
  price?: string
  platform?: string
  external_url?: string
  rating?: string
  playtested?: boolean
  website_exclusive?: boolean
}

async function loadArticle(slug: string): Promise<Article | null> {
  const contentDir = path.join(process.cwd(), "content/dnd-musings")
  const article = await getArticle({
    contentDir,
    slug,
    defaultType: "thought-piece",
    customFields: {
      type: "thought-piece",
      system: "system-agnostic",
      availability: "free",
    },
  })

  if (!article) return null

  // Handle D&D specific fields
  return {
    ...article,
    dndbeyond_link: article.dndbeyond_link || article.ddb_link,
    type: article.type || "thought-piece",
    system: article.system || "system-agnostic",
    level_range: article.level_range,
    availability: article.availability || "free",
    duration: article.duration,
    price: article.price,
    platform: article.platform,
    external_url: article.external_url,
    rating: article.rating,
    playtested: article.playtested || false,
    website_exclusive: article.website_exclusive || false,
  } as Article
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const contentDir = path.join(process.cwd(), "content/dnd-musings")
  // Use lightweight version to avoid bundling gray-matter/marked at build time
  const { getArticleLightweight } = await import("@/lib/article-utils")
  const article = getArticleLightweight({
    contentDir,
    slug,
    defaultType: "thought-piece",
    customFields: {
      type: "thought-piece",
      system: "system-agnostic",
      availability: "free",
    },
  })

  return generateArticleMetadata({
    article,
    slug,
    basePath: "/strategic-narratives/dnd-ttrpgs",
    sectionName: "D&D & TTRPGs",
    defaultDescription: "D&D and TTRPG content by John Munn",
  })
}

export default async function DndTtrpgsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await loadArticle(slug)

  if (!article) {
    notFound()
  }

  const articleUrl = `https://johnmunn.tech/strategic-narratives/dnd-ttrpgs/${slug}`

  return (
    <>
      <ArticleStructuredData 
        article={article} 
        articleUrl={articleUrl}
        articleSection="D&D & TTRPGs"
        type="Article"
      />
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "/" },
          { name: "Strategic Narratives", url: "/strategic-narratives" },
          { name: "D&D and TTRPGs", url: "/strategic-narratives/dnd-ttrpgs" },
          { name: article.title, url: `/strategic-narratives/dnd-ttrpgs/${slug}` }
        ]}
      />
      <ArticleClientPage article={article} />
    </>
  )
}
