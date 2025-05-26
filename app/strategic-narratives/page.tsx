"use client"
import { ContentLayout } from "@/components/content-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Users,
  Network,
  Scroll,
  Dice6,
  ArrowRight,
  BookOpen,
  Lightbulb,
  ExternalLink,
  Clock,
  TrendingUp,
} from "lucide-react"

import { getAllArticles, getAllTechnicalArticles, getAllArtumiContent, getAllDndContent } from "@/lib/content"

// Get recent articles from all content sources
const allArticles = [
  ...getAllArticles().map((article) => ({
    title: article.title,
    category: "Leadership & Strategy",
    type: "internal" as const,
    date: article.date,
    excerpt: article.excerpt,
    readTime: article.readingTime,
    slug: `/strategic-narratives/leadership-strategy/${article.slug}`,
    categoryColor: "green" as const,
  })),
  ...getAllTechnicalArticles().map((article) => ({
    title: article.title,
    category: "Technical Architecture",
    type: "internal" as const,
    date: article.date,
    excerpt: article.excerpt,
    readTime: article.readingTime,
    slug: `/strategic-narratives/technical-architecture/${article.slug}`,
    categoryColor: "blue" as const,
  })),
  ...getAllArtumiContent().map((article) => ({
    title: article.title,
    category: "World of Artumin",
    type: "internal" as const,
    date: article.date,
    excerpt: article.excerpt,
    readTime: article.readingTime,
    slug: `/strategic-narratives/world-of-artumin/${article.slug}`,
    categoryColor: "purple" as const,
  })),
  ...getAllDndContent().map((article) => ({
    title: article.title,
    category: "D&D and TTRPGs",
    type: "internal" as const,
    date: article.date,
    excerpt: article.excerpt,
    readTime: article.readingTime,
    slug: `/strategic-narratives/dnd-ttrpgs/${article.slug}`,
    categoryColor: "red" as const,
  })),
]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 4)

const recentActivity = allArticles

const categories = [
  {
    title: "Leadership & Strategy",
    description: "Insights on building teams, driving innovation, and leading through complexity",
    icon: Users,
    color: "green",
    type: "internal",
    slug: "/strategic-narratives/leadership-strategy",
    features: [
      "Team building frameworks",
      "Strategic decision-making",
      "Organizational transformation",
      "Executive communication",
    ],
    contentCount: getAllArticles().length,
    recentUpdate: "2 days ago",
  },
  {
    title: "Technical Architecture",
    description: "Deep-dives into system design, scalability, and technology decisions",
    icon: Network,
    color: "blue",
    type: "internal",
    slug: "/strategic-narratives/technical-architecture",
    features: ["Architecture patterns", "Performance optimization", "Technology strategy", "Best practices"],
    contentCount: getAllTechnicalArticles().length,
    recentUpdate: "1 week ago",
  },
  {
    title: "World of Artumin",
    description:
      "Reflective fantasy and leadership fables exploring worth, power, and the quiet courage it takes to change",
    icon: Scroll,
    color: "purple",
    type: "internal",
    slug: "/strategic-narratives/world-of-artumin",
    features: ["Leadership fables", "Fantasy storytelling", "Reflective narratives", "Truth told sideways"],
    contentCount: getAllArtumiContent().length,
    recentUpdate: "9 days ago",
  },
  {
    title: "Game Design & Systems",
    description: "Creating mechanics, adventures, and tools for tabletop gaming",
    icon: Dice6,
    color: "red",
    type: "internal",
    slug: "/strategic-narratives/dnd-ttrpgs",
    features: ["Homebrew content", "Game mechanics", "Adventure design", "System analysis"],
    contentCount: getAllDndContent().length,
    recentUpdate: "5 days ago",
  },
]

const colorMap = {
  green: "border-green-500/50 hover:border-green-400 bg-green-900/10",
  blue: "border-blue-500/50 hover:border-blue-400 bg-blue-900/10",
  purple: "border-purple-500/50 hover:border-purple-400 bg-purple-900/10",
  red: "border-red-500/50 hover:border-red-400 bg-red-900/10",
}

const iconColorMap = {
  green: "text-green-400",
  blue: "text-blue-400",
  purple: "text-purple-400",
  red: "text-red-400",
}

const badgeColorMap = {
  green: "bg-green-900/30 text-green-400 border-green-500/30",
  blue: "bg-blue-900/30 text-blue-400 border-blue-500/30",
  purple: "bg-purple-900/30 text-purple-400 border-purple-500/30",
  red: "bg-red-900/30 text-red-400 border-red-500/30",
}

export default function StrategicNarrativesPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
      <div className="relative">
        <ContentLayout title="Strategic Narratives" description="Where technical strategy meets creative storytelling">
          <div className="max-w-7xl mx-auto">
            {/* Introduction */}
            <div className="mb-16 text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-xl"></div>
                <BookOpen className="relative h-12 w-12 text-blue-400 mx-auto" />
              </div>
              <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto mb-8">
                Exploring complex challenges through multiple lenses - from system architecture to fantasy worlds, each
                narrative shapes how we solve problems and lead teams. These interconnected works demonstrate strategic
                thinking across technical, creative, and leadership domains.
              </p>
            </div>

            {/* Content Philosophy */}
            <div className="mb-16 bg-slate-900/30 p-8 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="h-6 w-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-slate-100">Why Narratives Matter in Leadership</h2>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                Every technical decision tells a story. Every team interaction follows a narrative arc. Every system
                architecture reflects the values and constraints of its creators. By understanding the narrative
                structures that underlie both technical and creative work, we can communicate more effectively, solve
                problems more creatively, and lead with greater impact.
              </p>
              <p className="text-slate-400 text-sm">
                These content categories represent different applications of the same core competencies: strategic
                thinking, systems design, creative problem-solving, and clear communication across diverse audiences.
              </p>
            </div>

            {/* Content Categories */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-100 mb-8 text-center">Explore the Narratives</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {categories.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <Card
                      key={category.title}
                      className={`${colorMap[category.color as keyof typeof colorMap]} border-2 transition-all duration-300 hover:scale-[1.02] group`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <IconComponent
                              className={`h-8 w-8 ${iconColorMap[category.color as keyof typeof iconColorMap]}`}
                            />
                            <div>
                              <CardTitle className="text-slate-100 text-xl group-hover:text-blue-300 transition-colors">
                                {category.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className={badgeColorMap[category.color as keyof typeof badgeColorMap]}
                                >
                                  {category.contentCount} pieces
                                </Badge>
                                <span className="text-xs text-slate-500">Updated {category.recentUpdate}</span>
                              </div>
                            </div>
                          </div>
                          {category.type === "external" && <ExternalLink className="h-5 w-5 text-slate-400" />}
                        </div>
                        <CardDescription className="text-slate-400 leading-relaxed">
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            {category.features.map((feature) => (
                              <div key={feature} className="text-sm text-slate-300 flex items-center gap-1">
                                <div
                                  className={`w-1.5 h-1.5 rounded-full ${iconColorMap[category.color as keyof typeof iconColorMap].replace("text-", "bg-")}`}
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
                            <Link href={category.slug} target={category.type === "external" ? "_blank" : "_self"}>
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
            </div>

            {/* Connecting Themes */}
            <div className="mb-16 bg-gradient-to-r from-slate-900/50 to-slate-800/30 p-8 rounded-xl border border-slate-600">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-slate-100">The Thread That Connects</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Network className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2">Systems Thinking</h3>
                  <p className="text-sm text-slate-400">
                    Understanding complex interactions across technical and narrative domains
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2">Strategic Communication</h3>
                  <p className="text-sm text-slate-400">
                    Adapting message and medium for different audiences and contexts
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2">Creative Problem-Solving</h3>
                  <p className="text-sm text-slate-400">
                    Applying narrative and design thinking to technical challenges
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-6 w-6 text-red-400" />
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2">Knowledge Synthesis</h3>
                  <p className="text-sm text-slate-400">
                    Connecting insights across disciplines for innovative solutions
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Clock className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-slate-100">Latest Across All Narratives</h2>
              </div>
              {recentActivity.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {recentActivity.map((item, index) => (
                    <Card
                      key={index}
                      className="bg-slate-800/50 border-slate-600 hover:border-blue-500/50 transition-all duration-300"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant="outline"
                            className={badgeColorMap[item.categoryColor as keyof typeof badgeColorMap]}
                          >
                            {item.category}
                          </Badge>
                          {item.type === "external" && <ExternalLink className="h-4 w-4 text-slate-400" />}
                        </div>
                        <CardTitle className="text-slate-100 text-lg leading-tight hover:text-blue-400 transition-colors">
                          <Link href={item.slug} target={item.type === "external" ? "_blank" : "_self"}>
                            {item.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="text-slate-400">{item.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center text-sm text-slate-500">
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                          <span>{item.readTime}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No articles available yet. Check back soon for new content!</p>
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-8 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold text-slate-100 mb-4">Explore Strategic Thinking in Action</h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Each narrative demonstrates different facets of strategic thinking and creative problem-solving. Dive
                into any category to see how these principles apply across technical and creative domains.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/strategic-narratives/leadership-strategy">
                    <Users className="mr-2 h-4 w-4" />
                    Start with Leadership
                  </Link>
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800" asChild>
                  <Link href="/contact">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Discuss These Ideas
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
