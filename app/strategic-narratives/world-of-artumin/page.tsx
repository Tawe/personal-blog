"use client"

import { useState, useEffect, useMemo } from "react"
import { ContentLayout } from "@/components/content-layout"
import { ArticleFilter } from "@/components/article-filter"
import { ArticleDisplay } from "@/components/article-display"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Crown, Sword, BookOpen } from "lucide-react"
import Link from "next/link"
import { getAllArtumiContent, getAllTags } from "@/lib/content"
import { filterArticles, sortArticles } from "@/lib/content-unified"
import type { ArtumiContentMetadata, FilterOptions, SortOption, ViewMode } from "@/lib/types"

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

export default function WorldOfArtuminPage() {
  const [allArticles, setAllArticles] = useState<ArtumiContentMetadata[]>([])
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
      const articles = getAllArtumiContent()
      const tags = getAllTags("artumin")

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
  }, [])

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
          <ContentLayout>
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
          <ContentLayout>
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
        <ContentLayout>
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 mb-4">World of Artumin</h1>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Reflective fantasy and leadership fables exploring worth, power, and the quiet courage it takes to
                change
              </p>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="mb-12">
              <Button variant="ghost" className="text-slate-400 hover:text-purple-400 p-0" asChild>
                <Link href="/strategic-narratives">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Strategic Narratives
                </Link>
              </Button>
            </div>

            {/* Description Section */}
            <div className="mb-16">
              <p className="text-lg text-slate-300 text-center max-w-5xl mx-auto leading-relaxed">
                The World of Artumin weaves together fantasy storytelling with profound leadership insights, creating
                fables that explore the complexities of power, responsibility, and moral courage. These tales examine
                how individuals navigate difficult decisions, build meaningful connections, and discover their true
                worth in a world where magic and politics intertwine. Each story serves as both entertainment and
                reflection, offering timeless lessons wrapped in compelling narratives.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Crown className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-4">Leadership Fables</h3>
                <p className="text-slate-400">
                  Stories that explore the weight of command, the burden of difficult decisions, and the courage
                  required to lead with integrity.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Sword className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-4">Character Studies</h3>
                <p className="text-slate-400">
                  Deep explorations of individuals facing moral complexity, personal growth, and the challenge of
                  staying true to their values.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-4">World Building</h3>
                <p className="text-slate-400">
                  Rich explorations of Artumin's cultures, politics, and magical systems that create the backdrop for
                  meaningful storytelling.
                </p>
              </div>
            </div>

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
              baseUrl="/strategic-narratives/world-of-artumin"
              onTagClick={handleTagClick}
            />
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
