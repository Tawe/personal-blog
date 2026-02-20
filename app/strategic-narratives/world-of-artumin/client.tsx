"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Search, X, Crown } from "lucide-react"
import Link from "next/link"
import { DateText } from "@/components/date-text"
import { getDateTimestamp } from "@/lib/date-utils"

interface ArtumiContentMetadata {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags: string[]
  reading_time?: number
  type: "story" | "lore" | "character" | "location" | "history" | "organization"
  categories: string[]
  region?: string
  status: "complete" | "in-progress" | "planned"
  image?: string
  featured_image?: string
}

interface WorldOfArtuminClientProps {
  articles: ArtumiContentMetadata[]
  availableTags: string[]
}

export function WorldOfArtuminClient({ articles, availableTags }: WorldOfArtuminClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAllTopics, setShowAllTopics] = useState(false)
  const TOPICS_LIMIT = 20

  const filteredArticles = useMemo(() => {
    return articles
      .filter((article) => {
        const matchesSearch =
          searchTerm.trim() === "" ||
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.region?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.every((tag) => article.tags.includes(tag) || article.categories.includes(tag))

        return matchesSearch && matchesTags
      })
      .sort((a, b) => getDateTimestamp(b.date) - getDateTimestamp(a.date))
  }, [articles, searchTerm, selectedTags])

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
  }

  const hasActiveFilters = searchTerm.trim() !== "" || selectedTags.length > 0

  // No emoji icons on cards

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-[#5F8F7A] text-white"
      case "in-progress":
        return "bg-[#B89B7A] text-white"
      case "planned":
        return "bg-text-muted text-white"
      default:
        return "bg-text-muted text-white"
    }
  }

  return (
    <div className="space-y-8">
      {/* Filter Section */}
      <div className="bg-bg-paper p-6 rounded-xl border border-border-subtle shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-accent-secondary" />
            <h3 className="text-lg font-semibold text-text-strong">Explore Artumin</h3>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-text-muted hover:text-text-strong">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          <Input
            type="text"
            placeholder="Search the realm for stories, characters, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 min-h-[44px] rounded-lg border border-border-subtle bg-bg-paper text-text-body placeholder:text-text-muted text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary touch-manipulation"
            aria-label="Search articles"
          />
        </div>

        {/* Tags */}
        {availableTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.16em] text-accent-secondary">Realm Index</p>
            <h4 className="text-sm font-medium text-text-body">Categories & Themes</h4>
            <div className="flex flex-wrap gap-2">
              {(showAllTopics ? availableTags : availableTags.slice(0, TOPICS_LIMIT)).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full"
                >
                  <Badge
                    variant={selectedTags.includes(tag) ? "default" : "secondary"}
                    className={`cursor-pointer transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-accent-primary hover:bg-accent-primary-hover text-white"
                        : "bg-bg-soft text-text-body hover:bg-accent-secondary/15"
                    }`}
                  >
                    {tag}
                  </Badge>
                </button>
              ))}
            </div>
            {availableTags.length > TOPICS_LIMIT && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllTopics(!showAllTopics)}
                className="text-accent-primary hover:text-accent-primary-hover mt-2"
              >
                {showAllTopics ? "Show less" : `Show more (${availableTags.length - TOPICS_LIMIT} more)`}
              </Button>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="text-sm text-text-muted mt-4">
          Showing {filteredArticles.length} of {articles.length} pieces
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Card
            key={article.slug}
            className="relative bg-transparent border-border-subtle hover:border-accent-secondary/40 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md group"
          >
            <Link
              href={`/strategic-narratives/world-of-artumin/${article.slug}`}
              aria-label={`Read ${article.title}`}
              className="absolute inset-0 z-10 rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40 focus-visible:ring-offset-2"
            />
            {article.image && (
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt=""
                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
            <CardHeader>
              {article.featured_image && (
                <div className="aspect-video w-full overflow-hidden mb-4 rounded-lg">
                  <img
                    src={article.featured_image || "/placeholder.svg"}
                    alt=""
                    className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              {!article.featured_image && (
                <div className="aspect-video w-full overflow-hidden mb-4 rounded-lg">
                  <img
                    src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(article.title)}`}
                    alt=""
                    className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-accent-secondary/40 text-accent-secondary text-xs">
                  {article.type}
                </Badge>
                {article.status && (
                  <Badge className={`${getStatusColor(article.status)} text-xs`}>{article.status}</Badge>
                )}
              </div>
              <CardTitle className="text-text-strong text-lg leading-tight">
                <span className="group-hover:text-accent-secondary transition-colors">{article.title}</span>
              </CardTitle>
              <CardDescription className="text-text-body">{article.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-text-muted mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <DateText value={article.date} />
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>{article.reading_time} min</span>
                </div>
              </div>

              {article.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {article.categories.slice(0, 3).map((category) => (
                    <Badge key={category} variant="outline" className="text-xs border-border-subtle text-text-muted">
                      {category}
                    </Badge>
                  ))}
                  {article.categories.length > 3 && (
                    <Badge variant="outline" className="text-xs border-border-subtle text-text-muted">
                      +{article.categories.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-accent-secondary/40 text-accent-secondary">
                      {tag}
                    </Badge>
                  ))}
                  {article.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs border-accent-secondary/40 text-accent-secondary">
                      +{article.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-text-body mb-2">No content found in the realm</div>
          <p className="text-sm text-text-muted">Try adjusting your search or explore different themes</p>
        </div>
      )}
    </div>
  )
}
