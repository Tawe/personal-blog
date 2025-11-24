"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Search, X, Code } from "lucide-react"
import Link from "next/link"

interface TechnicalArticleMetadata {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags: string[]
  reading_time?: number
  difficulty: "beginner" | "intermediate" | "advanced"
  type: "tutorial" | "guide" | "analysis" | "documentation"
  code_languages?: string[]
  image?: string
  featured_image?: string
}

interface TechnicalArchitectureClientProps {
  articles: TechnicalArticleMetadata[]
  tags: string[]
}

export function TechnicalArchitectureClient({ articles, tags }: TechnicalArchitectureClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAllTopics, setShowAllTopics] = useState(false)
  const TOPICS_LIMIT = 20

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.code_languages?.some((lang) => lang.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => article.tags.includes(tag))

      return matchesSearch && matchesTags
    })
  }, [articles, searchTerm, selectedTags])

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
  }

  const hasActiveFilters =
    searchTerm.trim() !== "" || selectedTags.length > 0

  return (
    <div className="space-y-8">
      {/* Filter Section */}
      <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Filter Technical Articles</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-400">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search articles, technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100"
          />
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Technologies & Topics</h4>
            <div className="flex flex-wrap gap-2">
              {(showAllTopics ? tags : tags.slice(0, TOPICS_LIMIT)).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "secondary"}
                  className={`cursor-pointer transition-colors ${
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
            {tags.length > TOPICS_LIMIT && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllTopics(!showAllTopics)}
                className="text-slate-400 hover:text-slate-200 mt-2"
              >
                {showAllTopics ? "Show less" : `Show more (${tags.length - TOPICS_LIMIT} more)`}
              </Button>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="text-sm text-slate-400 mt-4">
          Showing {filteredArticles.length} of {articles.length} articles
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Card
            key={article.slug}
            className="bg-slate-800/50 border-slate-600 hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={article.featured_image ? article.featured_image : "/placeholder.svg"}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-slate-100 text-lg leading-tight">
                <Link
                  href={`/strategic-narratives/technical-architecture/${article.slug}`}
                  className="hover:text-blue-400 transition-colors"
                >
                  {article.title}
                </Link>
              </CardTitle>
              <CardDescription className="text-slate-400">{article.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>{article.reading_time} min</span>
                </div>
              </div>

              {article.code_languages && article.code_languages.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <Code className="h-3 w-3 text-slate-400" />
                  <div className="flex flex-wrap gap-1">
                    {article.code_languages.slice(0, 3).map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs border-slate-600 text-slate-400">
                        {lang}
                      </Badge>
                    ))}
                    {article.code_languages.length > 3 && (
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                        +{article.code_languages.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {tag}
                    </Badge>
                  ))}
                  {article.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
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
          <div className="text-slate-400 mb-2">No articles found</div>
          <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
