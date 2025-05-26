"use client"

import { useState, useEffect } from "react"
import { ContentLayout } from "@/components/content-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Cloud, Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { TechnicalArchitectureClient } from "./client"

interface TechnicalArticleMetadata {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags: string[]
  featured_image?: string
  reading_time?: number
  draft?: boolean
  updated?: string
  difficulty: "beginner" | "intermediate" | "advanced"
  type: "tutorial" | "guide" | "analysis" | "documentation"
  code_languages?: string[]
  recently_updated?: boolean
}

export default function TechnicalArchitecturePage() {
  const [articles, setArticles] = useState<TechnicalArticleMetadata[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/content/technical")
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
        <div className="text-slate-400">Loading technical articles...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
      <div className="relative">
        <ContentLayout
          title="Technical Architecture"
          description="Deep dives into system design, scalability, and technology decisions"
        >
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
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
                Technical communication is about translating complex concepts into actionable insights. These articles
                focus on practical solutions, architectural patterns, and best practices drawn from real-world
                experience building and scaling software systems.
              </p>
            </div>

            {/* Technical Focus Areas */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Code className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Architecture & Design</h3>
                  <p className="text-slate-400 text-sm">
                    System design patterns, microservices, and scalable architecture principles.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Performance & Optimization</h3>
                  <p className="text-slate-400 text-sm">
                    Strategies for building fast, efficient applications that scale under load.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Cloud className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Cloud & DevOps</h3>
                  <p className="text-slate-400 text-sm">
                    Modern deployment strategies, containerization, and cloud-native development.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Client Component for Interactive Features */}
            <TechnicalArchitectureClient articles={articles} tags={tags} />
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
