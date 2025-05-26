"use client"

import { useState, useEffect } from "react"
import { ContentLayout } from "@/components/content-layout"
import { ArticlePreviewCard } from "@/components/article-preview-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Target, ArrowLeft, Search, X } from "lucide-react"
import Link from "next/link"
import { getAllArticles, getAllTags, type ArticleMetadata } from "@/lib/content"

export default function LeadershipStrategyPage() {
  const [allArticles, setAllArticles] = useState<ArticleMetadata[]>([])
  const [filteredArticles, setFilteredArticles] = useState<ArticleMetadata[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const articles = getAllArticles()
      const tags = getAllTags("leadership")

      setAllArticles(articles)
      setFilteredArticles(articles)
      setAllTags(tags)
    } catch (error) {
      console.error("Error loading articles:", error)
      setAllArticles([])
      setFilteredArticles([])
      setAllTags([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    filterArticles(value, selectedTags)
  }

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    setSelectedTags(newTags)
    filterArticles(searchTerm, newTags)
  }

  const filterArticles = (search: string, tags: string[]) => {
    let filtered = [...allArticles]

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((article) => {
        const titleMatch = article.title?.toLowerCase().includes(searchLower) || false
        const excerptMatch = article.excerpt?.toLowerCase().includes(searchLower) || false
        const tagMatch = (article.tags || []).some((tag) => tag.toLowerCase().includes(searchLower))
        return titleMatch || excerptMatch || tagMatch
      })
    }

    // Tag filter
    if (tags.length > 0) {
      filtered = filtered.filter((article) => tags.every((tag) => (article.tags || []).includes(tag)))
    }

    setFilteredArticles(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
    setFilteredArticles(allArticles)
  }

  const hasActiveFilters = searchTerm.trim() || selectedTags.length > 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading articles...</div>
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

            {/* Filter Component */}
            {allArticles.length > 0 && (
              <div className="space-y-6 mb-8 p-6 bg-gradient-to-r from-slate-800/30 to-blue-900/20 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-slate-100">Filter Articles</h3>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-slate-400 hover:text-slate-200 ml-auto"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search articles, topics, or concepts..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500"
                  />
                </div>

                {/* Tags */}
                {allTags.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-300">Topics & Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "secondary"}
                          className={`cursor-pointer transition-colors text-xs ${
                            selectedTags.includes(tag)
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                          }`}
                          onClick={() => handleTagToggle(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Results count */}
                <div className="text-sm text-slate-400">
                  Showing {filteredArticles.length} of {allArticles.length} articles
                  {hasActiveFilters && (
                    <span className="ml-2">
                      • Filtered by: {searchTerm && `"${searchTerm}"`}{" "}
                      {selectedTags.length > 0 && selectedTags.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            )}

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
            ) : allArticles.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No articles available</h3>
                <p className="text-slate-400">Leadership articles will appear here once they are published.</p>
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
