"use client"

import { useState } from "react"
import { ContentLayout } from "@/components/content-layout"
import { ArticlePreviewCard } from "@/components/article-preview-card"
import { ContentFilter } from "@/components/content-filter"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Target, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { ArticleMetadata } from "@/lib/content"

// Sample articles data - in production, this would come from getAllArticles('leadership-strategy')
const sampleArticles: ArticleMetadata[] = [
  {
    slug: "technical-decision-making",
    title: "The Art of Technical Decision Making",
    date: "2024-03-10",
    excerpt:
      "How to balance technical debt, innovation, and business objectives in complex engineering decisions. A framework for making choices that serve both immediate needs and long-term vision.",
    tags: ["Leadership", "Decision Making", "Strategy", "Technical Debt"],
    reading_time: 7,
    featured_image: "/placeholder.svg?height=200&width=400",
  },
  {
    slug: "high-performance-teams",
    title: "Building High-Performance Engineering Teams",
    date: "2024-03-03",
    excerpt:
      "Strategies for recruiting, developing, and retaining top engineering talent in competitive markets. Creating environments where technical excellence thrives.",
    tags: ["Team Building", "Hiring", "Culture", "Performance"],
    reading_time: 12,
    featured_image: "/placeholder.svg?height=200&width=400",
  },
  {
    slug: "technical-transformation",
    title: "Leading Through Technical Transformation",
    date: "2024-02-25",
    excerpt:
      "Navigating organizational change when modernizing legacy systems and adopting new technologies. Managing risk while driving innovation.",
    tags: ["Change Management", "Legacy Systems", "Modernization", "Risk"],
    reading_time: 10,
    featured_image: "/placeholder.svg?height=200&width=400",
  },
  {
    slug: "stakeholder-communication",
    title: "The CTO's Guide to Stakeholder Communication",
    date: "2024-02-18",
    excerpt:
      "Translating technical complexity into business value for executives, investors, and cross-functional teams. Building bridges between technology and business.",
    tags: ["Communication", "Business Value", "Stakeholders", "Leadership"],
    reading_time: 8,
    featured_image: "/placeholder.svg?height=200&width=400",
  },
  {
    slug: "remote-engineering-culture",
    title: "Engineering Culture and Remote Teams",
    date: "2024-02-10",
    excerpt:
      "Building strong engineering culture and maintaining team cohesion in distributed work environments. Lessons from leading remote-first organizations.",
    tags: ["Culture", "Remote Work", "Team Dynamics", "Collaboration"],
    reading_time: 9,
    featured_image: "/placeholder.svg?height=200&width=400",
  },
  {
    slug: "innovation-execution-balance",
    title: "Innovation vs. Execution: Finding the Balance",
    date: "2024-02-02",
    excerpt:
      "How to foster innovation while maintaining delivery commitments and operational excellence. Creating space for experimentation without sacrificing reliability.",
    tags: ["Innovation", "Execution", "Strategy", "Balance"],
    reading_time: 11,
    featured_image: "/placeholder.svg?height=200&width=400",
  },
]

const allTags = Array.from(new Set(sampleArticles.flatMap((article) => article.tags || []))).sort()

export default function LeadershipStrategyPage() {
  const [filteredArticles, setFilteredArticles] = useState<ArticleMetadata[]>(sampleArticles)

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
      <div className="relative">
        <ContentLayout
          title="Leadership & Strategy"
          description="Insights on building teams, driving innovation, and leading through complexity"
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

            {/* Content Filter */}
            <ContentFilter articles={sampleArticles} allTags={allTags} onFilterChange={setFilteredArticles} />

            {/* Articles Grid */}
            {filteredArticles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <ArticlePreviewCard
                    key={article.slug}
                    article={article}
                    section="strategic-narratives/leadership-strategy"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No articles found</h3>
                <p className="text-slate-400">
                  Try adjusting your search terms or clearing the filters to see more articles.
                </p>
              </div>
            )}
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
