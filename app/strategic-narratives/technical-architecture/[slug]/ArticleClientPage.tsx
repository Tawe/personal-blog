"use client"

import { ContentLayout } from "@/components/content-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft, Share2, ExternalLink, Copy, Check, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { TechnicalArticleMetadata } from "@/lib/content"
import { useEffect, useState } from "react"

interface ArticleClientPageProps {
  article: any
  backUrl?: string
  backLabel?: string
}

export function ArticleClientPage({
  article,
  backUrl = "/strategic-narratives/technical-architecture",
  backLabel = "Back to Technical Architecture",
}: ArticleClientPageProps) {
  const [relatedArticles, setRelatedArticles] = useState<TechnicalArticleMetadata[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [shareState, setShareState] = useState<"idle" | "copying" | "success" | "error">("idle")

  useEffect(() => {
    const loadRelatedArticles = async () => {
      try {
        const response = await fetch("/api/content/technical")
        const data = await response.json()
        const allArticles = data.articles || []
        
        // Filter out current article and shuffle for variety
        const related = allArticles
          .filter((a) => a.slug !== article.slug)
          .sort(() => Math.random() - 0.5)
          .slice(0, 2)
        
        setRelatedArticles(related)
      } catch (error) {
        console.error("Error loading related articles:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadRelatedArticles()
  }, [article.slug])

  const handleShare = async () => {
    const url = window.location.href
    const title = article.title

    setShareState("copying")

    try {
      // Check if Web Share API is available and can share this content
      if (navigator.share && navigator.canShare && navigator.canShare({ title, url })) {
        await navigator.share({ title, url })
        setShareState("success")
      } else {
        // Fallback to clipboard
        await copyToClipboard(url)
      }
    } catch (error) {
      console.error("Error sharing:", error)

      // If Web Share fails, try clipboard as fallback
      if (error.name === "AbortError") {
        // User cancelled the share dialog
        setShareState("idle")
        return
      }

      // Try clipboard fallback for other errors
      try {
        await copyToClipboard(url)
      } catch (clipboardError) {
        console.error("Clipboard fallback failed:", clipboardError)
        setShareState("error")
        setTimeout(() => setShareState("idle"), 3000)
      }
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      // Modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
        setShareState("success")
        setTimeout(() => setShareState("idle"), 2000)
        return
      }

      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      const successful = document.execCommand("copy")
      document.body.removeChild(textArea)

      if (successful) {
        setShareState("success")
        setTimeout(() => setShareState("idle"), 2000)
      } else {
        throw new Error("Copy command failed")
      }
    } catch (error) {
      console.error("Clipboard operation failed:", error)
      throw error
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
      case "success":
        return (
          <>
            <Check className="mr-2 h-4 w-4 text-green-400" />
            <span className="text-green-400">Copied!</span>
          </>
        )
      case "error":
        return (
          <>
            <Share2 className="mr-2 h-4 w-4 text-red-400" />
            <span className="text-red-400">Try again</span>
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

  return (
    <ContentLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Button variant="ghost" className="text-text-muted hover:text-text-body" asChild>
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
            <h1 className="text-4xl lg:text-5xl font-bold text-text-strong leading-tight">{article.title}</h1>
            {article.subtitle && (
              <h2 className="text-2xl text-text-body font-medium mt-2 mb-4">{article.subtitle}</h2>
            )}

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-text-muted">
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
                className={`transition-colors ${
                  shareState === "success"
                    ? "text-green-400 hover:text-green-300"
                    : shareState === "error"
                      ? "text-red-400 hover:text-red-300"
                      : "text-text-muted hover:text-text-body"
                }`}
                onClick={handleShare}
                disabled={shareState === "copying"}
              >
                {getShareButtonContent()}
              </Button>
            </div>

            {/* External Links */}
            {(article.medium_link || article.devto_link || article.substack_link || article.linkedin_link) && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-text-body font-medium">View On:</span>
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
                {article.linkedin_link && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={article.linkedin_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      LinkedIn
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
        {!isLoading && relatedArticles.length > 0 && (
          <div className="mt-12">
            <hr className="border-border-subtle mb-8" />
            <h3 className="text-xl font-semibold text-text-strong mb-4">Continue Reading</h3>
            <div className="grid md:grid-cols-2 gap-0">
              {relatedArticles.map((relatedArticle, index) => (
                <Link
                  key={relatedArticle.slug}
                  href={`/strategic-narratives/technical-architecture/${relatedArticle.slug}`}
                  className={`block p-4 rounded-lg group border-b md:border-b-0 md:border-r border-border-subtle last:border-b-0 ${index % 2 === 1 ? "md:border-r-0" : ""}`}
                >
                  <h4 className="font-medium text-text-strong group-hover:text-accent-primary transition-colors mb-2">{relatedArticle.title}</h4>
                  <p className="text-sm text-text-body leading-relaxed mb-3">{relatedArticle.excerpt}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-primary group-hover:text-accent-primary-hover">
                    Read
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </ContentLayout>
  )
}
