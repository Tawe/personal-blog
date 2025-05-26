"use client"

import { useState, useMemo } from "react"
import { ArticleFilter } from "@/components/article-filter"
import { ArticleDisplay } from "@/components/article-display"
import { filterArticles, sortArticles } from "@/lib/client-utils"
import type { ArtumiContentMetadata } from "@/lib/content"
import type { FilterOptions, SortOption, ViewMode } from "@/lib/client-utils"

const defaultFilters: FilterOptions = {
  search: "",
  tags: [],
  dateRange: { start: "", end: "" },
  readingTime: { min: 0, max: 60 },
  featured: null,
}

const defaultSort: SortOption = {
  field: "date",
  direction: "desc",
}

interface WorldOfArtuminClientProps {
  articles: ArtumiContentMetadata[]
  availableTags: string[]
}

export function WorldOfArtuminClient({ articles, availableTags }: WorldOfArtuminClientProps) {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters)
  const [sortOption, setSortOption] = useState<SortOption>(defaultSort)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  // Filter and sort articles
  const processedArticles = useMemo(() => {
    const filtered = filterArticles(articles, filters)
    return sortArticles(filtered, sortOption)
  }, [articles, filters, sortOption])

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters)
  }

  const handleTagClick = (tag: string) => {
    const newTags = filters.tags.includes(tag) ? filters.tags.filter((t) => t !== tag) : [...filters.tags, tag]
    setFilters({ ...filters, tags: newTags })
  }

  return (
    <>
      {/* Filter Component */}
      <ArticleFilter
        availableTags={availableTags}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        resultCount={processedArticles.length}
        totalCount={articles.length}
      />

      {/* Article Display */}
      <ArticleDisplay
        articles={processedArticles}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortOption={sortOption}
        onSortChange={setSortOption}
        baseUrl="/strategic-narratives/world-of-artumin"
        onTagClick={handleTagClick}
      />
    </>
  )
}
