"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Filter, Target, FileText } from "lucide-react"
import type {
  BaseContentMetadata,
  TechnicalArticleMetadata,
  ArtumiContentMetadata,
  DndContentMetadata,
} from "@/lib/content"

interface BaseFilterProps<T extends BaseContentMetadata> {
  content: T[]
  allTags: string[]
  onFilterChange: (filteredContent: T[]) => void
  section: "leadership" | "technical" | "artumin" | "dnd"
  accentColor?: string
}

interface TechnicalFilterProps extends BaseFilterProps<TechnicalArticleMetadata> {
  allDifficulties: string[]
  allTypes: string[]
  allLanguages: string[]
}

interface ArtumiFilterProps extends BaseFilterProps<ArtumiContentMetadata> {
  allCategories: string[]
  allTypes: string[]
  allRegions: string[]
  allStatuses: string[]
}

interface DndFilterProps extends BaseFilterProps<DndContentMetadata> {
  allTypes: string[]
  allSystems: string[]
  allAvailability: string[]
}

type ContentFilterProps<T extends BaseContentMetadata> =
  | (BaseFilterProps<T> & { section: "leadership" })
  | TechnicalFilterProps
  | ArtumiFilterProps
  | DndFilterProps

export function ContentFilter<T extends BaseContentMetadata>(props: ContentFilterProps<T>) {
  const { content, allTags, onFilterChange, section, accentColor = "blue" } = props

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Section-specific filters
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [selectedSystem, setSelectedSystem] = useState<string>("")
  const [selectedAvailability, setSelectedAvailability] = useState<string>("")
  const [playtestedOnly, setPlaytestedOnly] = useState(false)

  const filterContent = () => {
    let filtered = content

    // Common search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter((item) => {
        const basicMatch =
          item.title.toLowerCase().includes(searchLower) ||
          item.excerpt?.toLowerCase().includes(searchLower) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchLower))

        // Section-specific search
        if (section === "technical") {
          const tech = item as TechnicalArticleMetadata
          return basicMatch || tech.code_languages?.some((lang) => lang.toLowerCase().includes(searchLower))
        }
        if (section === "artumin") {
          const artumi = item as ArtumiContentMetadata
          return basicMatch || artumi.region?.toLowerCase().includes(searchLower)
        }
        if (section === "dnd") {
          const dnd = item as DndContentMetadata
          return basicMatch || dnd.system.toLowerCase().includes(searchLower)
        }

        return basicMatch
      })
    }

    // Common tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((item) => selectedTags.every((tag) => item.tags.includes(tag)))
    }

    // Section-specific filters
    if (section === "technical") {
      const techProps = props as TechnicalFilterProps
      if (selectedDifficulty) {
        filtered = filtered.filter((item) => (item as TechnicalArticleMetadata).difficulty === selectedDifficulty)
      }
      if (selectedType) {
        filtered = filtered.filter((item) => (item as TechnicalArticleMetadata).type === selectedType)
      }
      if (selectedLanguages.length > 0) {
        filtered = filtered.filter((item) =>
          selectedLanguages.some((lang) => (item as TechnicalArticleMetadata).code_languages?.includes(lang)),
        )
      }
    }

    if (section === "artumin") {
      if (selectedCategories.length > 0) {
        filtered = filtered.filter((item) =>
          selectedCategories.every((cat) => (item as ArtumiContentMetadata).categories.includes(cat)),
        )
      }
      if (selectedType) {
        filtered = filtered.filter((item) => (item as ArtumiContentMetadata).type === selectedType)
      }
      if (selectedRegion) {
        filtered = filtered.filter((item) => (item as ArtumiContentMetadata).region === selectedRegion)
      }
      if (selectedStatus) {
        filtered = filtered.filter((item) => (item as ArtumiContentMetadata).status === selectedStatus)
      }
    }

    if (section === "dnd") {
      if (selectedType) {
        filtered = filtered.filter((item) => (item as DndContentMetadata).type === selectedType)
      }
      if (selectedSystem) {
        filtered = filtered.filter((item) => (item as DndContentMetadata).system === selectedSystem)
      }
      if (selectedAvailability) {
        filtered = filtered.filter((item) => (item as DndContentMetadata).availability === selectedAvailability)
      }
      if (playtestedOnly) {
        filtered = filtered.filter((item) => (item as DndContentMetadata).playtested)
      }
    }

    onFilterChange(filtered)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setTimeout(filterContent, 0)
  }

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    setSelectedTags(newTags)
    setTimeout(filterContent, 0)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
    setSelectedDifficulty("")
    setSelectedType("")
    setSelectedLanguages([])
    setSelectedCategories([])
    setSelectedRegion("")
    setSelectedStatus("")
    setSelectedSystem("")
    setSelectedAvailability("")
    setPlaytestedOnly(false)
    onFilterChange(content)
  }

  const hasActiveFilters =
    searchTerm.trim() ||
    selectedTags.length > 0 ||
    selectedDifficulty ||
    selectedType ||
    selectedLanguages.length > 0 ||
    selectedCategories.length > 0 ||
    selectedRegion ||
    selectedStatus ||
    selectedSystem ||
    selectedAvailability ||
    playtestedOnly

  const getSectionTitle = () => {
    switch (section) {
      case "technical":
        return "Filter Technical Content"
      case "artumin":
        return "Explore Artumin"
      case "dnd":
        return "Filter RPG Content"
      default:
        return "Filter Content"
    }
  }

  const getSectionIcon = () => {
    switch (section) {
      case "technical":
        return <Filter className={`h-5 w-5 text-${accentColor}-400`} />
      case "artumin":
        return <Filter className={`h-5 w-5 text-purple-400`} />
      case "dnd":
        return <Filter className={`h-5 w-5 text-red-400`} />
      default:
        return <Filter className={`h-5 w-5 text-${accentColor}-400`} />
    }
  }

  const getSearchPlaceholder = () => {
    switch (section) {
      case "technical":
        return "Search articles, technologies, or concepts..."
      case "artumin":
        return "Search the realm for stories, characters, locations..."
      case "dnd":
        return "Search mechanics, monsters, adventures..."
      default:
        return "Search articles..."
    }
  }

  return (
    <div
      className={`space-y-6 mb-8 p-6 bg-gradient-to-r from-slate-800/30 ${
        section === "artumin" ? "to-purple-900/20" : section === "dnd" ? "to-red-900/20" : "to-blue-900/20"
      } rounded-xl border border-slate-700`}
    >
      <div className="flex items-center gap-2 mb-4">
        {getSectionIcon()}
        <h3 className="text-lg font-semibold text-slate-100">{getSectionTitle()}</h3>
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
          placeholder={getSearchPlaceholder()}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={`pl-10 bg-slate-800/50 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-${
            section === "artumin" ? "purple" : section === "dnd" ? "red" : accentColor
          }-500`}
        />
      </div>

      {/* Section-specific filters */}
      {section === "technical" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-slate-400" />
              <label className="text-sm font-medium text-slate-300">Difficulty Level</label>
            </div>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {(props as TechnicalFilterProps).allDifficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty} className="text-slate-100">
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-400" />
              <label className="text-sm font-medium text-slate-300">Article Type</label>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {(props as TechnicalFilterProps).allTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-slate-100">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300">
            {section === "artumin" ? "Categories & Themes" : "Topics & Categories"}
          </h4>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                className={`cursor-pointer transition-colors text-xs ${
                  selectedTags.includes(tag)
                    ? `bg-${section === "artumin" ? "purple" : section === "dnd" ? "red" : accentColor}-600 hover:bg-${section === "artumin" ? "purple" : section === "dnd" ? "red" : accentColor}-700 text-white`
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

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="text-sm text-slate-400 pt-2 border-t border-slate-700">
          <span className="font-medium">Active filters: </span>
          {searchTerm && <span>"{searchTerm}" </span>}
          {selectedDifficulty && <span>• {selectedDifficulty} </span>}
          {selectedType && <span>• {selectedType} </span>}
          {selectedTags.length > 0 && <span>• {selectedTags.join(", ")}</span>}
        </div>
      )}
    </div>
  )
}

// Legacy exports for backward compatibility
export { ContentFilter as TechnicalContentFilter }
export { ContentFilter as ArtumiContentFilter }
export { ContentFilter as DndContentFilter }

// Additional legacy exports for backward compatibility with specific file imports
export { ContentFilter as ArtumiContentFilter }
export { ContentFilter as DndContentFilter }
