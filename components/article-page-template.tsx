"use client"

import { useState, useEffect } from "react"
import { ContentLayout } from "@/components/content-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Article {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags: string[]
  featured_image?: string
  reading_time?: number
  content?: string
  featured?: boolean
}

interface ArticlePageTemplateProps {
  article: Article
  backUrl: string
  backLabel: string
  contentFolder: string
}

export function ArticlePageTemplate({ article, backUrl, backLabel, contentFolder }: ArticlePageTemplateProps) {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [shareState, setShareState] = useState<"idle" | "sharing" | "copied" | "error">("idle")

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        // Determine which API endpoint to use based on content folder
        let apiEndpoint = ""
        switch (contentFolder) {
          case "leadership":
            apiEndpoint = "/api/content/leadership"
            break
          case "technical-writings":
            apiEndpoint = "/api/content/technical"
            break
          case "artumin":
            apiEndpoint = "/api/content/artumin"
            break
          case "dnd-musings":
            apiEndpoint = "/api/content/dnd"
            break
          default:
            apiEndpoint = "/api/content/leadership"
        }

        const response = await fetch(apiEndpoint)
        const data = await response.json()
        const allArticles = data.articles || []

        // First try to find articles with matching tags, excluding current article
        let related = allArticles
          .filter((a: Article) => a.slug !== article.slug)
          .filter((a: Article) => a.tags.some((tag: string) => article.tags.includes(tag)))
        
        // If we don't have enough tag-matched articles, add other articles from the same category
        if (related.length < 2) {
          const otherArticles = allArticles
            .filter((a: Article) => a.slug !== article.slug)
            .filter((a: Article) => !related.some((r: Article) => r.slug === a.slug))
          
          related = [...related, ...otherArticles]
        }
        
        // Shuffle and take 2 for variety
        related = related.sort(() => Math.random() - 0.5).slice(0, 2)

        setRelatedArticles(related)
      } catch (error) {
        console.error("Error loading related articles:", error)
        setRelatedArticles([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedArticles()
  }, [article.slug, article.tags, contentFolder])

  const handleShare = async () => {
    const url = window.location.href
    const title = article.title

    setShareState("sharing")

    try {
      if (navigator.share && navigator.canShare?.({ title, url })) {
        await navigator.share({ title, url })
        setShareState("idle")
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
        setShareState("copied")
        setTimeout(() => setShareState("idle"), 2000)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = url
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        try {
          document.execCommand("copy")
          setShareState("copied")
          setTimeout(() => setShareState("idle"), 2000)
        } catch (err) {
          console.error("Fallback copy failed:", err)
          setShareState("error")
          setTimeout(() => setShareState("idle"), 2000)
        } finally {
          textArea.remove()
        }
      }
    } catch (error) {
      console.error("Error sharing:", error)
      setShareState("error")
      setTimeout(() => setShareState("idle"), 2000)
    }
  }

  const getShareButtonText = () => {
    switch (shareState) {
      case "sharing":
        return "Sharing..."
      case "copied":
        return "Copied!"
      case "error":
        return "Error"
      default:
        return "Share"
    }
  }

  return (
    <ContentLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Button variant="ghost" className="text-slate-400 hover:text-slate-200" asChild>
            <Link href={backUrl}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backLabel}
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          {article.featured_image && (
            <div className="relative mb-8 rounded-xl overflow-hidden">
              <Image
                src={article.featured_image || "/placeholder.svg"}
                alt={article.title}
                width={800}
                height={400}
                className="aspect-video w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
              {article.featured && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-yellow-600 text-yellow-100">Featured</Badge>
                </div>
              )}
            </div>
          )}

          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 leading-tight">{article.title}</h1>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(article.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.reading_time} min read</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-200"
                onClick={handleShare}
                disabled={shareState === "sharing"}
              >
                <Share2 className="mr-2 h-4 w-4" />
                {getShareButtonText()}
              </Button>
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-slate-700/50 text-slate-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-invert prose-blue max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: article.content || "" }} />
        </article>

        {/* Related Articles */}
        {!isLoading && relatedArticles.length > 0 && (
          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">Continue Reading</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.slug}
                    href={`${backUrl}/${relatedArticle.slug}`}
                    className="block p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                  >
                    <h4 className="font-medium text-slate-200 mb-2">{relatedArticle.title}</h4>
                    <p className="text-sm text-slate-400">{relatedArticle.excerpt}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(relatedArticle.date).toLocaleDateString()}</span>
                      <Clock className="h-3 w-3 ml-2" />
                      <span>{relatedArticle.reading_time} min</span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ContentLayout>
  )
}
