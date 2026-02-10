"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List, SortAsc, SortDesc } from "lucide-react"
import { ArticleCard } from "@/components/article-card"
import type { ArtumiContentMetadata, SortOption, ViewMode } from "@/lib/types"

interface ArticleDisplayProps {
  articles: ArtumiContentMetadata[]
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  sortOption: SortOption
  onSortChange: (sort: SortOption) => void
  baseUrl: string
  onTagClick: (tag: string) => void
}

export function ArticleDisplay({
  articles,
  viewMode,
  onViewModeChange,
  sortOption,
  onSortChange,
  baseUrl,
  onTagClick,
}: ArticleDisplayProps) {
  const handleSortFieldChange = (field: string) => {
    onSortChange({ ...sortOption, field: field as SortOption["field"] })
  }

  const handleSortDirectionToggle = () => {
    onSortChange({ ...sortOption, direction: sortOption.direction === "asc" ? "desc" : "asc" })
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-500 mb-4" aria-hidden="true">📚</div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">No articles found</h3>
        <p className="text-slate-400">Try adjusting your filters to see more content.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <Select value={sortOption.field} onValueChange={handleSortFieldChange}>
              <SelectTrigger className="w-32 bg-slate-800/50 border-slate-600 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="date" className="text-slate-100">
                  Date
                </SelectItem>
                <SelectItem value="title" className="text-slate-100">
                  Title
                </SelectItem>
                <SelectItem value="reading_time" className="text-slate-100">
                  Reading Time
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSortDirectionToggle}
              aria-label={`Sort ${sortOption.direction === "asc" ? "ascending" : "descending"}`}
              className="text-slate-400 hover:text-slate-200"
            >
              {sortOption.direction === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
            className="h-8 w-8 p-0"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Articles */}
      <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {articles.map((article) => (
          <ArticleCard
            key={article.slug}
            article={article}
            baseUrl={baseUrl}
            onTagClick={onTagClick}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  )
}
