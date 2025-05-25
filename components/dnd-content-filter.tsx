"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Filter, Dice6, Sword, Users } from "lucide-react"
import type { DndContentMetadata } from "@/lib/dnd-content"

interface DndContentFilterProps {
  content: DndContentMetadata[]
  allTypes: string[]
  allSystems: string[]
  allTags: string[]
  allAvailability: string[]
  onFilterChange: (filteredContent: DndContentMetadata[]) => void
}

export function DndContentFilter({
  content,
  allTypes,
  allSystems,
  allTags,
  allAvailability,
  onFilterChange,
}: DndContentFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedSystem, setSelectedSystem] = useState<string>("")
  const [selectedAvailability, setSelectedAvailability] = useState<string>("")
  const [playtestedOnly, setPlaytestedOnly] = useState(false)

  const filterContent = (
    search: string,
    tags: string[],
    type: string,
    system: string,
    availability: string,
    playtested: boolean,
  ) => {
    let filtered = content

    // Filter by search term
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.excerpt?.toLowerCase().includes(searchLower) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          item.system.toLowerCase().includes(searchLower),
      )
    }

    // Filter by tags
    if (tags.length > 0) {
      filtered = filtered.filter((item) => tags.every((tag) => item.tags.includes(tag)))
    }

    // Filter by type
    if (type) {
      filtered = filtered.filter((item) => item.type === type)
    }

    // Filter by system
    if (system) {
      filtered = filtered.filter((item) => item.system === system)
    }

    // Filter by availability
    if (availability) {
      filtered = filtered.filter((item) => item.availability === availability)
    }

    // Filter by playtested
    if (playtested) {
      filtered = filtered.filter((item) => item.playtested)
    }

    onFilterChange(filtered)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    filterContent(value, selectedTags, selectedType, selectedSystem, selectedAvailability, playtestedOnly)
  }

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    setSelectedTags(newTags)
    filterContent(searchTerm, newTags, selectedType, selectedSystem, selectedAvailability, playtestedOnly)
  }

  const handleTypeChange = (type: string) => {
    const newType = type === selectedType ? "" : type
    setSelectedType(newType)
    filterContent(searchTerm, selectedTags, newType, selectedSystem, selectedAvailability, playtestedOnly)
  }

  const handleSystemChange = (system: string) => {
    const newSystem = system === selectedSystem ? "" : system
    setSelectedSystem(newSystem)
    filterContent(searchTerm, selectedTags, selectedType, newSystem, selectedAvailability, playtestedOnly)
  }

  const handleAvailabilityChange = (availability: string) => {
    const newAvailability = availability === selectedAvailability ? "" : availability
    setSelectedAvailability(newAvailability)
    filterContent(searchTerm, selectedTags, selectedType, selectedSystem, newAvailability, playtestedOnly)
  }

  const handlePlaytestedToggle = () => {
    const newPlaytested = !playtestedOnly
    setPlaytestedOnly(newPlaytested)
    filterContent(searchTerm, selectedTags, selectedType, selectedSystem, selectedAvailability, newPlaytested)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
    setSelectedType("")
    setSelectedSystem("")
    setSelectedAvailability("")
    setPlaytestedOnly(false)
    onFilterChange(content)
  }

  const hasActiveFilters =
    searchTerm.trim() ||
    selectedTags.length > 0 ||
    selectedType ||
    selectedSystem ||
    selectedAvailability ||
    playtestedOnly

  return (
    <div className="space-y-6 mb-8 p-6 bg-gradient-to-r from-slate-800/30 to-red-900/20 rounded-xl border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-red-400" />
        <h3 className="text-lg font-semibold text-slate-100">Filter RPG Content</h3>
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
          placeholder="Search mechanics, monsters, adventures..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-red-500"
        />
      </div>

      {/* Quick Filters */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Dice6 className="h-4 w-4 text-slate-400" />
            <label className="text-sm font-medium text-slate-300">Content Type</label>
          </div>
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {allTypes.map((type) => (
                <SelectItem key={type} value={type} className="text-slate-100">
                  {type === "thought-piece"
                    ? "Analysis"
                    : type === "magic-item"
                      ? "Magic Item"
                      : type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sword className="h-4 w-4 text-slate-400" />
            <label className="text-sm font-medium text-slate-300">System</label>
          </div>
          <Select value={selectedSystem} onValueChange={handleSystemChange}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
              <SelectValue placeholder="All systems" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {allSystems.map((system) => (
                <SelectItem key={system} value={system} className="text-slate-100">
                  {system === "5e"
                    ? "D&D 5e"
                    : system === "system-agnostic"
                      ? "System Agnostic"
                      : system.charAt(0).toUpperCase() + system.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-400" />
            <label className="text-sm font-medium text-slate-300">Availability</label>
          </div>
          <Select value={selectedAvailability} onValueChange={handleAvailabilityChange}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
              <SelectValue placeholder="All content" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {allAvailability.map((availability) => (
                <SelectItem key={availability} value={availability} className="text-slate-100">
                  {availability.charAt(0).toUpperCase() + availability.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Quality Filter</label>
          <Button
            variant={playtestedOnly ? "default" : "outline"}
            size="sm"
            onClick={handlePlaytestedToggle}
            className={`w-full ${
              playtestedOnly
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "border-slate-600 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Playtested Only
          </Button>
        </div>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300">Tags & Categories</h4>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                className={`cursor-pointer transition-colors text-xs ${
                  selectedTags.includes(tag)
                    ? "bg-red-600 hover:bg-red-700 text-white"
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
          {selectedType && <span>• {selectedType} </span>}
          {selectedSystem && <span>• {selectedSystem} </span>}
          {selectedAvailability && <span>• {selectedAvailability} </span>}
          {playtestedOnly && <span>• playtested </span>}
          {selectedTags.length > 0 && <span>• {selectedTags.join(", ")}</span>}
        </div>
      )}
    </div>
  )
}
