"use client"

import { notFound } from "next/navigation"
import { ContentLayout } from "@/components/content-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, ArrowLeft, Share2, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getArtumiContentBySlug, getAllArtumiContent } from "@/lib/content"

interface PageProps {
  params: {
    slug: string
  }
}

export default async function ArtumiContentPage({ params }: PageProps) {
  const decodedSlug = decodeURIComponent(params.slug)
  const content = await getArtumiContentBySlug(decodedSlug)

  if (!content) {
    notFound()
  }

  // Get related content
  const allContent = await getAllArtumiContent()
  const relatedContent = allContent.filter((c) => c.slug !== content.slug).slice(0, 2)

  const handleShare = async () => {
    const url = window.location.href
    const title = content.title

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url)
      }
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="relative">
        <ContentLayout title={content.title}>
          <div className="max-w-4xl mx-auto">
            {/* Back Navigation */}
            <div className="mb-8">
              <Button variant="ghost" className="text-slate-400 hover:text-slate-200" asChild>
                <Link href="/artumin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Artumin
                </Link>
              </Button>
            </div>

            {/* Content Header */}
            <header className="mb-8">
              {content.featured_image && (
                <div className="relative mb-8 rounded-xl overflow-hidden">
                  <Image
                    src={content.featured_image || "/placeholder.svg"}
                    alt={content.title}
                    width={800}
                    height={400}
                    className="aspect-video w-full object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                </div>
              )}

              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 leading-tight">{content.title}</h1>

                {/* Content Meta */}
                <div className="flex flex-wrap items-center gap-6 text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Created{" "}
                      {new Date(content.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {content.reading_time && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{content.reading_time} min read</span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-slate-200"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>

                {/* Tags */}
                {content.tags && content.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {content.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-slate-700/50 text-slate-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* External Links */}
                {(content.medium_link || content.devto_link || content.substack_link) && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-300">View On:</span>
                    {content.medium_link && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={content.medium_link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Medium
                        </Link>
                      </Button>
                    )}
                    {content.devto_link && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={content.devto_link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Dev.to
                        </Link>
                      </Button>
                    )}
                    {content.substack_link && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={content.substack_link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Substack
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </header>

            {/* Content Body */}
            <article className="prose prose-invert prose-purple max-w-none mb-12">
              <div dangerouslySetInnerHTML={{ __html: content.content }} />
            </article>

            {/* Related Content */}
            {relatedContent.length > 0 && (
              <Card className="bg-gradient-to-r from-purple-900/30 to-slate-800/30 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-100 mb-4">Continue Reading</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {relatedContent.map((relatedItem) => (
                      <Link
                        key={relatedItem.slug}
                        href={`/artumin/${relatedItem.slug}`}
                        className="block p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                      >
                        <h4 className="font-medium text-slate-200 mb-2">{relatedItem.title}</h4>
                        <p className="text-sm text-slate-400">{relatedItem.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
