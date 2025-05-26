"use client"

import { useState, useEffect } from "react"
import { LeadershipStrategyClient } from "./client"
import { ContentLayout } from "@/components/content-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Target } from "lucide-react"

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

            {/* Introduction */}
            <div className="mb-12 text-center">
              <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto">
                Technical leadership is about more than just code and architecture—it's about building teams that can
                tackle complex challenges, fostering innovation while maintaining operational excellence, and
                translating technical possibilities into business outcomes. These insights explore the intersection of
                technology and leadership, drawing from real-world experience building and scaling engineering
                organizations.
              </p>
            </div>

            {/* Key Focus Areas */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Team Building</h3>
                  <p className="text-slate-400 text-sm">
                    Creating high-performing teams through clear communication, psychological safety, and shared vision.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Strategic Thinking</h3>
                  <p className="text-slate-400 text-sm">
                    Aligning technical decisions with business objectives and long-term organizational goals.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-8 w-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Continuous Learning</h3>
                  <p className="text-slate-400 text-sm">
                    Fostering growth mindsets and building learning organizations that adapt to change.
                  </p>
                </CardContent>
              </Card>
            </div>

            <LeadershipStrategyClient articles={articles} tags={tags} />
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
