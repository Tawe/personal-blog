"use client"

import { ContentLayout } from "@/components/content-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, ArrowLeft, Share2, ExternalLink, Check, Copy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

interface DndContent {
  slug: string
  title: string
  content: string
  excerpt: string
  date: string
  tags?: string[]
  reading_time?: number
  featured_image?: string
  medium_link?: string
  devto_link?: string
  substack_link?: string
  subtitle?: string
}

interface ArticleClientPageProps {
  article: DndContent
  backUrl?: string
  backLabel?: string
}

export function ArticleClientPage({
  article,
  backUrl = "/strategic-narratives/dnd-ttrpgs",
  backLabel = "Back to D&D and TTRPGs",
}: ArticleClientPageProps) {
  const [relatedArticles, setRelatedArticles] = useState<DndContent[]>([])
  const [shareState, setShareState] = useState<"idle" | "copying" | "copied" | "error">("idle")

  useEffect(() => {
    const loadRelatedArticles = async () => {
      try {
        const response = await fetch("/api/content/dnd")
        if (response.ok) {
          const allArticles = await response.json()
          const related = allArticles.filter((a: DndContent) => a.slug !== article.slug).slice(0, 2)
          setRelatedArticles(related)
        }
      } catch (error) {
        console.error("Failed to load related articles:", error)
      }
    }
    loadRelatedArticles()
  }, [article.slug])

  const handleShare = async () => {
    const url = window.location.href
    const title = article.title

    setShareState("copying")

    try {
      // Try Web Share API first (mobile/modern browsers)
      if (navigator.share && navigator.canShare && navigator.canShare({ title, url })) {
        await navigator.share({ title, url })
        setShareState("idle") // Reset state after successful share
        return
      }

      // Fallback to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
        setShareState("copied")

        // Reset state after 2 seconds
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

        if (document.execCommand("copy")) {
          setShareState("copied")
          setTimeout(() => setShareState("idle"), 2000)
        } else {
          throw new Error("Copy command failed")
        }

        document.body.removeChild(textArea)
      }
    } catch (error) {
      console.error("Share failed:", error)
      setShareState("error")
      setTimeout(() => setShareState("idle"), 3000)
    }
  }

  const getShareButtonContent = () => {
    switch (shareState) {
      case "copying":
        return (
          <>
            <Copy className="mr-2 h-4 w-4 animate-pulse" />
            Copying...
          </>
        )
      case "copied":
        return (
          <>
            <Check className="mr-2 h-4 w-4 text-green-400" />
            Copied!
          </>
        )
      case "error":
        return (
          <>
            <Share2 className="mr-2 h-4 w-4 text-red-400" />
            Try again
          </>
        )
      default:
        return (
          <>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </>
        )
    }
  }

  const getShareButtonClass = () => {
    const baseClass = "text-slate-400 hover:text-slate-200 transition-colors"
    switch (shareState) {
      case "copied":
        return "text-green-400 hover:text-green-300"
      case "error":
        return "text-red-400 hover:text-red-300"
      default:
        return baseClass
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
            </div>
          )}

          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 leading-tight">{article.title}</h1>
            {article.subtitle && (
              <h2 className="text-2xl text-slate-300 font-medium mt-2 mb-4">{article.subtitle}</h2>
            )}

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
              {article.reading_time && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{article.reading_time} min read</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className={getShareButtonClass()}
                onClick={handleShare}
                disabled={shareState === "copying"}
              >
                {getShareButtonContent()}
              </Button>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-slate-700/50 text-slate-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* External Links */}
            {(article.medium_link || article.devto_link || article.substack_link) && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-300">View On:</span>
                {article.medium_link && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={article.medium_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Medium
                    </Link>
                  </Button>
                )}
                {article.devto_link && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={article.devto_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Dev.to
                    </Link>
                  </Button>
                )}
                {article.substack_link && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={article.substack_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Substack
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-invert prose-blue max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: article.content || "" }} />
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">Continue Reading</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.slug}
                    href={`/strategic-narratives/dnd-ttrpgs/${relatedArticle.slug}`}
                    className="block p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                  >
                    <h4 className="font-medium text-slate-200 mb-2">{relatedArticle.title}</h4>
                    <p className="text-sm text-slate-400">{relatedArticle.excerpt}</p>
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
