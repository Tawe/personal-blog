"use client"

import { useState, useEffect } from "react"
import { LeadershipStrategyClient } from "./client"
import { ContentLayout } from "@/components/content-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ArticleMetadata {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags: string[]
  reading_time?: number
}

export default function LeadershipStrategyPage() {
  const [articles, setArticles] = useState<ArticleMetadata[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/content/leadership")
        const data = await response.json()
        setArticles(data.articles || [])
        setTags(data.tags || [])
      } catch (error) {
        console.error("Error fetching leadership content:", error)
        setArticles([])
        setTags([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
      <div className="relative">
        <ContentLayout
          title="Leadership & Strategy"
          description="Insights on building teams, driving innovation, and leading through complexity"
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Button variant="ghost" className="text-slate-400 hover:text-blue-400 p-0" asChild>
                <Link href="/strategic-narratives">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Strategic Narratives
                </Link>
              </Button>
            </div>

            <LeadershipStrategyClient articles={articles} tags={tags} />
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
