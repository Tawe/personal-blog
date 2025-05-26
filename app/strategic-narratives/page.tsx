"use client"

import { useState, useEffect } from "react"
import { ContentLayout } from "@/components/content-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Code, Crown, Dice6, ArrowRight } from "lucide-react"
import Link from "next/link"

interface CategoryStats {
  count: number
  lastUpdated: string
}

interface CategoryData {
  leadership: CategoryStats
  technical: CategoryStats
  artumin: CategoryStats
  dnd: CategoryStats
}

export default function StrategicNarrativesPage() {
  const [categoryData, setCategoryData] = useState<CategoryData>({
    leadership: { count: 0, lastUpdated: "" },
    technical: { count: 0, lastUpdated: "" },
    artumin: { count: 0, lastUpdated: "" },
    dnd: { count: 0, lastUpdated: "" },
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const [leadership, technical, artumin, dnd] = await Promise.all([
          fetch("/api/content/leadership")
            .then((r) => r.json())
            .catch(() => ({ articles: [] })),
          fetch("/api/content/technical")
            .then((r) => r.json())
            .catch(() => ({ articles: [] })),
          fetch("/api/content/artumin")
            .then((r) => r.json())
            .catch(() => ({ articles: [] })),
          fetch("/api/content/dnd")
            .then((r) => r.json())
            .catch(() => ({ articles: [] })),
        ])

        setCategoryData({
          leadership: {
            count: leadership.articles?.length || 0,
            lastUpdated: leadership.articles?.[0]?.date || "",
          },
          technical: {
            count: technical.articles?.length || 0,
            lastUpdated: technical.articles?.[0]?.date || "",
          },
          artumin: {
            count: artumin.articles?.length || 0,
            lastUpdated: artumin.articles?.[0]?.date || "",
          },
          dnd: {
            count: dnd.articles?.length || 0,
            lastUpdated: dnd.articles?.[0]?.date || "",
          },
        })
      } catch (error) {
        console.error("Error fetching category data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategoryData()
  }, [])

  const categories = [
    {
      title: "Leadership & Strategy",
      description: "Insights on building teams, driving innovation, and leading through complexity",
      icon: <BookOpen className="h-8 w-8 text-green-400" />,
      href: "/strategic-narratives/leadership-strategy",
      color: "green",
      stats: categoryData.leadership,
    },
    {
      title: "Technical Architecture",
      description: "Deep dives into system design, scalability, and technology decisions",
      icon: <Code className="h-8 w-8 text-blue-400" />,
      href: "/strategic-narratives/technical-architecture",
      color: "blue",
      stats: categoryData.technical,
    },
    {
      title: "World of Artumin",
      description: "Reflective fantasy and leadership fables exploring worth, power, and courage",
      icon: <Crown className="h-8 w-8 text-purple-400" />,
      href: "/strategic-narratives/world-of-artumin",
      color: "purple",
      stats: categoryData.artumin,
    },
    {
      title: "D&D and TTRPGs",
      description: "Creative mechanics, homebrew content, and tabletop innovations",
      icon: <Dice6 className="h-8 w-8 text-red-400" />,
      href: "/strategic-narratives/dnd-ttrpgs",
      color: "red",
      stats: categoryData.dnd,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
      <div className="relative">
        <ContentLayout
          title="Strategic Narratives"
          description="Where technical leadership meets creative storytelling"
        >
          <div className="max-w-6xl mx-auto">
            {/* Introduction */}
            <div className="mb-16 text-center">
              <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto">
                Strategic narratives blend analytical thinking with creative expression. Whether exploring technical
                architecture, leadership challenges, or fantastical worlds, these stories and insights reveal the
                patterns that connect complex systems, human behavior, and innovative solutions.
              </p>
            </div>

            {/* Categories Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {categories.map((category) => (
                <Card
                  key={category.title}
                  className={`bg-slate-900/50 border-slate-700 hover:border-${category.color}-500/50 transition-all duration-300 group`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-slate-800/50">{category.icon}</div>
                        <div>
                          <CardTitle
                            className={`text-slate-100 group-hover:text-${category.color}-400 transition-colors`}
                          >
                            {category.title}
                          </CardTitle>
                          <CardDescription className="text-slate-400 mt-2">{category.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {!isLoading && (
                          <>
                            <Badge variant="secondary" className="bg-slate-700/50 text-slate-300">
                              {category.stats.count} {category.stats.count === 1 ? "article" : "articles"}
                            </Badge>
                            {category.stats.lastUpdated && (
                              <span className="text-sm text-slate-500">
                                Updated {new Date(category.stats.lastUpdated).toLocaleDateString()}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        className={`text-${category.color}-400 hover:text-${category.color}-300`}
                        asChild
                      >
                        <Link href={category.href}>
                          Explore <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-16 text-center">
              <Card className="bg-slate-900/30 border-slate-700">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-100 mb-4">Ready to Explore?</h3>
                  <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
                    Each category offers unique perspectives on leadership, technology, and creative problem-solving.
                    Dive into the narratives that resonate with your interests and challenges.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href="/strategic-narratives/leadership-strategy">Start with Leadership</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="border-slate-600 text-slate-300" asChild>
                      <Link href="/contact">Discuss These Ideas</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
