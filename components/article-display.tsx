"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List, Calendar, Clock, Star, ArrowUpDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Article, SortOption, ViewMode } from "@/lib/types"

interface ArticleDisplayProps {
  articles: Article[]
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  sortOption: SortOption
  onSortChange: (sort: SortOption) => void
  baseUrl: string
  onTagClick?: (tag: string) => void
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
  const handleSortChange = (value: string) => {
    const [field, direction] = value.split("-") as [SortOption["field"], SortOption["direction"]]
    onSortChange({ field, direction })
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="h-12 w-12 text-slate-500 mx-auto mb-4">📄</div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">No articles found</h3>
        <p className="text-slate-400">Try adjusting your search terms or clearing the filters to see more articles.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <span className="text-sm text-slate-400">
            {articles.length} article{articles.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-slate-400" />
          <Select value={`${sortOption.field}-${sortOption.direction}`} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600 text-slate-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="date-desc" className="text-slate-100">
                Newest First
              </SelectItem>
              <SelectItem value="date-asc" className="text-slate-100">
                Oldest First
              </SelectItem>
              <SelectItem value="title-asc" className="text-slate-100">
                Title A-Z
              </SelectItem>
              <SelectItem value="title-desc" className="text-slate-100">
                Title Z-A
              </SelectItem>
              <SelectItem value="reading_time-asc" className="text-slate-100">
                Quick Reads
              </SelectItem>
              <SelectItem value="reading_time-desc" className="text-slate-100">
                Longer Reads
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Articles Grid/List */}
      <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {articles.map((article) => (
          <ArticleCard
            key={article.slug}
            article={article}
            viewMode={viewMode}
            baseUrl={baseUrl}
            onTagClick={onTagClick}
          />
        ))}
      </div>
    </div>
  )
}

interface ArticleCardProps {
  article: Article
  viewMode: ViewMode
  baseUrl: string
  onTagClick?: (tag: string) => void
}

function ArticleCard({ article, viewMode, baseUrl, onTagClick }: ArticleCardProps) {
  const isGridView = viewMode === "grid"

  return (
    <Card
      className={`group bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 ${
        isGridView ? "h-full" : "flex"
      }`}
    >
      <CardContent className={`p-0 ${isGridView ? "" : "flex w-full"}`}>
        <Link href={`${baseUrl}/${article.slug}`} className={`block ${isGridView ? "" : "flex w-full"}`}>
          {/* Featured Image */}
          {article.featured_image && (
            <div
              className={`relative overflow-hidden ${isGridView ? "aspect-video w-full" : "w-48 h-32 flex-shrink-0"}`}
            >
              <Image
                src={article.featured_image || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              {article.featured && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-yellow-600 text-yellow-100">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className={`p-6 ${isGridView ? "" : "flex-1"}`}>
            <div className="space-y-3">
              {/* Title */}
              <h3
                className={`font-semibold text-slate-100 group-hover:text-blue-400 transition-colors ${
                  isGridView ? "text-lg" : "text-xl"
                }`}
              >
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className={`text-slate-400 ${isGridView ? "text-sm" : "text-base"}`}>{article.excerpt}</p>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{article.reading_time} min read</span>
                </div>
              </div>

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, isGridView ? 3 : 5).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault()
                        onTagClick?.(tag)
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {article.tags.length > (isGridView ? 3 : 5) && (
                    <Badge variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">
                      +{article.tags.length - (isGridView ? 3 : 5)}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
