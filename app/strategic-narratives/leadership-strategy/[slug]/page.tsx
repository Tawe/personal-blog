import { notFound } from "next/navigation"
import { ArticleClientPage } from "./ArticleClientPage"
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
  const contentDir = path.join(process.cwd(), "content/leadership")
  const files = fs.readdirSync(contentDir)
  const markdownFiles = files.filter((file) => file.endsWith(".md"))
  
  return markdownFiles.map((filename) => {
    const slug = filename.replace(".md", "").toLowerCase().replace(/\s+/g, "-")
    return { slug }
  })
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const contentDir = path.join(process.cwd(), "content/leadership")
    const files = fs.readdirSync(contentDir)
    const markdownFiles = files.filter((file) => file.endsWith(".md"))
    const matchingFile = markdownFiles.find((filename) => {
      const fileSlug = filename.replace(".md", "").toLowerCase().replace(/\s+/g, "-")
      return fileSlug === params.slug
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
    
    return {
      title: frontmatter.title || matchingFile.replace(".md", ""),
      description: frontmatter.excerpt || frontmatter.subtitle || "Leadership strategy article",
      openGraph: {
        title: frontmatter.title || matchingFile.replace(".md", ""),
        description: frontmatter.excerpt || frontmatter.subtitle || "Leadership strategy article",
        images: frontmatter.featured_image || frontmatter.image ? [frontmatter.featured_image || frontmatter.image] : [],
      },
    }
  } catch (error) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found."
    }
  }
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const contentDir = path.join(process.cwd(), "content/leadership")
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
      type: "leadership",
      code_languages: frontmatter.code_languages || [],
      updated: frontmatter.updated,
    }
  } catch (error) {
    console.error("Error loading article:", error)
    return null
  }
}

export default async function LeadershipStrategyArticlePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const article = await getArticle(params.slug)
  
  if (!article) {
    notFound()
  }

  return <ArticleClientPage article={article} />
}
