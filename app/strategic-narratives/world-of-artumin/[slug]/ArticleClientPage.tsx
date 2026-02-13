"use client"

import { ContentLayout } from "@/components/content-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft, Share2, ExternalLink, Copy, Check, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import type { TechnicalArticleMetadata } from "@/lib/content"
import { shareOrCopyUrl } from "@/lib/share-client"

interface ArticleClientPageProps {
  article: any
  backUrl?: string
  backLabel?: string
}

export function ArticleClientPage({
  article,
  backUrl = "/strategic-narratives/world-of-artumin",
  backLabel = "Back to World of Artumin",
}: ArticleClientPageProps) {
  const [relatedArticles, setRelatedArticles] = useState<TechnicalArticleMetadata[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [shareState, setShareState] = useState<"idle" | "copying" | "success" | "error">("idle")

  useEffect(() => {
    const loadRelatedArticles = async () => {
      try {
        const response = await fetch("/api/content/artumin")
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
      const result = await shareOrCopyUrl(title, url)
      if (result === "aborted") {
        setShareState("idle")
        return
      }
      setShareState("success")
      setTimeout(() => setShareState("idle"), 2000)
    } catch (error) {
      console.error("Error sharing:", error)
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
      case "success":
        return (
          <>
            <Check className="mr-2 h-4 w-4 text-green-400" />
            <span>Copied!</span>
          </>
        )
      case "error":
        return (
          <>
            <Share2 className="mr-2 h-4 w-4 text-red-400" />
            <span>Try again</span>
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
                alt=""
                width={800}
                height={400}
                className="aspect-video w-full object-cover object-center"
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
                className={`transition-colors hover:bg-transparent active:bg-transparent focus-visible:bg-transparent ${
                  shareState === "success"
                    ? "text-text-strong hover:text-text-strong"
                    : shareState === "error"
                      ? "text-text-strong hover:text-text-strong"
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
                      <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                      Medium<span className="sr-only"> (opens in new tab)</span>
                    </Link>
                  </Button>
                )}
                {article.devto_link && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={article.devto_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                      Dev.to<span className="sr-only"> (opens in new tab)</span>
                    </Link>
                  </Button>
                )}
                {article.substack_link && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={article.substack_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                      Substack<span className="sr-only"> (opens in new tab)</span>
                    </Link>
                  </Button>
                )}
                {article.linkedin_link && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={article.linkedin_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                      LinkedIn<span className="sr-only"> (opens in new tab)</span>
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-blue max-w-none mb-12">
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
                  href={`/strategic-narratives/world-of-artumin/${relatedArticle.slug}`}
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
