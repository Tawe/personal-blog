"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Filter } from "lucide-react"
import type { ArtumiContentMetadata } from "@/lib/content"

interface ArtumiContentFilterProps {
  content: ArtumiContentMetadata[]
  allCategories: string[]
  allTypes: string[]
  allRegions: string[]
  allStatuses: string[]
  onFilterChange: (filteredContent: ArtumiContentMetadata[]) => void
}

export function ArtumiContentFilter({
  content = [],
  allCategories = [],
  allTypes = [],
  allRegions = [],
  allStatuses = [],
  onFilterChange,
}: ArtumiContentFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")

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
        const region = item.region || ""
        const type = item.type || ""

        const titleMatch = title.toLowerCase().includes(searchLower)
        const excerptMatch = excerpt.toLowerCase().includes(searchLower)
        const regionMatch = region.toLowerCase().includes(searchLower)
        const typeMatch = type.toLowerCase().includes(searchLower)

        const categories = item.categories || []
        const categoriesMatch = categories.some((cat) => cat && cat.toLowerCase().includes(searchLower))

        const tags = item.tags || []
        const tagsMatch = tags.some((tag) => tag && tag.toLowerCase().includes(searchLower))

        return titleMatch || excerptMatch || regionMatch || typeMatch || categoriesMatch || tagsMatch
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

    // Region filter
    if (selectedRegion) {
      filtered = filtered.filter((item) => item && item.region === selectedRegion)
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter((item) => item && item.status === selectedStatus)
    }

    onFilterChange(filtered)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    // Apply filters immediately when search changes
    setTimeout(() => {
      applyFilters()
    }, 0)
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]

    setSelectedCategories(newCategories)

    // Apply filters immediately
    setTimeout(() => {
      applyFilters()
    }, 0)
  }

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
    setTimeout(() => {
      applyFilters()
    }, 0)
  }

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value)
    setTimeout(() => {
      applyFilters()
    }, 0)
  }

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    setTimeout(() => {
      applyFilters()
    }, 0)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setSelectedType("")
    setSelectedRegion("")
    setSelectedStatus("")
    onFilterChange(content)
  }

  const hasActiveFilters =
    searchTerm.trim() || selectedCategories.length > 0 || selectedType || selectedRegion || selectedStatus

  return (
    <div className="space-y-6 mb-8 p-6 bg-gradient-to-r from-slate-800/30 to-purple-900/20 rounded-xl border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-slate-100">Explore Artumin</h3>
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
          placeholder="Search stories, characters, locations, magic..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-purple-500"
        />
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Region Filter */}
        {allRegions && allRegions.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Region</label>
            <Select value={selectedRegion} onValueChange={handleRegionChange}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                <SelectValue placeholder="All regions" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {allRegions.map((region) => (
                  <SelectItem key={region} value={region} className="text-slate-100">
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Status Filter */}
        {allStatuses && allStatuses.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Status</label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {allStatuses.map((status) => (
                  <SelectItem key={status} value={status} className="text-slate-100">
                    {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
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
          <h4 className="text-sm font-medium text-slate-300">Categories & Themes</h4>
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
          {selectedRegion && <span>• {selectedRegion} </span>}
          {selectedStatus && <span>• {selectedStatus} </span>}
          {selectedCategories.length > 0 && <span>• {selectedCategories.join(", ")}</span>}
        </div>
      )}
    </div>
  )
}
