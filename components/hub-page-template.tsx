"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ContentLayout } from "@/components/content-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Article {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  readingTime: number
  featured?: boolean
}

interface HubConfig {
  title: string
  description: string
  contentFolder: string
  baseUrl: string
}

interface HubPageTemplateProps {
  config: HubConfig
  children?: React.ReactNode
}

export function HubPageTemplate({ config, children }: HubPageTemplateProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true)
        // Determine which API endpoint to use based on content folder
        let apiEndpoint = "/api/content/leadership"
        if (config.contentFolder === "technical-writings") {
          apiEndpoint = "/api/content/technical"
        } else if (config.contentFolder === "artumin") {
          apiEndpoint = "/api/content/artumin"
        } else if (config.contentFolder === "dnd-musings") {
          apiEndpoint = "/api/content/dnd"
        }

        const response = await fetch(apiEndpoint)
        if (!response.ok) {
          throw new Error("Failed to fetch articles")
        }
        const data = await response.json()
        setArticles(data.articles || [])
        setError(null)
      } catch (err) {
        console.error("Error loading articles:", err)
        setError("Failed to load articles")
        setArticles([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [config.contentFolder])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
        <div className="relative">
          <ContentLayout title={config.title} description={config.description}>
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center py-12">
                <div className="text-slate-400">Loading articles...</div>
              </div>
            </div>
          </ContentLayout>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
        <div className="relative">
          <ContentLayout title={config.title} description={config.description}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center py-12">
                <div className="text-red-400 mb-4">⚠️ Error</div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">Failed to load articles</h3>
                <p className="text-slate-400">{error}</p>
              </div>
            </div>
          </ContentLayout>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
      <div className="relative">
        <ContentLayout title={config.title} description={config.description}>
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb Navigation */}
            <div className="mb-8">
              <Button variant="ghost" className="text-slate-400 hover:text-blue-400 p-0" asChild>
                <Link href="/strategic-narratives">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Strategic Narratives
                </Link>
              </Button>
            </div>

            {/* Custom Content */}
            {children}

            {/* Articles List */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <div
                  key={article.slug}
                  className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 hover:border-blue-500/50 transition-colors"
                >
                  <h3 className="text-xl font-semibold text-slate-200 mb-2">{article.title}</h3>
                  <p className="text-slate-400 mb-4">{article.description}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{article.date}</span>
                    <span>{article.readingTime} min read</span>
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`${config.baseUrl}/${article.slug}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {articles.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-slate-400">No articles found.</div>
              </div>
            )}
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
