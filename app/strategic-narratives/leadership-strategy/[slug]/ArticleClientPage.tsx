"use client"

import { ContentLayout } from "@/components/content-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft, Share2, ExternalLink, Check, Copy, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { shareOrCopyUrl } from "@/lib/share-client"

interface ArticleClientPageProps {
  article: any
  backUrl?: string
  backLabel?: string
}

export function ArticleClientPage({
  article,
  backUrl = "/writing",
  backLabel = "Back to Writing",
}: ArticleClientPageProps) {
  const [relatedArticles, setRelatedArticles] = useState<any[]>([])
  const [shareState, setShareState] = useState<"idle" | "copying" | "copied" | "error">("idle")

  useEffect(() => {
    const loadRelatedArticles = async () => {
      try {
        const response = await fetch("/api/content/leadership")
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
      if (result === "shared" || result === "aborted") {
        setShareState("idle")
      } else {
        setShareState("copied")
        setTimeout(() => setShareState("idle"), 2000)
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
    const interactionClass = "transition-colors hover:bg-transparent active:bg-transparent focus-visible:bg-transparent"
    const baseClass = `text-slate-400 hover:text-slate-200 ${interactionClass}`
    switch (shareState) {
      case "copied":
        return `text-text-strong hover:text-text-strong ${interactionClass}`
      case "error":
        return `text-text-strong hover:text-text-strong ${interactionClass}`
      default:
        return baseClass
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
                className={getShareButtonClass()}
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
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <hr className="border-border-subtle mb-8" />
            <h3 className="text-xl font-semibold text-text-strong mb-4">Continue Reading</h3>
            <div className="grid md:grid-cols-2 gap-0">
              {relatedArticles.map((relatedArticle, index) => (
                <Link
                  key={relatedArticle.slug}
                  href={`/strategic-narratives/leadership-strategy/${relatedArticle.slug}`}
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
