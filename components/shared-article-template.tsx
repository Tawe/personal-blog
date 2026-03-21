"use client"

import { useState, useEffect, useRef } from "react"
import { ContentLayout } from "@/components/content-layout"
import { EditorialPill, EditorialSurface } from "@/components/design-system"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Share2, ExternalLink, Check, Copy, Linkedin, ChevronRight } from "lucide-react"
import Link from "next/link"
import type { Article, HubConfig } from "@/lib/types"
import type { Series } from "@/lib/series-utils"
import { shareOrCopyUrl } from "@/lib/share-client"
import { DateText } from "@/components/date-text"
import { SharedHero } from "@/components/shared-hero"

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

interface GistApiFile {
  filename: string
  language: string | null
  content?: string
  raw_url?: string
  truncated?: boolean
}

interface GistApiResponse {
  html_url: string
  description: string | null
  owner?: {
    login?: string
  }
  files: Record<string, GistApiFile>
}

interface ExternalPublicationLink {
  label: string
  href: string
}

function extractGistId(gistEmbedValue: string): string | null {
  const trimmed = gistEmbedValue.trim()
  if (!trimmed) return null
  const withoutQuery = trimmed.split("?")[0]
  const noJsSuffix = withoutQuery.endsWith(".js")
    ? withoutQuery.slice(0, -3)
    : withoutQuery
  const segments = noJsSuffix.split("/").filter(Boolean)
  return segments.length ? segments[segments.length - 1] : null
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function getExternalPublicationLinks(article: Article, dndBeyondLink?: string): ExternalPublicationLink[] {
  const candidates = [
    { label: "Medium", href: article.medium_link },
    { label: "Dev.to", href: article.devto_link },
    { label: "Substack", href: article.substack_link },
    { label: "LinkedIn", href: article.linkedin_link },
    { label: "D&D Beyond", href: dndBeyondLink },
  ]

  return candidates.filter((candidate): candidate is ExternalPublicationLink => Boolean(candidate.href))
}

function PublicationLinks({
  links,
  className,
}: {
  links: ExternalPublicationLink[]
  className?: string
}) {
  if (!links.length) {
    return null
  }

  return (
    <div className={className}>
      <p className="font-medium text-text-muted">View on:</p>
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
        {links.map((link) => (
          <Link
            key={`${link.label}-${link.href}`}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-w-0 items-center gap-1.5 rounded-sm transition-colors hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="min-w-0 break-words [overflow-wrap:anywhere]">{link.label}</span>
            <span className="sr-only"> (opens in new tab)</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function SharedArticleTemplate({
  article,
  seriesContext,
  config,
  backUrl = "/writing",
  backLabel = "Back to Writing",
  breadcrumbLabel = "Writing",
}: SharedArticleTemplateProps) {
  const articleRef = useRef<HTMLElement>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [shareState, setShareState] = useState<"idle" | "copying" | "copied" | "error">("idle")
  const [shareUrl, setShareUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const dndBeyondLink = (article as Article & { dndbeyond_link?: string }).dndbeyond_link
  const publicationLinks = getExternalPublicationLinks(article, dndBeyondLink)
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
    const root = articleRef.current
    if (!root) return

    const placeholders = root.querySelectorAll<HTMLElement>("[data-gist-embed]")
    placeholders.forEach(async (placeholder) => {
      if (placeholder.dataset.gistHydrated === "true") return

      placeholder.dataset.gistHydrated = "true"
      const gistUrl = placeholder.dataset.gistEmbed?.trim()
      const fallbackUrl = gistUrl?.replace(/\.js$/, "")
      const gistId = gistUrl ? extractGistId(gistUrl) : null

      if (!gistId) {
        placeholder.innerHTML = fallbackUrl
          ? `<p><a href="${fallbackUrl}" target="_blank" rel="noopener noreferrer">View gist</a></p>`
          : `<p>Unable to load gist.</p>`
        return
      }

      placeholder.innerHTML = `<p class="text-sm text-text-muted">Loading gist…</p>`

      try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`)
        if (!response.ok) {
          throw new Error(`Failed to load gist: ${response.status}`)
        }

        const gist = (await response.json()) as GistApiResponse
        const files = Object.values(gist.files || {})

        if (!files.length) {
          throw new Error("Gist has no files")
        }

        const fileBlocks = files
          .map((file) => {
            const content = file.content || ""
            const languageLabel = file.language ? ` (${file.language})` : ""
            const truncatedNotice = file.truncated && file.raw_url
              ? `<p class="mt-2 text-xs text-text-muted">File truncated in API response. <a href="${file.raw_url}" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2">Open raw file</a>.</p>`
              : ""

            return `
              <div class="mt-4">
                <p class="text-xs font-medium text-text-muted">${escapeHtml(file.filename)}${escapeHtml(languageLabel)}</p>
                <pre class="mt-2 overflow-x-auto rounded-md border border-border-subtle bg-bg-soft p-3 text-sm"><code>${escapeHtml(content)}</code></pre>
                ${truncatedNotice}
              </div>
            `
          })
          .join("")

        const owner = gist.owner?.login ? ` by ${escapeHtml(gist.owner.login)}` : ""
        const title = gist.description ? escapeHtml(gist.description) : `Gist${owner}`

        placeholder.innerHTML = `
          <div class="my-4 rounded-lg border border-border-subtle bg-bg-paper p-4">
            <p class="text-sm font-semibold text-text-strong">${title}</p>
            <p class="mt-1 text-xs text-text-muted">
              <a href="${gist.html_url}" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2">
                View on GitHub Gist
              </a>
            </p>
            ${fileBlocks}
          </div>
        `
      } catch (error) {
        console.error("Failed to render gist embed:", error)
        if (fallbackUrl) {
          placeholder.innerHTML = `
            <p class="text-sm text-text-body">
              Unable to load embedded gist.
              <a href="${fallbackUrl}" target="_blank" rel="noopener noreferrer" class="ml-1 underline underline-offset-2 text-accent-primary hover:text-accent-primary-hover">
                View on GitHub Gist
              </a>
            </p>
          `
        } else {
          placeholder.innerHTML = `<p class="text-sm text-text-body">Unable to load embedded gist.</p>`
        }
      }
    })
  }, [article.slug, article.content])

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
      return "text-text-muted hover:text-text-strong lg:text-white lg:hover:text-white lg:bg-slate-900/30 lg:hover:bg-slate-900/55 lg:focus-visible:bg-slate-900/55"
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
    <ContentLayout>
      <div className="mx-auto max-w-4xl">
        <SharedHero
          breadcrumbLabel={breadcrumbLabel}
          breadcrumbUrl={backUrl}
          backLabel={backLabel}
          backUrl={backUrl}
          showBackLink={false}
          title={article.title}
          subtitle={article.subtitle}
          imageSrc={article.featured_image || undefined}
          imagePriority={Boolean(article.featured_image)}
          metaRow={
            <>
              <div className="flex min-w-0 items-center gap-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <DateText
                  value={article.date}
                  options={{
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }}
                />
              </div>
              <div className="flex min-w-0 items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span>{article.reading_time} min read</span>
              </div>
            </>
          }
          shareRow={
            <>
              <Button
                variant="ghost"
                size="sm"
                className={getShareButtonClass(Boolean(article.featured_image))}
                onClick={handleShare}
                disabled={shareState === "copying"}
              >
                {getShareButtonContent()}
              </Button>
              {linkedInShareHref && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={getShareButtonClass(Boolean(article.featured_image))}
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
                  className={getShareButtonClass(Boolean(article.featured_image))}
                  asChild
                >
                  <Link href={xShareHref} target="_blank" rel="noopener noreferrer">
                    Share on X
                  </Link>
                </Button>
              )}
            </>
          }
          overlayBadge={
            article.featured ? (
              <div className="absolute top-4 right-4">
                <EditorialPill tone="warm">Featured</EditorialPill>
              </div>
            ) : undefined
          }
          mobilePreMediaRow={
            publicationLinks.length ? <PublicationLinks links={publicationLinks} className="min-w-0 space-y-1" /> : undefined
          }
        />

        {publicationLinks.length > 0 && (
          <EditorialSurface className="mb-8 hidden min-w-0 p-5 text-sm text-text-muted lg:block">
            <PublicationLinks links={publicationLinks} className="min-w-0 space-y-1" />
          </EditorialSurface>
        )}

        {seriesContext && (
          <EditorialSurface className="mb-8 p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-text-muted">Series</p>
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
              <div className="grid gap-3 md:grid-cols-2">
                {previousSeriesEntry ? (
                  <Link
                    href={previousSeriesEntry.href}
                    className="block rounded-lg border border-border-subtle bg-bg-soft p-4 transition-colors hover:border-accent-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <p className="mb-1 text-xs uppercase tracking-wide text-text-muted">Previous</p>
                    <p className="text-sm font-medium text-text-strong">{previousSeriesEntry.title}</p>
                  </Link>
                ) : (
                  <div />
                )}
                {nextSeriesEntry && (
                  <Link
                    href={nextSeriesEntry.href}
                    className="block rounded-lg border border-border-subtle bg-bg-soft p-4 transition-colors hover:border-accent-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <p className="mb-1 text-xs uppercase tracking-wide text-text-muted">Next</p>
                    <p className="text-sm font-medium text-text-strong">{nextSeriesEntry.title}</p>
                  </Link>
                )}
              </div>
            )}
          </EditorialSurface>
        )}

        <article
          ref={articleRef}
          className="prose prose-blue mb-12 max-w-none prose-lg prose-headings:text-text-strong prose-p:text-text-body prose-p:leading-relaxed prose-strong:text-text-strong prose-code:rounded prose-code:bg-bg-soft prose-code:px-1 prose-code:py-0.5 prose-code:text-accent-primary prose-pre:border prose-pre:border-border-subtle prose-pre:bg-bg-soft prose-blockquote:border-l-accent-primary prose-blockquote:text-text-body"
        >
          <div dangerouslySetInnerHTML={{ __html: article.content || "" }} />
        </article>

        {!isLoading && relatedArticles.length > 0 && (
          <EditorialSurface className="mt-12 p-6">
            <hr className="mb-8 border-border-subtle" />
            <h3 className="mb-4 text-xl font-semibold text-text-strong">Continue Reading</h3>
            <div className="grid gap-0 md:grid-cols-2">
              {relatedArticles.map((relatedArticle, index) => (
                <Link
                  key={relatedArticle.slug}
                  href={`${config.baseUrl}/${relatedArticle.slug}`}
                  className={`group block rounded-lg border-border-subtle p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-b md:border-b-0 md:border-r ${index % 2 === 1 ? "md:border-r-0" : ""} last:border-b-0`}
                >
                  <h4 className="mb-2 font-medium text-text-strong transition-colors group-hover:text-accent-primary">{relatedArticle.title}</h4>
                  <p className="mb-2 text-sm leading-relaxed text-text-body">{relatedArticle.excerpt}</p>
                  <div className="mb-3 flex items-center gap-2 text-xs text-text-muted">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    <DateText value={relatedArticle.date} />
                    <Clock className="ml-2 h-3 w-3" aria-hidden="true" />
                    <span>{relatedArticle.reading_time} min</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-primary group-hover:text-accent-primary-hover">
                    Read
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </EditorialSurface>
        )}
      </div>
    </ContentLayout>
  )
}
