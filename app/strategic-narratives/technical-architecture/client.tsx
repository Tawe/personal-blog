"use client"

import { useState } from "react"
import { ArticlePreviewCard } from "@/components/article-preview-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Code, Search, X, Target, FileText } from "lucide-react"
import type { TechnicalArticleMetadata } from "@/lib/content"

const allDifficulties = ["beginner", "intermediate", "advanced"]
const allTypes = ["tutorial", "guide", "analysis", "documentation"]

interface TechnicalArchitectureClientProps {
  articles: TechnicalArticleMetadata[]
  tags: string[]
}

export function TechnicalArchitectureClient({ articles, tags }: TechnicalArchitectureClientProps) {
  const [filteredArticles, setFilteredArticles] = useState(articles)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")

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
    let filtered = [...articles]

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
    setFilteredArticles(articles)
  }

  const hasActiveFilters = searchTerm.trim() || selectedTags.length > 0 || selectedDifficulty || selectedType

  return (
    <>
      {/* Filter Component */}
      {articles.length > 0 && (
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
          {tags.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-300">Topics & Categories</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
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
            Showing {filteredArticles.length} of {articles.length} articles
            {hasActiveFilters && (
              <span className="ml-2">
                • Filtered by: {searchTerm && `"${searchTerm}"`} {selectedTags.length > 0 && selectedTags.join(", ")}
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
      ) : articles.length === 0 ? (
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
    </>
  )
}
