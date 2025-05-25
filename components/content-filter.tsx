"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Filter } from "lucide-react"

interface ContentMetadata {
  slug: string
  title: string
  date: string
  type: string
  excerpt: string
  categories: string[]
  tags: string[]
  reading_time?: number
}

interface ContentFilterProps {
  content: ContentMetadata[]
  allCategories: string[]
  allTypes: string[]
  allTags: string[]
  onFilterChange: (filteredContent: ContentMetadata[]) => void
}

export function ContentFilter({
  content = [],
  allCategories = [],
  allTypes = [],
  allTags = [],
  onFilterChange,
}: ContentFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string>("")

  const applyFilters = () => {
    if (!content || !Array.isArray(content)) {
      onFilterChange([])
      return
    }

    let filtered = [...content]

    // Search filter
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      filtered = filtered.filter((item) => {
        if (!item) return false

        const title = item.title || ""
        const excerpt = item.excerpt || ""
        const type = item.type || ""

        const titleMatch = title.toLowerCase().includes(searchLower)
        const excerptMatch = excerpt.toLowerCase().includes(searchLower)
        const typeMatch = type.toLowerCase().includes(searchLower)

        const categories = item.categories || []
        const categoriesMatch = categories.some((cat) => cat && cat.toLowerCase().includes(searchLower))

        const tags = item.tags || []
        const tagsMatch = tags.some((tag) => tag && tag.toLowerCase().includes(searchLower))

        return titleMatch || excerptMatch || typeMatch || categoriesMatch || tagsMatch
      })
    }

    // Category filter
    if (selectedCategories && selectedCategories.length > 0) {
      filtered = filtered.filter((item) => {
        if (!item || !item.categories) return false
        return selectedCategories.every((cat) => item.categories.includes(cat))
      })
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter((item) => item && item.type === selectedType)
    }

    onFilterChange(filtered)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setTimeout(() => applyFilters(), 0)
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(newCategories)
    setTimeout(() => applyFilters(), 0)
  }

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
    setTimeout(() => applyFilters(), 0)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setSelectedType("")
    onFilterChange(content)
  }

  const hasActiveFilters = searchTerm.trim() || selectedCategories.length > 0 || selectedType

  return (
    <div className="space-y-6 mb-8 p-6 bg-gradient-to-r from-slate-800/30 to-purple-900/20 rounded-xl border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-slate-100">Filter Content</h3>
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
          placeholder="Search content..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-purple-500"
        />
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Type Filter */}
        {allTypes && allTypes.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Content Type</label>
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
        )}
      </div>

      {/* Categories */}
      {allCategories && allCategories.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "secondary"}
                className={`cursor-pointer transition-colors text-xs ${
                  selectedCategories.includes(category)
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                }`}
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="text-sm text-slate-400 pt-2 border-t border-slate-700">
          <span className="font-medium">Active filters: </span>
          {searchTerm && <span>"{searchTerm}" </span>}
          {selectedType && <span>• {selectedType} </span>}
          {selectedCategories.length > 0 && <span>• {selectedCategories.join(", ")}</span>}
        </div>
      )}
    </div>
  )
}
