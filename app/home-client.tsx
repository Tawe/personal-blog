"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Lightbulb, Target, Dice6, Users } from "lucide-react"

interface Article {
  slug: string
  title: string
  date: string
  excerpt?: string
  readingTime?: number
  category: string
  categoryColor: string
  href: string
}

export default function HomePageClient() {
  const [allArticles, setAllArticles] = useState<Article[]>([])
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

        // Combine all articles and randomly select 3 for variety
        const allArticles = [
          ...(leadership.articles || []).map((article: any) => ({
            ...article,
            category: "Leadership",
            categoryColor: "text-green-400",
            href: `/strategic-narratives/leadership-strategy/${article.slug}`,
          })),
          ...(technical.articles || []).map((article: any) => ({
            ...article,
            category: "Technical",
            categoryColor: "text-blue-400",
            href: `/strategic-narratives/technical-architecture/${article.slug}`,
          })),
          ...(artumin.articles || []).map((article: any) => ({
            ...article,
            category: "Artumin",
            categoryColor: "text-purple-400",
            href: `/strategic-narratives/world-of-artumin/${article.slug}`,
          })),
          ...(dnd.articles || []).map((article: any) => ({
            ...article,
            category: "D&D",
            categoryColor: "text-red-400",
            href: `/strategic-narratives/dnd-ttrpgs/${article.slug}`,
          })),
        ]

        // Shuffle and take 3
        const shuffled = allArticles.sort(() => Math.random() - 0.5)
        setAllArticles(shuffled.slice(0, 3))
      } catch (error) {
        console.error("Error fetching articles:", error)
        setAllArticles([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  John Munn
                </h1>
                <p className="text-xl text-primary font-semibold">
                  Technical Leader & Engineering Strategist
                </p>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Building teams, systems, and stories at the intersection of technology and leadership.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        {!isLoading && allArticles.length > 0 && (
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Recent Writing</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl">
                    Latest insights on leadership, technology, and strategy
                  </p>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allArticles.map((article) => (
                  <Card key={article.slug} className="bg-slate-800/50 border-slate-600 hover:border-blue-500 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-semibold ${article.categoryColor}`}>
                          {article.category}
                        </span>
                        {article.readingTime && (
                          <span className="text-xs text-slate-400">{article.readingTime} min read</span>
                        )}
                      </div>
                      <CardTitle className="text-slate-100 line-clamp-2">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {article.excerpt && (
                        <CardDescription className="text-slate-400 line-clamp-3 mb-4">
                          {article.excerpt}
                        </CardDescription>
                      )}
                      <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                        <Link href={article.href}>
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Services Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Explore</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Discover my work across leadership, services, and projects
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Dice6 className="h-6 w-6 text-blue-400" />
                    <CardTitle className="text-slate-100 group-hover:text-blue-400 transition-colors">
                      Strategic Narratives
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-400">
                    Creative storytelling and strategic thinking insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                    <Link href="/strategic-narratives">
                      Explore Worlds <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-6 w-6 text-blue-400" />
                    <CardTitle className="text-slate-100 group-hover:text-blue-400 transition-colors">
                      Services
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-400">
                    D&D Team Building and Technical Leadership Mentoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                    <Link href="/services">
                      Explore Services <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Lightbulb className="h-6 w-6 text-blue-400" />
                    <CardTitle className="text-slate-100 group-hover:text-blue-400 transition-colors">
                      Workbench
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-400">
                    Technical projects, builds, and experimental work
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                    <Link href="/workbench">
                      View Projects <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
