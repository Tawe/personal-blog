"use client"

import { useState, useEffect } from "react"
import { DndTtrpgsClient } from "./client"
import { ContentLayout } from "@/components/content-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Dice6, Scroll, Wand2 } from "lucide-react"

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

            {/* Introduction */}
            <div className="mb-12 text-center">
              <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto">
                Explore my collection of D&D homebrew content, game mechanics, and tabletop RPG creations. From custom
                monsters and magical items to innovative mechanics and character options, these pieces blend creative
                storytelling with balanced gameplay design. Each creation is crafted with both narrative depth and
                mechanical integrity in mind.
              </p>
            </div>

            {/* Key Focus Areas */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Dice6 className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Game Mechanics</h3>
                  <p className="text-slate-400 text-sm">
                    Innovative rules, systems, and mechanics that enhance gameplay and create new possibilities.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Wand2 className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Homebrew Content</h3>
                  <p className="text-slate-400 text-sm">
                    Custom monsters, spells, items, and character options designed for balanced and engaging play.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Scroll className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Design Philosophy</h3>
                  <p className="text-slate-400 text-sm">
                    Thoughtful analysis of game design principles and the craft of creating memorable experiences.
                  </p>
                </CardContent>
              </Card>
            </div>

            <DndTtrpgsClient articles={articles} tags={tags} systems={systems} />
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
