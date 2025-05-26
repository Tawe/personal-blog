"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import { ArticleClientPage } from "./ArticleClientPage"

interface Article {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  tags: string[]
  featured_image?: string
  reading_time: number
  difficulty: string
  type: string
  code_languages?: string[]
  updated?: string
}

export default function TechnicalArchitectureArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchArticle() {
      try {
        const slug = decodeURIComponent(params.slug as string)
        const response = await fetch(`/api/content/technical/${slug}`)

        if (!response.ok) {
          setError(true)
          return
        }

        const data = await response.json()
        setArticle(data.article)
      } catch (err) {
        console.error("Error fetching article:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchArticle()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    notFound()
  }

  return <ArticleClientPage article={article} />
}
