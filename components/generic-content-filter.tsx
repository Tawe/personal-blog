"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, X, Calendar, Clock, Star } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface FilterOptions {
  search: string
  tags: string[]
  dateRange: { start: string; end: string }
  readingTime: { min: number; max: number }
  featured: boolean | null
  [key: string]: any // Allow for content-type specific filters
}

interface GenericContentFilterProps {
  title?: string
  availableTags: string[]
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onClearFilters: () => void
  resultCount: number
  totalCount: number
  contentType?: string // e.g., "articles", "content", "posts"
  customFilters?: React.ReactNode // Allow for content-type specific filter UI
}

export function GenericContentFilter({
  title = "Filter Content",
  availableTags,
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount,
  totalCount,
  contentType = "items",
  customFilters,
}: GenericContentFilterProps) {
  const [showAllTopics, setShowAllTopics] = useState(false)
  const TOPICS_LIMIT = 20
  
  const hasActiveFilters =
    filters.search.trim() ||
    filters.tags.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.readingTime.min > 0 ||
    filters.readingTime.max < 60 ||
    filters.featured !== null

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag) ? filters.tags.filter((t) => t !== tag) : [...filters.tags, tag]
    onFiltersChange({ ...filters, tags: newTags })
  }

  const handleDateRangeChange = (field: "start" | "end", value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: { ...filters.dateRange, [field]: value },
    })
  }

  const handleReadingTimeChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      readingTime: { min: values[0], max: values[1] },
    })
  }

  const handleFeaturedChange = (value: string) => {
    const featured = value === "all" ? null : value === "featured"
    onFiltersChange({ ...filters, featured })
  }

  return (
    <div className="space-y-6 mb-8 p-6 bg-gradient-to-r from-slate-800/30 to-purple-900/20 rounded-xl border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
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
          placeholder={`Search ${contentType}, topics, or concepts...`}
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-purple-500"
        />
      </div>

      {/* Standard Filters Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Date Range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <label className="text-sm font-medium text-slate-300">Date Range</label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateRangeChange("start", e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-slate-100"
            />
            <Input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateRangeChange("end", e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-slate-100"
            />
          </div>
        </div>

        {/* Featured Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-slate-400" />
            <label className="text-sm font-medium text-slate-300">Featured Status</label>
          </div>
          <Select
            value={filters.featured === null ? "all" : filters.featured ? "featured" : "regular"}
            onValueChange={handleFeaturedChange}
          >
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all" className="text-slate-100">
                All {contentType}
              </SelectItem>
              <SelectItem value="featured" className="text-slate-100">
                Featured Only
              </SelectItem>
              <SelectItem value="regular" className="text-slate-100">
                Regular Only
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reading Time */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400" />
          <label className="text-sm font-medium text-slate-300">
            Reading Time: {filters.readingTime.min}-{filters.readingTime.max} minutes
          </label>
        </div>
        <Slider
          value={[filters.readingTime.min, filters.readingTime.max]}
          onValueChange={handleReadingTimeChange}
          max={60}
          min={0}
          step={1}
          className="w-full"
        />
      </div>

      {/* Custom Filters (for content-type specific filtering) */}
      {customFilters && (
        <div className="space-y-3">
          {customFilters}
        </div>
      )}

      {/* Tags */}
      {availableTags.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300">Topics & Categories</h4>
          <div className="flex flex-wrap gap-2">
            {(showAllTopics ? availableTags : availableTags.slice(0, TOPICS_LIMIT)).map((tag) => (
              <Badge
                key={tag}
                variant={filters.tags.includes(tag) ? "default" : "secondary"}
                className={`cursor-pointer transition-colors text-xs ${
                  filters.tags.includes(tag)
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                }`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          {availableTags.length > TOPICS_LIMIT && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllTopics(!showAllTopics)}
              className="text-slate-400 hover:text-slate-200"
            >
              {showAllTopics ? "Show less" : `Show more (${availableTags.length - TOPICS_LIMIT} more)`}
            </Button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-slate-400">
        Showing {resultCount} of {totalCount} {contentType}
        {hasActiveFilters && (
          <span className="ml-2">
            • Filtered by: {filters.search && `"${filters.search}"`}{" "}
            {filters.tags.length > 0 && filters.tags.join(", ")}
          </span>
        )}
      </div>
    </div>
  )
}