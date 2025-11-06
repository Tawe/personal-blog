import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArticleClientPage } from "./ArticleClientPage"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"

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

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const contentDir = path.join(process.cwd(), "content/dnd-musings")
    const files = fs.readdirSync(contentDir)
    const markdownFiles = files.filter((file) => file.endsWith(".md"))
    const matchingFile = markdownFiles.find((filename) => {
      const fileSlug = filename.replace(".md", "").toLowerCase().replace(/\s+/g, "-")
      return fileSlug === slug
    })
    
    if (!matchingFile) {
      return null
    }
    
    const filePath = path.join(contentDir, matchingFile)
    const fileContent = fs.readFileSync(filePath, "utf8")
    const { data: frontmatter, content } = matter(fileContent)
    
    return {
      slug,
      title: frontmatter.title || matchingFile.replace(".md", ""),
      subtitle: frontmatter.subtitle,
      date: frontmatter.date || new Date().toISOString(),
      excerpt: frontmatter.excerpt || content.substring(0, 150) + "...",
      content: await marked(content),
      tags: frontmatter.tags || [],
      featured_image: frontmatter.featured_image || frontmatter.image,
      reading_time: frontmatter.reading_time || Math.ceil(content.split(" ").length / 200),
      featured: frontmatter.featured || false,
      medium_link: frontmatter.medium_link,
      devto_link: frontmatter.devto_link,
      substack_link: frontmatter.substack_link,
      dndbeyond_link: frontmatter.ddb_link || frontmatter.dndbeyond_link,
      type: frontmatter.type || "thought-piece",
      system: frontmatter.system || "system-agnostic",
      level_range: frontmatter.level_range,
      availability: frontmatter.availability || "free",
      duration: frontmatter.duration,
      price: frontmatter.price,
      platform: frontmatter.platform,
      external_url: frontmatter.external_url,
      rating: frontmatter.rating,
      playtested: frontmatter.playtested || false,
      website_exclusive: frontmatter.website_exclusive || false,
    }
  } catch (error) {
    console.error("Error loading article:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug)
  
  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    }
  }

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    authors: [{ name: "John Munn" }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://johnmunn.dev/strategic-narratives/dnd-ttrpgs/${article.slug}`,
      siteName: "John Munn - Technical Leader",
      images: article.featured_image ? [
        {
          url: article.featured_image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ] : [
        {
          url: "/me.jpeg",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: article.date,
      authors: ["John Munn"],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.featured_image ? [article.featured_image] : ["/me.jpeg"],
    },
    alternates: {
      canonical: `https://johnmunn.dev/strategic-narratives/dnd-ttrpgs/${article.slug}`,
    },
  }
}

export default async function DndTtrpgsArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

  return <ArticleClientPage article={article} />
}
