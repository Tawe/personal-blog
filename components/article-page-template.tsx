"use client"

import { useState, useEffect } from "react"
import { ContentLayout } from "@/components/content-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getAllArticles } from "@/lib/content-unified"
import type { Article } from "@/lib/types"

interface ArticlePageTemplateProps {
  article: Article
  backUrl: string
  backLabel: string
  contentFolder: string
}

export function ArticlePageTemplate({ article, backUrl, backLabel, contentFolder }: ArticlePageTemplateProps) {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const allArticles = getAllArticles(contentFolder)
      const related = allArticles
        .filter((a) => a.slug !== article.slug)
        .filter((a) => a.tags.some((tag) => article.tags.includes(tag)))
        .slice(0, 2)

      setRelatedArticles(related)
    } catch (error) {
      console.error("Error loading related articles:", error)
      setRelatedArticles([])
    } finally {
      setIsLoading(false)
    }
  }, [article.slug, article.tags, contentFolder])

  const handleShare = async () => {
    const url = window.location.href
    const title = article.title

    try {
      if (navigator.share) {
        await navigator.share({ title, url })
      } else {
        await navigator.clipboard.writeText(url)
        // You could add a toast notification here
      }
    } catch (error) {
      console.error("Error sharing:", error)
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
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
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
