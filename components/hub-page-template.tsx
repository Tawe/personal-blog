"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { ContentLayout } from "@/components/content-layout"
import { ArticleFilter } from "@/components/article-filter"
import { ArticleDisplay } from "@/components/article-display"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getAllArticles, getAllTags, filterArticles, sortArticles } from "@/lib/content-unified"
import type { Article, FilterOptions, SortOption, ViewMode, HubConfig } from "@/lib/types"

interface HubPageTemplateProps {
  config: HubConfig
  children?: React.ReactNode
}

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

export function HubPageTemplate({ config, children }: HubPageTemplateProps) {
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters)
  const [sortOption, setSortOption] = useState<SortOption>(defaultSort)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load articles and tags
  useEffect(() => {
    try {
      setIsLoading(true)
      const articles = getAllArticles(config.contentFolder)
      const tags = getAllTags(config.contentFolder)

      setAllArticles(articles)
      setAvailableTags(tags)
      setError(null)
    } catch (err) {
      console.error("Error loading articles:", err)
      setError("Failed to load articles")
      setAllArticles([])
      setAvailableTags([])
    } finally {
      setIsLoading(false)
    }
  }, [config.contentFolder])

  // Filter and sort articles
  const processedArticles = useMemo(() => {
    const filtered = filterArticles(allArticles, filters)
    return sortArticles(filtered, sortOption)
  }, [allArticles, filters, sortOption])

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
        <div className="relative">
          <ContentLayout title={config.title} description={config.description}>
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center py-12">
                <div className="text-slate-400">Loading articles...</div>
              </div>
            </div>
          </ContentLayout>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
        <div className="relative">
          <ContentLayout title={config.title} description={config.description}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center py-12">
                <div className="text-red-400 mb-4">⚠️ Error</div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">Failed to load articles</h3>
                <p className="text-slate-400">{error}</p>
              </div>
            </div>
          </ContentLayout>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
      <div className="relative">
        <ContentLayout title={config.title} description={config.description}>
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb Navigation */}
            <div className="mb-8">
              <Button variant="ghost" className="text-slate-400 hover:text-blue-400 p-0" asChild>
                <Link href="/strategic-narratives">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Strategic Narratives
                </Link>
              </Button>
            </div>

            {/* Custom Content */}
            {children}

            {/* Filter Component */}
            <ArticleFilter
              availableTags={availableTags}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              resultCount={processedArticles.length}
              totalCount={allArticles.length}
            />

            {/* Article Display */}
            <ArticleDisplay
              articles={processedArticles}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortOption={sortOption}
              onSortChange={setSortOption}
              baseUrl={config.baseUrl}
              onTagClick={handleTagClick}
            />
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
