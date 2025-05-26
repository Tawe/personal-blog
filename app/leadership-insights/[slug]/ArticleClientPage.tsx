"use client"

import { notFound } from "next/navigation"
import { ContentLayout } from "@/components/content-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getArticleBySlug, getAllArticles } from "@/lib/content"
import { remark } from "remark"
import remarkHtml from "remark-html"

async function parseMarkdown(content: string): Promise<string> {
  const result = await remark().use(remarkHtml, { sanitize: false }).process(content)
  return result.toString()
}

interface PageProps {
  params: {
    slug: string
  }
}

export default async function ArticleClientPage({ params }: PageProps) {
  let article

  try {
    // Load the actual article from markdown files
    const decodedSlug = decodeURIComponent(params.slug)
    article = getArticleBySlug(decodedSlug)
  } catch (error) {
    console.error("Error loading article:", error)
    notFound()
  }

  if (!article) {
    notFound()
  }

  return (
    <ContentLayout title={article.title}>
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Button variant="ghost" className="text-slate-400 hover:text-slate-200" asChild>
            <Link href="/leadership-insights">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Leadership Insights
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

          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 leading-tight">{article.title}</h1>

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
                onClick={async () => {
                  if (typeof window !== "undefined") {
                    const shareData = {
                      title: article.title,
                      text: article.excerpt || `Check out this article: ${article.title}`,
                      url: window.location.href,
                    }

                    if (navigator.share) {
                      try {
                        await navigator.share(shareData)
                      } catch (error) {
                        // User cancelled or error occurred, fallback to clipboard
                        if (error.name !== "AbortError") {
                          await navigator.clipboard.writeText(window.location.href)
                          alert("Article URL copied to clipboard!")
                        }
                      }
                    } else {
                      // Fallback: copy to clipboard
                      try {
                        await navigator.clipboard.writeText(window.location.href)
                        alert("Article URL copied to clipboard!")
                      } catch (error) {
                        // Final fallback: show URL in prompt
                        prompt("Copy this URL:", window.location.href)
                      }
                    }
                  }
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-slate-700/50 text-slate-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* View On Links */}
            {(article.medium_link || article.devto_link || article.substack_link) && (
              <div className="flex items-center gap-4 text-slate-400">
                <span className="text-sm font-medium">View On:</span>
                <div className="flex items-center gap-3">
                  {article.medium_link && (
                    <a
                      href={article.medium_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                      </svg>
                      <span className="text-sm">Medium</span>
                    </a>
                  )}
                  {article.devto_link && (
                    <a
                      href={article.devto_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45h.56c.42 0 .63-.05.83-.26.24-.25.26-.38.26-2.2 0-1.91-.02-1.96-.29-2.2zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z" />
                      </svg>
                      <span className="text-sm">Dev.to</span>
                    </a>
                  )}
                  {article.substack_link && (
                    <a
                      href={article.substack_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                      </svg>
                      <span className="text-sm">Substack</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-invert prose-blue max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: await parseMarkdown(article.content) }} />
        </article>

        {/* Related Articles */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Continue Reading</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {(() => {
                const allArticles = getAllArticles()
                const relatedArticles = allArticles.filter((a) => a.slug !== article.slug).slice(0, 2)

                return relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.slug}
                    href={`/leadership-insights/${encodeURIComponent(relatedArticle.slug)}`}
                    className="block p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                  >
                    <h4 className="font-medium text-slate-200 mb-2">{relatedArticle.title}</h4>
                    <p className="text-sm text-slate-400">{relatedArticle.excerpt}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(relatedArticle.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <Clock className="h-3 w-3 ml-2" />
                      <span>{relatedArticle.reading_time} min read</span>
                    </div>
                  </Link>
                ))
              })()}
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  )
}
