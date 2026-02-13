"use client"

import { useState, useEffect } from "react"
import { ContentLayout } from "@/components/content-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Code, Crown, Dice6, ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatDisplayDate } from "@/lib/date-utils"

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
      icon: BookOpen,
      href: "/strategic-narratives/leadership-strategy",
      color: "green",
      stats: categoryData.leadership,
      features: [
        "Team building frameworks",
        "Strategic decision-making",
        "Organizational transformation",
        "Executive communication",
      ],
    },
    {
      title: "Technical Architecture",
      description: "Deep dives into system design, scalability, and technology decisions",
      icon: Code,
      href: "/strategic-narratives/technical-architecture",
      color: "blue",
      stats: categoryData.technical,
      features: ["Architecture patterns", "Performance optimization", "Technology strategy", "Best practices"],
    },
    {
      title: "World of Artumin",
      description: "Reflective fantasy and leadership fables exploring worth, power, and courage",
      icon: Crown,
      href: "/strategic-narratives/world-of-artumin",
      color: "purple",
      stats: categoryData.artumin,
      features: ["Leadership fables", "Fantasy storytelling", "Reflective narratives", "Truth told sideways"],
    },
    {
      title: "D&D and TTRPGs",
      description: "Creative mechanics, homebrew content, and tabletop innovations",
      icon: Dice6,
      href: "/strategic-narratives/dnd-ttrpgs",
      color: "red",
      stats: categoryData.dnd,
      features: ["Homebrew content", "Game mechanics", "Adventure design", "System analysis"],
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
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Card
                    key={category.title}
                    className={`${
                      category.color === "green"
                        ? "border-green-500/50 hover:border-green-400 bg-green-900/10"
                        : category.color === "blue"
                          ? "border-blue-500/50 hover:border-blue-400 bg-blue-900/10"
                          : category.color === "purple"
                            ? "border-purple-500/50 hover:border-purple-400 bg-purple-900/10"
                            : "border-red-500/50 hover:border-red-400 bg-red-900/10"
                    } border-2 transition-all duration-300 hover:scale-[1.02] motion-reduce:hover:scale-100 group`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <IconComponent
                            className={`h-8 w-8 ${
                              category.color === "green"
                                ? "text-green-400"
                                : category.color === "blue"
                                  ? "text-blue-400"
                                  : category.color === "purple"
                                    ? "text-purple-400"
                                    : "text-red-400"
                            }`}
                          />
                          <div>
                            <CardTitle className="text-slate-100 text-xl group-hover:text-blue-300 transition-colors">
                              {category.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className={`${
                                  category.color === "green"
                                    ? "bg-green-900/30 text-green-400 border-green-500/30"
                                    : category.color === "blue"
                                      ? "bg-blue-900/30 text-blue-400 border-blue-500/30"
                                      : category.color === "purple"
                                        ? "bg-purple-900/30 text-purple-400 border-purple-500/30"
                                        : "bg-red-900/30 text-red-400 border-red-500/30"
                                }`}
                              >
                                {category.stats.count} pieces
                              </Badge>
                              {category.stats.lastUpdated && (
                                <span className="text-xs text-slate-500">
                                  Updated {formatDisplayDate(category.stats.lastUpdated)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-slate-400 leading-relaxed">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          {category.features?.map((feature) => (
                            <div key={feature} className="text-sm text-slate-300 flex items-center gap-1">
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  category.color === "green"
                                    ? "bg-green-400"
                                    : category.color === "blue"
                                      ? "bg-blue-400"
                                      : category.color === "purple"
                                        ? "bg-purple-400"
                                        : "bg-red-400"
                                }`}
                              ></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                        <Button
                          className={`w-full ${
                            category.color === "green"
                              ? "bg-green-600 hover:bg-green-700"
                              : category.color === "blue"
                                ? "bg-blue-600 hover:bg-blue-700"
                                : category.color === "purple"
                                  ? "bg-purple-600 hover:bg-purple-700"
                                  : "bg-red-600 hover:bg-red-700"
                          }`}
                          asChild
                        >
                          <Link href={category.href}>
                            Explore {category.title}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
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
