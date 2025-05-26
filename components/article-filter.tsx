"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Search, X, Filter, Calendar, Clock, Star } from "lucide-react"
import type { FilterOptions } from "@/lib/types"

interface ArticleFilterProps {
  availableTags: string[]
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onClearFilters: () => void
  resultCount: number
  totalCount: number
}

export function ArticleFilter({
  availableTags,
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount,
  totalCount,
}: ArticleFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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

  const handleFeaturedChange = (checked: boolean) => {
    onFiltersChange({ ...filters, featured: checked ? true : null })
  }

  const hasActiveFilters =
    filters.search.trim() ||
    filters.tags.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.readingTime.min > 0 ||
    filters.readingTime.max < 60 ||
    filters.featured !== null

  return (
    <Card className="bg-slate-800/30 border-slate-700 mb-8">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-slate-100">Filter Articles</h3>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">
                {resultCount} of {totalCount} articles
              </span>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search articles, topics, or concepts..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.featured ? "default" : "outline"}
              size="sm"
              onClick={() => handleFeaturedChange(!filters.featured)}
              className="text-xs"
            >
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-xs">
              Advanced Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {isExpanded && (
            <div className="space-y-6 pt-4 border-t border-slate-700">
              {/* Date Range */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    From Date
                  </Label>
                  <Input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => handleDateRangeChange("start", e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">To Date</Label>
                  <Input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => handleDateRangeChange("end", e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-slate-100"
                  />
                </div>
              </div>

              {/* Reading Time */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Reading Time: {filters.readingTime.min}-{filters.readingTime.max} minutes
                </Label>
                <Slider
                  value={[filters.readingTime.min, filters.readingTime.max]}
                  onValueChange={handleReadingTimeChange}
                  max={60}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Tags */}
          {availableTags.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-300">Topics & Categories</h4>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "secondary"}
                    className={`cursor-pointer transition-colors text-xs ${
                      filters.tags.includes(tag)
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

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="text-sm text-slate-400 pt-2 border-t border-slate-700">
              <span className="font-medium">Active filters:</span>
              {filters.search && <span className="ml-2">"{filters.search}"</span>}
              {filters.tags.length > 0 && <span className="ml-2">• {filters.tags.join(", ")}</span>}
              {filters.featured && <span className="ml-2">• Featured</span>}
              {(filters.dateRange.start || filters.dateRange.end) && <span className="ml-2">• Date range</span>}
              {(filters.readingTime.min > 0 || filters.readingTime.max < 60) && (
                <span className="ml-2">• Reading time</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
