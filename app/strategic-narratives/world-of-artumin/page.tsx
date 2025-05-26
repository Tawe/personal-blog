"use client"

import { useState, useEffect } from "react"
import { WorldOfArtuminClient } from "./client"
import { ContentLayout } from "@/components/content-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ArtumiContentMetadata {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags: string[]
  reading_time?: number
  type: "story" | "lore" | "character" | "location" | "history" | "organization"
  categories: string[]
  region?: string
  status: "complete" | "in-progress" | "planned"
}

export default function WorldOfArtuminPage() {
  const [articles, setArticles] = useState<ArtumiContentMetadata[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/content/artumin")
        const data = await response.json()
        setArticles(data.articles || [])
        setAvailableTags(data.tags || [])
      } catch (error) {
        console.error("Error fetching artumin content:", error)
        setArticles([])
        setAvailableTags([])
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
          title="World of Artumin"
          description="Reflective fantasy and leadership fables exploring worth, power, and courage"
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

            <WorldOfArtuminClient articles={articles} availableTags={availableTags} />
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
