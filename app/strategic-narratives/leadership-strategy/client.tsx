"use client"

import { useState } from "react"
import { ArticlePreviewCard } from "@/components/article-preview-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, X, BookOpen } from "lucide-react"
import type { ArticleMetadata } from "@/lib/content"

interface LeadershipStrategyClientProps {
  articles: ArticleMetadata[]
  tags: string[]
}

export function LeadershipStrategyClient({ articles, tags }: LeadershipStrategyClientProps) {
  const [filteredArticles, setFilteredArticles] = useState<ArticleMetadata[]>(articles)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

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
    let filtered = [...articles]

    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((article) => {
        const titleMatch = article.title?.toLowerCase().includes(searchLower) || false
        const excerptMatch = article.excerpt?.toLowerCase().includes(searchLower) || false
        const tagMatch = (article.tags || []).some((tag) => tag.toLowerCase().includes(searchLower))
        return titleMatch || excerptMatch || tagMatch
      })
    }

    if (tags.length > 0) {
      filtered = filtered.filter((article) => tags.every((tag) => (article.tags || []).includes(tag)))
    }

    setFilteredArticles(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
    setFilteredArticles(articles)
  }

  const hasActiveFilters = searchTerm.trim() || selectedTags.length > 0

  return (
    <>
      {/* Filter Component */}
      {articles.length > 0 && (
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

          <div className="text-sm text-slate-400">
            Showing {filteredArticles.length} of {articles.length} articles
            {hasActiveFilters && (
              <span className="ml-2">
                • Filtered by: {searchTerm && `"${searchTerm}"`} {selectedTags.length > 0 && selectedTags.join(", ")}
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
      ) : articles.length === 0 ? (
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
    </>
  )
}
