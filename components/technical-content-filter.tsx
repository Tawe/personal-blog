"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Filter, Code, Target, FileText } from "lucide-react"
import type { TechnicalArticleMetadata } from "@/lib/technical-content"

interface TechnicalContentFilterProps {
  articles: TechnicalArticleMetadata[]
  allTags: string[]
  allDifficulties: string[]
  allTypes: string[]
  allLanguages: string[]
  onFilterChange: (filteredArticles: TechnicalArticleMetadata[]) => void
}

export function TechnicalContentFilter({
  articles,
  allTags,
  allDifficulties,
  allTypes,
  allLanguages,
  onFilterChange,
}: TechnicalContentFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

  const filterArticles = (search: string, tags: string[], difficulty: string, type: string, languages: string[]) => {
    let filtered = articles

    // Filter by search term
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchLower) ||
          article.excerpt?.toLowerCase().includes(searchLower) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          article.code_languages?.some((lang) => lang.toLowerCase().includes(searchLower)),
      )
    }

    // Filter by tags
    if (tags.length > 0) {
      filtered = filtered.filter((article) => tags.every((tag) => article.tags.includes(tag)))
    }

    // Filter by difficulty
    if (difficulty) {
      filtered = filtered.filter((article) => article.difficulty === difficulty)
    }

    // Filter by type
    if (type) {
      filtered = filtered.filter((article) => article.type === type)
    }

    // Filter by code languages
    if (languages.length > 0) {
      filtered = filtered.filter((article) => languages.some((lang) => article.code_languages?.includes(lang)))
    }

    onFilterChange(filtered)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    filterArticles(value, selectedTags, selectedDifficulty, selectedType, selectedLanguages)
  }

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    setSelectedTags(newTags)
    filterArticles(searchTerm, newTags, selectedDifficulty, selectedType, selectedLanguages)
  }

  const handleLanguageToggle = (language: string) => {
    const newLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter((l) => l !== language)
      : [...selectedLanguages, language]
    setSelectedLanguages(newLanguages)
    filterArticles(searchTerm, selectedTags, selectedDifficulty, selectedType, newLanguages)
  }

  const handleDifficultyChange = (difficulty: string) => {
    const newDifficulty = difficulty === selectedDifficulty ? "" : difficulty
    setSelectedDifficulty(newDifficulty)
    filterArticles(searchTerm, selectedTags, newDifficulty, selectedType, selectedLanguages)
  }

  const handleTypeChange = (type: string) => {
    const newType = type === selectedType ? "" : type
    setSelectedType(newType)
    filterArticles(searchTerm, selectedTags, selectedDifficulty, newType, selectedLanguages)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
    setSelectedDifficulty("")
    setSelectedType("")
    setSelectedLanguages([])
    onFilterChange(articles)
  }

  const hasActiveFilters =
    searchTerm.trim() || selectedTags.length > 0 || selectedDifficulty || selectedType || selectedLanguages.length > 0

  return (
    <div className="space-y-6 mb-8 p-6 bg-slate-800/30 rounded-xl border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-slate-100">Filter Technical Content</h3>
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
          placeholder="Search articles, technologies, or concepts..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500"
        />
      </div>

      {/* Quick Filters */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-slate-400" />
            <label className="text-sm font-medium text-slate-300">Difficulty Level</label>
          </div>
          <Select value={selectedDifficulty} onValueChange={handleDifficultyChange}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {allDifficulties.map((difficulty) => (
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
      </div>

      {/* Code Languages */}
      {allLanguages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-slate-400" />
            <h4 className="text-sm font-medium text-slate-300">Programming Languages & Technologies</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {allLanguages.map((language) => (
              <Badge
                key={language}
                variant={selectedLanguages.includes(language) ? "default" : "outline"}
                className={`cursor-pointer transition-colors font-mono text-xs ${
                  selectedLanguages.includes(language)
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border-slate-600"
                }`}
                onClick={() => handleLanguageToggle(language)}
              >
                {language}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Topic Tags */}
      {allTags.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300">Topics & Categories</h4>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                className={`cursor-pointer transition-colors text-xs ${
                  selectedTags.includes(tag)
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

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="text-sm text-slate-400 pt-2 border-t border-slate-700">
          <span className="font-medium">Active filters: </span>
          {searchTerm && <span>"{searchTerm}" </span>}
          {selectedDifficulty && <span>• {selectedDifficulty} </span>}
          {selectedType && <span>• {selectedType} </span>}
          {selectedTags.length > 0 && <span>• {selectedTags.join(", ")} </span>}
          {selectedLanguages.length > 0 && <span>• {selectedLanguages.join(", ")}</span>}
        </div>
      )}
    </div>
  )
}
