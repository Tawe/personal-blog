"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Lightbulb, Target, Dice6, Users, Eye } from "lucide-react"

interface Article {
  slug: string
  title: string
  date: string
  excerpt?: string
  reading_time?: number
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

        // Combine all articles and sort by date (newest first)
        const allArticles = [
          ...(leadership.articles || []).map((article: any) => ({
            ...article,
            category: "Leadership",
            categoryColor: "text-green-400",
            href: `/strategic-narratives/leadership-strategy/${article.slug}`,
            readingTime: article.reading_time || article.readingTime,
          })),
          ...(technical.articles || []).map((article: any) => ({
            ...article,
            category: "Technical",
            categoryColor: "text-blue-400",
            href: `/strategic-narratives/technical-architecture/${article.slug}`,
            readingTime: article.reading_time || article.readingTime,
          })),
          ...(artumin.articles || []).map((article: any) => ({
            ...article,
            category: "Artumin",
            categoryColor: "text-purple-400",
            href: `/strategic-narratives/world-of-artumin/${article.slug}`,
            readingTime: article.reading_time || article.readingTime,
          })),
          ...(dnd.articles || []).map((article: any) => ({
            ...article,
            category: "D&D",
            categoryColor: "text-red-400",
            href: `/strategic-narratives/dnd-ttrpgs/${article.slug}`,
            readingTime: article.reading_time || article.readingTime,
          })),
        ]

        // Sort by date (newest first) and take 3
        const sorted = allArticles.sort((a, b) => {
          const dateA = new Date(a.date).getTime()
          const dateB = new Date(b.date).getTime()
          return dateB - dateA
        })
        setAllArticles(sorted.slice(0, 3))
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
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-slate-100">
                    John Munn
                  </h1>
                  <p className="text-xl text-blue-400 font-semibold">
                    Technical Leader | Engineering Strategist | Team Builder | Dungeon Master
                  </p>
                  <p className="max-w-[600px] text-slate-300 md:text-lg leading-relaxed">
                    I architect scalable solutions and lead high-performing teams, applying the same strategic storytelling I use as a Dungeon Master. Ready to guide organizations through complex challenges with analytical precision and creative problem-solving.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600" asChild>
                    <Link href="/strategic-narratives">
                      Explore My Work
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800" asChild>
                    <Link href="/services">Schedule Mentoring</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Image
                    src="/me.jpeg"
                    width={400}
                    height={400}
                    alt="John Munn - Technical Leader & Engineering Strategist"
                    className="rounded-full object-cover aspect-square"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Areas of Expertise */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-slate-100">Areas of Expertise</h2>
                <p className="max-w-[900px] text-slate-300 md:text-xl">
                  Explore my insights across technical leadership, strategic thinking, and innovative problem-solving.
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-slate-800/50 border-slate-600 hover:border-blue-500 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="h-6 w-6 text-blue-400" />
                    <CardTitle className="text-slate-100 group-hover:text-blue-400 transition-colors">
                      Vision
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-400">
                    Strategic technology roadmaps and organizational transformation insights.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                    <Link href="/vision">
                      Explore Vision
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-600 hover:border-blue-500 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Lightbulb className="h-6 w-6 text-blue-400" />
                    <CardTitle className="text-slate-100 group-hover:text-blue-400 transition-colors">
                      Team Building
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-400">
                    Innovative approaches to team development and collaboration.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                    <Link href="/services/team-building">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-600 hover:border-blue-500 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Dice6 className="h-6 w-6 text-blue-400" />
                    <CardTitle className="text-slate-100 group-hover:text-blue-400 transition-colors">
                      Strategic Narratives
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-400">
                    Creative storytelling and strategic thinking insights.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                    <Link href="/strategic-narratives">
                      Explore Worlds
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-600 hover:border-blue-500 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-6 w-6 text-blue-400" />
                    <CardTitle className="text-slate-100 group-hover:text-blue-400 transition-colors">
                      Mentoring
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-400">
                    One-on-one guidance for technical leaders and aspiring engineering managers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                    <Link href="/services/mentoring">
                      Schedule Session
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Latest Insights */}
        {!isLoading && allArticles.length > 0 && (
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-slate-100">Latest Insights</h2>
                  <p className="max-w-[900px] text-slate-300 md:text-xl">
                    Recent thoughts on technology, leadership, and innovation.
                  </p>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allArticles.map((article) => (
                  <Card key={article.slug} className="bg-slate-800/50 border-blue-500/30 hover:border-blue-500 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-semibold ${article.categoryColor}`}>
                          {article.category}
                        </span>
                        {article.readingTime && (
                          <span className="text-xs text-slate-400">{article.readingTime} min read</span>
                        )}
                      </div>
                      <CardTitle className="text-slate-100 line-clamp-2 mb-2">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(article.excerpt || article.description) && (
                        <CardDescription className="text-slate-400 line-clamp-3 mb-4">
                          {article.excerpt || article.description}
                        </CardDescription>
                      )}
                      <div className="text-sm text-slate-400 mb-4">
                        {new Date(article.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                        <Link href={article.href}>
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
