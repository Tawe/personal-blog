"use client"

import { useState, useEffect } from "react"
import { ContentLayout } from "@/components/content-layout"
import { ArticlePreviewCard } from "@/components/article-preview-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Code, Cloud, Zap, ArrowLeft, Search, X, Target, FileText } from "lucide-react"
import Link from "next/link"
import { getAllTechnicalArticles, getAllTechnicalTags, type TechnicalArticleMetadata } from "@/lib/content"

const allDifficulties = ["beginner", "intermediate", "advanced"]
const allTypes = ["tutorial", "guide", "analysis", "documentation"]

export default function TechnicalArchitecturePage() {
  const [allArticles, setAllArticles] = useState<TechnicalArticleMetadata[]>([])
  const [filteredArticles, setFilteredArticles] = useState<TechnicalArticleMetadata[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const articles = getAllTechnicalArticles()
      const tags = getAllTechnicalTags()

      setAllArticles(articles)
      setFilteredArticles(articles)
      setAllTags(tags)
    } catch (error) {
      console.error("Error loading technical articles:", error)
      setAllArticles([])
      setFilteredArticles([])
      setAllTags([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    filterArticles(value, selectedTags, selectedDifficulty, selectedType)
  }

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    setSelectedTags(newTags)
    filterArticles(searchTerm, newTags, selectedDifficulty, selectedType)
  }

  const handleDifficultyChange = (value: string) => {
    setSelectedDifficulty(value)
    filterArticles(searchTerm, selectedTags, value, selectedType)
  }

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
    filterArticles(searchTerm, selectedTags, selectedDifficulty, value)
  }

  const filterArticles = (search: string, tags: string[], difficulty: string, type: string) => {
    let filtered = [...allArticles]

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((article) => {
        const titleMatch = article.title?.toLowerCase().includes(searchLower) || false
        const excerptMatch = article.excerpt?.toLowerCase().includes(searchLower) || false
        const tagMatch = (article.tags || []).some((tag) => tag.toLowerCase().includes(searchLower))
        const languageMatch = (article.code_languages || []).some((lang) => lang.toLowerCase().includes(searchLower))
        const difficultyMatch = article.difficulty?.toLowerCase().includes(searchLower) || false
        const typeMatch = article.type?.toLowerCase().includes(searchLower) || false
        return titleMatch || excerptMatch || tagMatch || languageMatch || difficultyMatch || typeMatch
      })
    }

    // Tag filter
    if (tags.length > 0) {
      filtered = filtered.filter((article) => tags.every((tag) => (article.tags || []).includes(tag)))
    }

    // Difficulty filter
    if (difficulty) {
      filtered = filtered.filter((article) => article.difficulty === difficulty)
    }

    // Type filter
    if (type) {
      filtered = filtered.filter((article) => article.type === type)
    }

    setFilteredArticles(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
    setSelectedDifficulty("")
    setSelectedType("")
    setFilteredArticles(allArticles)
  }

  const hasActiveFilters = searchTerm.trim() || selectedTags.length > 0 || selectedDifficulty || selectedType

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading technical articles...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
      <div className="relative">
        <ContentLayout
          title="Technical Architecture"
          description="Deep dives into system design, scalability, and technology decisions"
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
                Technical communication is about translating complex concepts into actionable insights. These articles
                focus on practical solutions, architectural patterns, and best practices drawn from real-world
                experience building and scaling software systems.
              </p>
            </div>

            {/* Technical Focus Areas */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Code className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Architecture & Design</h3>
                  <p className="text-slate-400 text-sm">
                    System design patterns, microservices, and scalable architecture principles.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Performance & Optimization</h3>
                  <p className="text-slate-400 text-sm">
                    Strategies for building fast, efficient applications that scale under load.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Cloud className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Cloud & DevOps</h3>
                  <p className="text-slate-400 text-sm">
                    Modern deployment strategies, containerization, and cloud-native development.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filter Component */}
            {allArticles.length > 0 && (
              <div className="space-y-6 mb-8 p-6 bg-gradient-to-r from-slate-800/30 to-blue-900/20 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-slate-100">Filter Technical Articles</h3>
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
                    placeholder="Search articles, technologies, or concepts..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500"
                  />
                </div>

                {/* Filters */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-slate-400" />
                      <label className="text-sm font-medium text-slate-300">Difficulty Level</label>
                    </div>
                    <Select value={selectedDifficulty} onValueChange={handleDifficultyChange}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                        <SelectValue placeholder="All levels" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {allDifficulties.map((difficulty) => (
                          <SelectItem key={difficulty} value={difficulty} className="text-slate-100">
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <label className="text-sm font-medium text-slate-300">Article Type</label>
                    </div>
                    <Select value={selectedType} onValueChange={handleTypeChange}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {allTypes.map((type) => (
                          <SelectItem key={type} value={type} className="text-slate-100">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                      {selectedDifficulty && ` • ${selectedDifficulty}`}
                      {selectedType && ` • ${selectedType}`}
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
                    section="strategic-narratives/technical-architecture"
                  />
                ))}
              </div>
            ) : allArticles.length === 0 ? (
              <div className="text-center py-12">
                <Code className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No articles available</h3>
                <p className="text-slate-400">Technical articles will appear here once they are published.</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Code className="h-12 w-12 text-slate-500 mx-auto mb-4" />
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
