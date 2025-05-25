"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import type { ArticleMetadata } from "@/lib/content"

interface ContentFilterProps {
  articles: ArticleMetadata[]
  allTags: string[]
  onFilterChange: (filteredArticles: ArticleMetadata[]) => void
}

export function ContentFilter({ articles, allTags, onFilterChange }: ContentFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filterArticles = (search: string, tags: string[]) => {
    let filtered = articles

    // Filter by search term
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchLower) ||
          article.excerpt?.toLowerCase().includes(searchLower) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    // Filter by tags
    if (tags.length > 0) {
      filtered = filtered.filter((article) => tags.every((tag) => article.tags.includes(tag)))
    }

    onFilterChange(filtered)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    filterArticles(value, selectedTags)
  }

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]

    setSelectedTags(newTags)
    filterArticles(searchTerm, newTags)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
    onFilterChange(articles)
  }

  const hasActiveFilters = searchTerm.trim() || selectedTags.length > 0

  return (
    <div className="space-y-6 mb-8">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500"
        />
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Filter by topic:</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-slate-400 hover:text-slate-200 h-auto p-1"
              >
                <X className="h-4 w-4 mr-1" />
                Clear filters
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
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
        </div>
      )}

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="text-sm text-slate-400">
          {searchTerm && <span>Searching for "{searchTerm}"</span>}
          {searchTerm && selectedTags.length > 0 && <span> • </span>}
          {selectedTags.length > 0 && <span>Filtered by: {selectedTags.join(", ")}</span>}
        </div>
      )}
    </div>
  )
}
