"use client"

import { useState, useEffect } from "react"
import { ContentLayout } from "@/components/content-layout"
import { ArticlePreviewCard } from "@/components/article-preview-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dice6, Scroll, Wand2, ArrowLeft, Search, X } from "lucide-react"
import Link from "next/link"
import { getAllDndContent, getAllDndTags, getAllDndSystems, type DndContentMetadata } from "@/lib/content"

export default function DndTtrpgsPage() {
  const [allArticles, setAllArticles] = useState<DndContentMetadata[]>([])
  const [filteredArticles, setFilteredArticles] = useState<DndContentMetadata[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [allSystems, setAllSystems] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedSystems, setSelectedSystems] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const contentTypes = ["thought-piece", "mechanic", "monster", "magic-item", "npc", "adventure", "product"]

  useEffect(() => {
    try {
      const articles = getAllDndContent()
      const tags = getAllDndTags()
      const systems = getAllDndSystems()

      setAllArticles(articles)
      setFilteredArticles(articles)
      setAllTags(tags)
      setAllSystems(systems)
    } catch (error) {
      console.error("Error loading D&D content:", error)
      setAllArticles([])
      setFilteredArticles([])
      setAllTags([])
      setAllSystems([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    filterArticles(value, selectedTags, selectedSystems, selectedTypes)
  }

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    setSelectedTags(newTags)
    filterArticles(searchTerm, newTags, selectedSystems, selectedTypes)
  }

  const handleSystemToggle = (system: string) => {
    const newSystems = selectedSystems.includes(system)
      ? selectedSystems.filter((s) => s !== system)
      : [...selectedSystems, system]
    setSelectedSystems(newSystems)
    filterArticles(searchTerm, selectedTags, newSystems, selectedTypes)
  }

  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type) ? selectedTypes.filter((t) => t !== type) : [...selectedTypes, type]
    setSelectedTypes(newTypes)
    filterArticles(searchTerm, selectedTags, selectedSystems, newTypes)
  }

  const filterArticles = (search: string, tags: string[], systems: string[], types: string[]) => {
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

    // System filter
    if (systems.length > 0) {
      filtered = filtered.filter((article) => systems.includes(article.system))
    }

    // Type filter
    if (types.length > 0) {
      filtered = filtered.filter((article) => types.includes(article.type))
    }

    setFilteredArticles(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
    setSelectedSystems([])
    setSelectedTypes([])
    setFilteredArticles(allArticles)
  }

  const hasActiveFilters =
    searchTerm.trim() || selectedTags.length > 0 || selectedSystems.length > 0 || selectedTypes.length > 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading D&D content...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
      <div className="relative">
        <ContentLayout>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 mb-4">D&D and TTRPGs</h1>
              <p className="text-xl text-slate-400">Creative mechanics, homebrew content, and tabletop innovations</p>
            </div>

            {/* Breadcrumb */}
            <div className="mb-8">
              <Button variant="ghost" className="text-slate-400 hover:text-red-400 p-0" asChild>
                <Link href="/strategic-narratives">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Strategic Narratives
                </Link>
              </Button>
            </div>

            {/* Introduction */}
            <div className="mb-12 text-center">
              <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto">
                Explore my collection of D&D homebrew content, game mechanics, and tabletop RPG creations. From custom
                monsters and magical items to innovative mechanics and character options, these pieces blend creative
                storytelling with balanced gameplay design. Each creation is crafted with both narrative depth and
                mechanical integrity in mind.
              </p>
            </div>

            {/* Key Focus Areas */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Dice6 className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Game Mechanics</h3>
                  <p className="text-slate-400 text-sm">
                    Innovative rules, systems, and mechanics that enhance gameplay and create new possibilities.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Wand2 className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Homebrew Content</h3>
                  <p className="text-slate-400 text-sm">
                    Custom monsters, spells, items, and character options designed for balanced and engaging play.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Scroll className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Design Philosophy</h3>
                  <p className="text-slate-400 text-sm">
                    Thoughtful analysis of game design principles and the craft of creating memorable experiences.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filter Component */}
            {allArticles.length > 0 && (
              <div className="space-y-6 mb-8 p-6 bg-gradient-to-r from-slate-800/30 to-red-900/20 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-5 w-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-slate-100">Filter Content</h3>
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
                    placeholder="Search content, mechanics, or concepts..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-red-500"
                  />
                </div>

                {/* Content Types */}
                {contentTypes.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-300">Content Type</h4>
                    <div className="flex flex-wrap gap-2">
                      {contentTypes.map((type) => (
                        <Badge
                          key={type}
                          variant={selectedTypes.includes(type) ? "default" : "secondary"}
                          className={`cursor-pointer transition-colors text-xs ${
                            selectedTypes.includes(type)
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                          }`}
                          onClick={() => handleTypeToggle(type)}
                        >
                          {type.replace("-", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Game Systems */}
                {allSystems.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-300">Game System</h4>
                    <div className="flex flex-wrap gap-2">
                      {allSystems.map((system) => (
                        <Badge
                          key={system}
                          variant={selectedSystems.includes(system) ? "default" : "secondary"}
                          className={`cursor-pointer transition-colors text-xs ${
                            selectedSystems.includes(system)
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                          }`}
                          onClick={() => handleSystemToggle(system)}
                        >
                          {system}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {allTags.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-300">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "secondary"}
                          className={`cursor-pointer transition-colors text-xs ${
                            selectedTags.includes(tag)
                              ? "bg-red-600 hover:bg-red-700 text-white"
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
                  Showing {filteredArticles.length} of {allArticles.length} pieces
                  {hasActiveFilters && (
                    <span className="ml-2">
                      • Filtered by: {searchTerm && `"${searchTerm}"`}{" "}
                      {selectedTypes.length > 0 && selectedTypes.join(", ")}{" "}
                      {selectedSystems.length > 0 && selectedSystems.join(", ")}{" "}
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
                  <ArticlePreviewCard key={article.slug} article={article} section="strategic-narratives/dnd-ttrpgs" />
                ))}
              </div>
            ) : allArticles.length === 0 ? (
              <div className="text-center py-12">
                <Dice6 className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No content available</h3>
                <p className="text-slate-400">D&D and TTRPG content will appear here once published.</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Dice6 className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No content found</h3>
                <p className="text-slate-400">
                  Try adjusting your search terms or clearing the filters to see more content.
                </p>
              </div>
            )}
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
