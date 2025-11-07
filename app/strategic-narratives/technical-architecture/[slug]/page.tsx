import { notFound } from "next/navigation"
import { Metadata } from "next"
import { ArticleClientPage } from "./ArticleClientPage"
import { ArticleStructuredData } from "@/components/article-structured-data"
import { BreadcrumbSchema } from "@/components/breadcrumb-schema"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"

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
  
  return markdownFiles.map((filename) => {
    const slug = filename
      .replace(".md", "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    return { slug }
  })
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const contentDir = path.join(process.cwd(), "content/technical-writings")
    const files = fs.readdirSync(contentDir)
    const markdownFiles = files.filter((file) => file.endsWith(".md"))
    const matchingFile = markdownFiles.find((filename) => {
      const fileSlug = filename
        .replace(".md", "")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
      return fileSlug === slug
    })
    
    if (!matchingFile) {
      return {
        title: "Article Not Found",
        description: "The requested article could not be found."
      }
    }
    
    const filePath = path.join(contentDir, matchingFile)
    const fileContent = fs.readFileSync(filePath, "utf8")
    const { data: frontmatter } = matter(fileContent)
    
    const title = frontmatter.title || matchingFile.replace(".md", "")
    const description = frontmatter.excerpt || frontmatter.subtitle || "Technical architecture article by John Munn"
    const url = `https://johnmunn.tech/strategic-narratives/technical-architecture/${slug}`
    
    return {
      title,
      description,
      keywords: frontmatter.tags || [],
      authors: [{ name: "John Munn" }],
      openGraph: {
        title,
        description,
        url,
        siteName: "John Munn - Technical Leader",
        images: frontmatter.featured_image || frontmatter.image ? [
          {
            url: frontmatter.featured_image || frontmatter.image,
            width: 1200,
            height: 630,
            alt: title,
          }
        ] : [
          {
            url: "/me.jpeg",
            width: 1200,
            height: 630,
            alt: title,
          }
        ],
        locale: "en_US",
        type: "article",
        publishedTime: frontmatter.date,
        authors: ["John Munn"],
        tags: frontmatter.tags || [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: frontmatter.featured_image || frontmatter.image ? [frontmatter.featured_image || frontmatter.image] : ["/me.jpeg"],
      },
      alternates: {
        canonical: url,
      },
    } as Metadata
  } catch (error) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found."
    }
  }
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const contentDir = path.join(process.cwd(), "content/technical-writings")
    const files = fs.readdirSync(contentDir)
    const markdownFiles = files.filter((file) => file.endsWith(".md"))
    const matchingFile = markdownFiles.find((filename) => {
      const fileSlug = filename
        .replace(".md", "")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
      return fileSlug === slug
    })
    
    if (!matchingFile) {
      return null
    }
    
    const filePath = path.join(contentDir, matchingFile)
    const fileContent = fs.readFileSync(filePath, "utf8")
    const { data: frontmatter, content } = matter(fileContent)
    const htmlContent = await marked(content)
    
    return {
      slug: slug,
      title: frontmatter.title || matchingFile.replace(".md", ""),
      subtitle: frontmatter.subtitle,
      date: frontmatter.date || new Date().toISOString(),
      excerpt: frontmatter.excerpt || content.substring(0, 150) + "...",
      content: htmlContent,
      tags: frontmatter.tags || [],
      featured_image: frontmatter.featured_image || frontmatter.image,
      reading_time: frontmatter.reading_time || Math.ceil(content.split(" ").length / 200),
      featured: frontmatter.featured || false,
      medium_link: frontmatter.medium_link,
      devto_link: frontmatter.devto_link,
      substack_link: frontmatter.substack_link,
      difficulty: frontmatter.difficulty || "intermediate",
      type: "technical",
      code_languages: frontmatter.code_languages || [],
      updated: frontmatter.updated,
    }
  } catch (error) {
    console.error("Error loading article:", error)
    return null
  }
}

export default async function TechnicalArchitectureArticlePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const article = await getArticle(slug)
  
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
