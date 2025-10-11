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

export default function HomePage() {
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

        // Sort by date first, then randomly select 3 from the most recent 10
        const sortedByDate = allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        const recentArticles = sortedByDate.slice(0, Math.min(10, sortedByDate.length))
        
        // Shuffle and take 3 for variety
        const shuffled = recentArticles.sort(() => Math.random() - 0.5)
        const combined = shuffled.slice(0, 3)

        setAllArticles(combined)
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
    <div className="min-h-screen bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "John Munn",
            "url": "https://johnmunn.dev",
            "image": "https://johnmunn.dev/me.jpeg",
            "jobTitle": "Technical Leader & Engineering Strategist",
            "description": "Technical leader, engineering strategist, and team builder with expertise in scalable architecture, strategic thinking, and innovative problem-solving. Dungeon Master applying storytelling to leadership.",
            "sameAs": [
              "https://johnmunn.dev",
            ],
            "knowsAbout": [
              "Technical Leadership",
              "Engineering Strategy", 
              "Software Architecture",
              "Team Building",
              "Scalable Systems",
              "Cloud Architecture",
              "DevOps",
              "Strategic Thinking",
              "Dungeon Master",
              "Leadership Development"
            ],
            "worksFor": {
              "@type": "Organization",
              "name": "Independent Consultant"
            }
          }).replace(/</g, '\\u003c')
        }}
      />
      <div className="absolute inset-0 bg-tech-pattern opacity-30"></div>
      <div className="relative">
        <SiteHeader />

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold text-slate-100 leading-tight">John Munn</h1>
                <p className="text-xl lg:text-2xl text-blue-400 font-medium">
                  Technical Leader | Engineering Strategist | Team Builder | Dungeon Master
                </p>
                <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                  I architect scalable solutions and lead high-performing teams, applying the same strategic
                  storytelling I use as a Dungeon Master. Ready to guide organizations through complex challenges with
                  analytical precision and creative problem-solving.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link href="#featured-content">
                    Explore My Work
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  asChild
                >
                  <Link href="/mentoring">Schedule Mentoring</Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end animate-slide-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-20 scale-110"></div>
                <Image
                  src="/me.jpeg"
                  width={400}
                  height={400}
                  alt="John Munn - Technical Leader & Engineering Strategist"
                  className="relative rounded-full border-4 border-slate-700 shadow-2xl object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Content Overview */}
        <section id="featured-content" className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-100 mb-4">Areas of Expertise</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Explore my insights across technical leadership, strategic thinking, and innovative problem-solving
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-6 w-6 text-blue-400" />
                  <CardTitle className="text-slate-100 group-hover:text-blue-400 transition-colors">Vision</CardTitle>
                </div>
                <CardDescription className="text-slate-400">
                  Strategic technology roadmaps and organizational transformation insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                  <Link href="/vision">
                    Explore Vision <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb className="h-6 w-6 text-blue-400" />
                  <CardTitle className="text-slate-100 group-hover:text-blue-400 transition-colors">
                    Team Building
                  </CardTitle>
                </div>
                <CardDescription className="text-slate-400">
                  Innovative approaches to team development and collaboration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                  <Link href="/team-building">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

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
                    Mentoring
                  </CardTitle>
                </div>
                <CardDescription className="text-slate-400">
                  One-on-one guidance for technical leaders and aspiring engineering managers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                  <Link href="/mentoring">
                    Schedule Session <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent Content Preview */}
        <section className="container mx-auto px-6 py-20 bg-slate-900/30">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-100 mb-4">Latest Insights</h2>
            <p className="text-xl text-slate-400">Recent thoughts on technology, leadership, and innovation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!isLoading && allArticles.length > 0 ? (
              allArticles.map((article) => (
                <Card
                  key={article.slug}
                  className="bg-slate-800/50 border-slate-600 hover:border-blue-500/50 transition-all duration-300"
                >
                  <CardHeader>
                    <div className={`text-sm ${article.categoryColor} mb-2`}>
                      {article.category} • {article.readingTime || "5 min read"}
                    </div>
                    <CardTitle className="text-slate-100 text-xl leading-tight">{article.title}</CardTitle>
                    <CardDescription className="text-slate-400">{article.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">
                        {new Date(article.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300" asChild>
                        <Link href={article.href}>Read More</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : isLoading ? (
              <div className="col-span-full text-center text-slate-400">
                <p>Loading recent articles...</p>
              </div>
            ) : (
              <div className="col-span-full text-center text-slate-400">
                <p>No recent articles available.</p>
              </div>
            )}
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  )
}
