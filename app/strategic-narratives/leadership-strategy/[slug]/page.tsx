"use client"

import { ArticleClientPage } from "./ArticleClientPage"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        console.log("Fetching article with slug:", slug)
        const response = await fetch(`/api/content/leadership/${slug}`)
        console.log("API response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("API error:", errorText)
          throw new Error(`Failed to fetch article: ${response.status}`)
        }

        const data = await response.json()
        console.log("API response data:", data)

        if (data.article) {
          setArticle(data.article)
        } else {
          throw new Error("No article data received")
        }
      } catch (err) {
        console.error("Error fetching article:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchArticle()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Loading article...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Article not found</div>
      </div>
    )
  }

  return <ArticleClientPage article={article} />
}
