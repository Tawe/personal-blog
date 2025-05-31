"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Search, X, Crown } from "lucide-react"
import Link from "next/link"

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
}

interface WorldOfArtuminClientProps {
  articles: ArtumiContentMetadata[]
  availableTags: string[]
}

export function WorldOfArtuminClient({ articles, availableTags }: WorldOfArtuminClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
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
  }, [articles, searchTerm, selectedTags])

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
  }

  const hasActiveFilters = searchTerm.trim() !== "" || selectedTags.length > 0

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "story":
        return "📖"
      case "character":
        return "👤"
      case "location":
        return "🏰"
      case "history":
        return "📜"
      case "organization":
        return "⚔️"
      default:
        return "✨"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-600"
      case "in-progress":
        return "bg-yellow-600"
      case "planned":
        return "bg-slate-600"
      default:
        return "bg-slate-600"
    }
  }

  return (
    <div className="space-y-8">
      {/* Filter Section */}
      <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-slate-100">Explore Artumin</h3>
          </div>
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
            placeholder="Search the realm for stories, characters, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100"
          />
        </div>

        {/* Tags */}
        {availableTags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Categories & Themes</h4>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "secondary"}
                  className={`cursor-pointer transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
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
        <div className="text-sm text-slate-400 mt-4">
          Showing {filteredArticles.length} of {articles.length} pieces
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Card
            key={article.slug}
            className="bg-slate-800/50 border-slate-600 hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
          >
            {article.image && (
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
            <CardHeader>
              {article.image && (
                <div className="aspect-video w-full overflow-hidden mb-4 rounded-lg">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{getTypeIcon(article.type)}</span>
                <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                  {article.type}
                </Badge>
                <Badge className={`${getStatusColor(article.status)} text-white text-xs`}>{article.status}</Badge>
              </div>
              <CardTitle className="text-slate-100 text-lg leading-tight">
                <Link
                  href={`/strategic-narratives/world-of-artumin/${article.slug}`}
                  className="hover:text-purple-400 transition-colors"
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

              {article.region && <div className="text-sm text-slate-400 mb-3">📍 {article.region}</div>}

              {article.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {article.categories.slice(0, 3).map((category) => (
                    <Badge key={category} variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {category}
                    </Badge>
                  ))}
                  {article.categories.length > 3 && (
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                      +{article.categories.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-purple-600/30 text-purple-400">
                      {tag}
                    </Badge>
                  ))}
                  {article.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs border-purple-600/30 text-purple-400">
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
          <div className="text-slate-400 mb-2">No content found in the realm</div>
          <p className="text-sm text-slate-500">Try adjusting your search or explore different themes</p>
        </div>
      )}
    </div>
  )
}
