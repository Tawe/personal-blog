"use client"

import { useState, useEffect } from "react"
import { ContentLayout } from "@/components/content-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Crown, Sword, BookOpen } from "lucide-react"
import Link from "next/link"
import { WorldOfArtuminClient } from "./client"

interface ArtumiContentMetadata {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags: string[]
  featured_image?: string
  reading_time?: number
  draft?: boolean
  type: "story" | "lore" | "character" | "location" | "history" | "organization"
  categories: string[]
  region?: string
  status: "complete" | "in-progress" | "planned"
  connections?: string[]
}

export default function WorldOfArtuminPage() {
  const [articles, setArticles] = useState<ArtumiContentMetadata[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/content/artumin")
        const data = await response.json()
        setArticles(data.articles || [])
        setTags(data.tags || [])
      } catch (error) {
        console.error("Error fetching data:", error)
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
        <div className="text-slate-400">Loading articles...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
      <div className="relative">
        <ContentLayout>
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 mb-4">World of Artumin</h1>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Reflective fantasy and leadership fables exploring worth, power, and the quiet courage it takes to
                change
              </p>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="mb-12">
              <Button variant="ghost" className="text-slate-400 hover:text-purple-400 p-0" asChild>
                <Link href="/strategic-narratives">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Strategic Narratives
                </Link>
              </Button>
            </div>

            {/* Description Section */}
            <div className="mb-16">
              <p className="text-lg text-slate-300 text-center max-w-5xl mx-auto leading-relaxed">
                The World of Artumin weaves together fantasy storytelling with profound leadership insights, creating
                fables that explore the complexities of power, responsibility, and moral courage. These tales examine
                how individuals navigate difficult decisions, build meaningful connections, and discover their true
                worth in a world where magic and politics intertwine. Each story serves as both entertainment and
                reflection, offering timeless lessons wrapped in compelling narratives.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Crown className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-4">Leadership Fables</h3>
                <p className="text-slate-400">
                  Stories that explore the weight of command, the burden of difficult decisions, and the courage
                  required to lead with integrity.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Sword className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-4">Character Studies</h3>
                <p className="text-slate-400">
                  Deep explorations of individuals facing moral complexity, personal growth, and the challenge of
                  staying true to their values.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-4">World Building</h3>
                <p className="text-slate-400">
                  Rich explorations of Artumin's cultures, politics, and magical systems that create the backdrop for
                  meaningful storytelling.
                </p>
              </div>
            </div>

            {/* Client Component for Interactive Features */}
            <WorldOfArtuminClient articles={articles} availableTags={tags} />
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
