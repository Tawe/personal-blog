"use client"

import { useState, useEffect } from "react"
import { ContentLayout } from "@/components/content-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Code, Dice6, Crown } from "lucide-react"
import Link from "next/link"

interface CategoryData {
  title: string
  description: string
  href: string
  icon: any
  color: string
  count: number
  featured: string[]
}

export default function StrategicNarrativesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from all content APIs
        const [leadership, technical, artumin, dnd] = await Promise.all([
          fetch("/api/content/leadership").then((r) => r.json()),
          fetch("/api/content/technical").then((r) => r.json()),
          fetch("/api/content/artumin").then((r) => r.json()),
          fetch("/api/content/dnd").then((r) => r.json()),
        ])

        const categoriesData: CategoryData[] = [
          {
            title: "Leadership & Strategy",
            description:
              "Insights on building teams, driving innovation, and leading through complexity in technical organizations.",
            href: "/strategic-narratives/leadership-strategy",
            icon: BookOpen,
            color: "green",
            count: leadership.articles?.length || 0,
            featured: leadership.articles?.slice(0, 3).map((a: any) => a.title) || [],
          },
          {
            title: "Technical Architecture",
            description:
              "Deep dives into system design, scalability patterns, and technology decisions that shape modern software.",
            href: "/strategic-narratives/technical-architecture",
            icon: Code,
            color: "blue",
            count: technical.articles?.length || 0,
            featured: technical.articles?.slice(0, 3).map((a: any) => a.title) || [],
          },
          {
            title: "World of Artumin",
            description:
              "Reflective fantasy and leadership fables exploring worth, power, and the quiet courage it takes to change.",
            href: "/strategic-narratives/world-of-artumin",
            icon: Crown,
            color: "purple",
            count: artumin.articles?.length || 0,
            featured: artumin.articles?.slice(0, 3).map((a: any) => a.title) || [],
          },
          {
            title: "D&D and TTRPGs",
            description:
              "Creative mechanics, homebrew content, and tabletop innovations for immersive storytelling experiences.",
            href: "/strategic-narratives/dnd-ttrpgs",
            icon: Dice6,
            color: "red",
            count: dnd.articles?.length || 0,
            featured: dnd.articles?.slice(0, 3).map((a: any) => a.title) || [],
          },
        ]

        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Set default categories with zero counts
        setCategories([
          {
            title: "Leadership & Strategy",
            description:
              "Insights on building teams, driving innovation, and leading through complexity in technical organizations.",
            href: "/strategic-narratives/leadership-strategy",
            icon: BookOpen,
            color: "green",
            count: 0,
            featured: [],
          },
          {
            title: "Technical Architecture",
            description:
              "Deep dives into system design, scalability patterns, and technology decisions that shape modern software.",
            href: "/strategic-narratives/technical-architecture",
            icon: Code,
            color: "blue",
            count: 0,
            featured: [],
          },
          {
            title: "World of Artumin",
            description:
              "Reflective fantasy and leadership fables exploring worth, power, and the quiet courage it takes to change.",
            href: "/strategic-narratives/world-of-artumin",
            icon: Crown,
            color: "purple",
            count: 0,
            featured: [],
          },
          {
            title: "D&D and TTRPGs",
            description:
              "Creative mechanics, homebrew content, and tabletop innovations for immersive storytelling experiences.",
            href: "/strategic-narratives/dnd-ttrpgs",
            icon: Dice6,
            color: "red",
            count: 0,
            featured: [],
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading content...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
      <div className="relative">
        <ContentLayout
          title="Strategic Narratives"
          description="Exploring leadership, technology, and storytelling through multiple lenses"
        >
          <div className="max-w-6xl mx-auto">
            {/* Introduction */}
            <div className="mb-16 text-center">
              <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto">
                Strategic narratives blend analytical thinking with compelling storytelling. Whether exploring technical
                architecture, leadership challenges, or fantastical worlds, these pieces examine how we build, lead, and
                create meaning in complex systems.
              </p>
            </div>

            {/* Categories Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Card
                    key={category.title}
                    className="group bg-slate-900/50 border-slate-800 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/20"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg bg-${category.color}-500/10 border border-${category.color}-500/20`}
                          >
                            <IconComponent className={`h-6 w-6 text-${category.color}-400`} />
                          </div>
                          <div>
                            <CardTitle className="text-xl text-slate-100 group-hover:text-white transition-colors">
                              {category.title}
                            </CardTitle>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {category.count} {category.count === 1 ? "article" : "articles"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-slate-400 mb-6 leading-relaxed">{category.description}</p>

                      {category.featured.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-slate-300 mb-3">Featured Articles:</h4>
                          <ul className="space-y-2">
                            {category.featured.map((title, index) => (
                              <li key={index} className="text-sm text-slate-400 flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full bg-${category.color}-400`} />
                                {title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Button
                        asChild
                        className={`w-full bg-${category.color}-600 hover:bg-${category.color}-700 text-white border-0`}
                      >
                        <Link href={category.href}>
                          Explore {category.title}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
