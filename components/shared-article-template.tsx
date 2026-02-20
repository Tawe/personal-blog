"use client"

import { useState, useEffect } from "react"
import { ContentLayout } from "@/components/content-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft, Share2, ExternalLink, Check, Copy, ChevronRight, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Article, HubConfig } from "@/lib/types"
import type { Series } from "@/lib/series-utils"
import { shareOrCopyUrl } from "@/lib/share-client"
import { DateText } from "@/components/date-text"

interface SharedArticleTemplateProps {
  article: Article
  seriesContext?: {
    series: Series
    currentIndex: number
  }
  config: HubConfig
  backUrl?: string
  backLabel?: string
  breadcrumbLabel?: string
}

export function SharedArticleTemplate({
  article,
  seriesContext,
  config,
  backUrl = "/writing",
  backLabel = "Back to Writing",
  breadcrumbLabel = "Writing",
}: SharedArticleTemplateProps) {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [shareState, setShareState] = useState<"idle" | "copying" | "copied" | "error">("idle")
  const [shareUrl, setShareUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const dndBeyondLink = (article as Article & { dndbeyond_link?: string }).dndbeyond_link
  const previousSeriesEntry =
    seriesContext && seriesContext.currentIndex > 0
      ? seriesContext.series.entries[seriesContext.currentIndex - 1]
      : undefined
  const nextSeriesEntry =
    seriesContext && seriesContext.currentIndex < seriesContext.series.entries.length - 1
      ? seriesContext.series.entries[seriesContext.currentIndex + 1]
      : undefined

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  useEffect(() => {
    const loadRelatedArticles = async () => {
      try {
        // Map content folder to API endpoint
        const apiEndpoint = config.contentFolder === 'dnd-musings' ? '/api/content/dnd' :
                          config.contentFolder === 'leadership' ? '/api/content/leadership' :
                          config.contentFolder === 'technical-writings' ? '/api/content/technical' :
                          config.contentFolder === 'artumin' ? '/api/content/artumin' : null

        if (!apiEndpoint) {
          setRelatedArticles([])
          setIsLoading(false)
          return
        }

        const response = await fetch(apiEndpoint)
        if (response.ok) {
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
        } else {
          setRelatedArticles([])
        }
      } catch (error) {
        console.error("Error loading related articles:", error)
        setRelatedArticles([])
      } finally {
        setIsLoading(false)
      }
    }

    loadRelatedArticles()
  }, [article.slug, article.tags, config.contentFolder])

  const linkedInShareHref = shareUrl
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    : ""
  const xShareHref = shareUrl
    ? `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`
    : ""

  const handleShare = async () => {
    const url = window.location.href
    const title = article.title

    setShareState("copying")

    try {
      const result = await shareOrCopyUrl(title, url)
      if (result === "shared") {
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

  const getShareButtonClass = (onImage = false) => {
    const interactionClass =
      "transition-colors !hover:bg-transparent !active:bg-transparent !focus-visible:bg-transparent"
    if (onImage) {
      return "text-white hover:text-white bg-slate-900/30 hover:bg-slate-900/55 focus-visible:bg-slate-900/55"
    }
    switch (shareState) {
      case "copied":
        return `text-text-strong hover:text-text-strong ${interactionClass}`
      case "error":
        return `text-text-strong hover:text-text-strong ${interactionClass}`
      default:
        return `text-text-muted hover:text-text-strong ${interactionClass}`
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="absolute inset-0 bg-tech-pattern opacity-[0.08]"></div>
      <div className="relative">
        <ContentLayout>
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb Navigation */}
            <div className="mb-8">
              <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-text-muted">
                <Link href={backUrl} className="hover:text-text-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">
                  {breadcrumbLabel}
                </Link>
                <ChevronRight className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
                <span className="text-text-strong" aria-current="page">{article.title}</span>
              </nav>
            </div>

            {/* Back Navigation */}
            <div className="mb-8">
              <Button
                variant="ghost"
                className="text-text-muted hover:text-text-strong !hover:bg-transparent !active:bg-transparent !focus-visible:bg-transparent"
                asChild
              >
                <Link href={backUrl}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {backLabel}
                </Link>
              </Button>
            </div>

            {/* Hero Section with Featured Image */}
            {article.featured_image && (
              <div className="relative mb-8 rounded-xl overflow-hidden">
                <div className="aspect-video w-full">
                  <Image
                    src={article.featured_image || "/placeholder.svg"}
                    alt=""
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="space-y-4">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">{article.title}</h1>
                    {article.subtitle && (
                      <h2 className="text-2xl text-slate-100 font-medium mt-2 mb-4">{article.subtitle}</h2>
                    )}

                    {/* Article Metadata Bar */}
                    <div className="flex flex-wrap items-center gap-6 text-slate-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <DateText
                          value={article.date}
                          options={{
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{article.reading_time} min read</span>
                      </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={getShareButtonClass(true)}
                      onClick={handleShare}
                      disabled={shareState === "copying"}
                    >
                      {getShareButtonContent()}
                    </Button>
                    {linkedInShareHref && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={getShareButtonClass(true)}
                        asChild
                      >
                        <Link href={linkedInShareHref} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="mr-2 h-4 w-4" />
                          LinkedIn
                        </Link>
                      </Button>
                    )}
                    {xShareHref && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={getShareButtonClass(true)}
                        asChild
                      >
                        <Link href={xShareHref} target="_blank" rel="noopener noreferrer">
                          <Twitter className="mr-2 h-4 w-4" />
                          X
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

                {article.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-600 text-yellow-100">Featured</Badge>
                  </div>
                )}
              </div>
            )}

            {/* Article Header (for articles without featured image) */}
            {!article.featured_image && (
              <header className="mb-8">
                <div className="space-y-6">
                  <h1 className="text-4xl lg:text-5xl font-bold text-text-strong leading-tight">{article.title}</h1>
                  {article.subtitle && (
                    <h2 className="text-2xl text-text-body font-medium mt-2 mb-4">{article.subtitle}</h2>
                  )}

                  {/* Article Metadata Bar */}
                  <div className="flex flex-wrap items-center gap-6 text-text-muted">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <DateText
                        value={article.date}
                        options={{
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{article.reading_time} min read</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={getShareButtonClass()}
                      onClick={handleShare}
                      disabled={shareState === "copying"}
                    >
                      {getShareButtonContent()}
                    </Button>
                    {linkedInShareHref && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={getShareButtonClass()}
                        asChild
                      >
                        <Link href={linkedInShareHref} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="mr-2 h-4 w-4" />
                          LinkedIn
                        </Link>
                      </Button>
                    )}
                    {xShareHref && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={getShareButtonClass()}
                        asChild
                      >
                        <Link href={xShareHref} target="_blank" rel="noopener noreferrer">
                          <Twitter className="mr-2 h-4 w-4" />
                          X
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </header>
            )}

            {/* "View On" External Links */}
            {(article.medium_link || article.devto_link || article.substack_link || article.linkedin_link || dndBeyondLink) && (
              <div className="flex items-center gap-4 mb-8 p-4 bg-bg-soft rounded-lg border border-border-subtle">
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
                {dndBeyondLink && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={dndBeyondLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                      D&D Beyond<span className="sr-only"> (opens in new tab)</span>
                    </Link>
                  </Button>
                )}
              </div>
            )}

            {seriesContext && (
              <section className="mb-8 p-5 rounded-xl border border-border-subtle bg-bg-paper">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Series</p>
                    <h3 className="text-lg font-semibold text-text-strong">{seriesContext.series.name}</h3>
                    <p className="text-sm text-text-muted">
                      Part {seriesContext.currentIndex + 1} of {seriesContext.series.entries.length}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/series/${seriesContext.series.slug}`}>View full series</Link>
                  </Button>
                </div>

                {(previousSeriesEntry || nextSeriesEntry) && (
                  <div className="grid md:grid-cols-2 gap-3">
                    {previousSeriesEntry ? (
                      <Link
                        href={previousSeriesEntry.href}
                        className="block rounded-lg border border-border-subtle p-3 hover:border-accent-primary/40 transition-colors"
                      >
                        <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Previous</p>
                        <p className="text-sm font-medium text-text-strong">{previousSeriesEntry.title}</p>
                      </Link>
                    ) : (
                      <div />
                    )}
                    {nextSeriesEntry && (
                      <Link
                        href={nextSeriesEntry.href}
                        className="block rounded-lg border border-border-subtle p-3 hover:border-accent-primary/40 transition-colors"
                      >
                        <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Next</p>
                        <p className="text-sm font-medium text-text-strong">{nextSeriesEntry.title}</p>
                      </Link>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* Article Content with Professional Typography */}
            <article className="prose prose-blue max-w-none mb-12 prose-lg prose-headings:text-text-strong prose-p:text-text-body prose-p:leading-relaxed prose-strong:text-text-strong prose-code:text-accent-primary prose-code:bg-bg-soft prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-bg-soft prose-pre:border prose-pre:border-border-subtle prose-blockquote:border-l-accent-primary prose-blockquote:text-text-body">
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
                      href={`${config.baseUrl}/${relatedArticle.slug}`}
                      className={`block p-4 rounded-lg group border-b md:border-b-0 md:border-r border-border-subtle last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${index % 2 === 1 ? "md:border-r-0" : ""}`}
                    >
                      <h4 className="font-medium text-text-strong group-hover:text-accent-primary transition-colors mb-2">{relatedArticle.title}</h4>
                      <p className="text-sm text-text-body leading-relaxed mb-2">{relatedArticle.excerpt}</p>
                      <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
                        <Calendar className="h-3 w-3" />
                        <DateText value={relatedArticle.date} />
                        <Clock className="h-3 w-3 ml-2" />
                        <span>{relatedArticle.reading_time} min</span>
                      </div>
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
      </div>
    </div>
  )
}
