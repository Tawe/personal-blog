"use client"

import { useState, useEffect } from "react"
import { DndTtrpgsClient } from "./client"
import { ContentLayout } from "@/components/content-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface DndContentMetadata {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags: string[]
  reading_time?: number
  type: "thought-piece" | "mechanic" | "monster" | "magic-item" | "npc" | "adventure" | "product"
  system: "5e" | "pathfinder" | "system-agnostic"
  availability: "free" | "premium" | "commercial"
  external_url?: string
  playtested?: boolean
}

export default function DndTtrpgsPage() {
  const [articles, setArticles] = useState<DndContentMetadata[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [systems, setSystems] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/content/dnd")
        const data = await response.json()
        setArticles(data.articles || [])
        setTags(data.tags || [])
        setSystems(data.systems || [])
      } catch (error) {
        console.error("Error fetching D&D content:", error)
        setArticles([])
        setTags([])
        setSystems([])
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
          title="D&D and TTRPGs"
          description="Creative mechanics, homebrew content, and tabletop innovations"
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

            <DndTtrpgsClient articles={articles} tags={tags} systems={systems} />
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
