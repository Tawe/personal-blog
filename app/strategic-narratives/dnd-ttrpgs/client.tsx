"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Search, X, Dice6, ExternalLink } from "lucide-react"
import Link from "next/link"
import { ExclusiveRibbon } from "@/components/exclusive-ribbon"
import { formatDisplayDate } from "@/lib/date-utils"

const contentTypes = ["thought-piece", "mechanic", "monster", "magic-item", "npc", "adventure", "product"]

interface DndContentMetadata {
  slug: string
  title: string
  excerpt: string
  date: string
  reading_time: number
  tags: string[]
  system: string
  type: string
  availability: string
  playtested: boolean
  featured_image?: string
  external_url?: string
  website_exclusive?: boolean
}

interface DndTtrpgsClientProps {
  articles: DndContentMetadata[]
  tags: string[]
  systems: string[]
}

export function DndTtrpgsClient({ articles, tags, systems }: DndTtrpgsClientProps) {
  const [filteredArticles, setFilteredArticles] = useState<DndContentMetadata[]>(articles)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedSystems, setSelectedSystems] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedSystem, setSelectedSystem] = useState<string | undefined>(undefined)
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined)
  const [playtestedOnly, setPlaytestedOnly] = useState(false)
  const [showAllTopics, setShowAllTopics] = useState(false)
  const TOPICS_LIMIT = 20

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    filterArticles(value, selectedTags, selectedSystems, selectedTypes)
  }

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    setSelectedTags(newTags)
    filterArticles(searchTerm, newTags, selectedSystems, selectedTypes)
  }

  const handleSystemToggle = (system: string) => {
    const newSystems = selectedSystems.includes(system)
      ? selectedSystems.filter((s) => s !== system)
      : [...selectedSystems, system]
    setSelectedSystems(newSystems)
    filterArticles(searchTerm, selectedTags, newSystems, selectedTypes)
  }

  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type) ? selectedTypes.filter((t) => t !== type) : [...selectedTypes, type]
    setSelectedTypes(newTypes)
    filterArticles(searchTerm, selectedTags, selectedSystems, newTypes)
  }

  const filterArticles = (search: string, tags: string[], systems: string[], types: string[]) => {
    let filtered = [...articles]

    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((article) => {
        const titleMatch = article.title?.toLowerCase().includes(searchLower) || false
        const excerptMatch = article.excerpt?.toLowerCase().includes(searchLower) || false
        const tagMatch = (article.tags || []).some((tag) => tag.toLowerCase().includes(searchLower))
        return titleMatch || excerptMatch || tagMatch
      })
    }

    if (tags.length > 0) {
      filtered = filtered.filter((article) => tags.every((tag) => (article.tags || []).includes(tag)))
    }

    if (systems.length > 0) {
      filtered = filtered.filter((article) => systems.includes(article.system))
    }

    if (types.length > 0) {
      filtered = filtered.filter((article) => types.includes(article.type))
    }

    if (playtestedOnly) {
      filtered = filtered.filter((article) => article.playtested === true)
    }

    setFilteredArticles(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
    setSelectedSystems([])
    setSelectedTypes([])
    setSelectedSystem(undefined)
    setSelectedType(undefined)
    setPlaytestedOnly(false)
    setFilteredArticles(articles)
  }

  const hasActiveFilters =
    searchTerm.trim() ||
    selectedTags.length > 0 ||
    selectedSystems.length > 0 ||
    selectedTypes.length > 0 ||
    selectedSystem ||
    selectedType ||
    playtestedOnly

  // No emoji icons on cards

  // Availability not displayed on cards

  return (
    <div className="space-y-8">
      {/* Filter Section */}
      <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Dice6 className="h-5 w-5 text-red-400" />
            <h3 className="text-lg font-semibold text-slate-100">Filter RPG Content</h3>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-400">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search mechanics, monsters, adventures..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100"
            aria-label="Search articles"
          />
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">System</label>
            <Select value={selectedSystem} onValueChange={setSelectedSystem}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                <SelectValue placeholder="All systems" />
              </SelectTrigger>
              <SelectContent>
                {systems.map((system) => (
                  <SelectItem key={system} value={system}>
                    {system.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Content Type</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Playtested Filter */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={playtestedOnly}
              onChange={(e) => setPlaytestedOnly(e.target.checked)}
              className="rounded border-slate-600 bg-slate-800"
            />
            Show only playtested content
          </label>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {(showAllTopics ? tags : tags.slice(0, TOPICS_LIMIT)).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full"
                >
                  <Badge
                    variant={selectedTags.includes(tag) ? "default" : "secondary"}
                    className={`cursor-pointer transition-colors text-xs ${
                      selectedTags.includes(tag)
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                    }`}
                  >
                    {tag}
                  </Badge>
                </button>
              ))}
            </div>
            {tags.length > TOPICS_LIMIT && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllTopics(!showAllTopics)}
                className="text-slate-400 hover:text-slate-200 mt-2"
              >
                {showAllTopics ? "Show less" : `Show more (${tags.length - TOPICS_LIMIT} more)`}
              </Button>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="text-sm text-slate-400 mt-4">
          Showing {filteredArticles.length} of {articles.length} items
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Card
            key={article.slug}
            className="bg-slate-800/50 border-slate-600 hover:border-red-500/50 transition-all duration-300 overflow-hidden relative"
          >
            {/* Website Exclusive Ribbon */}
            {article.website_exclusive && <ExclusiveRibbon />}
            {article.featured_image && (
              <div className="aspect-video w-full overflow-hidden relative">
                <img
                  src={article.featured_image || "/placeholder.svg"}
                  alt=""
                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                  {article.system.toUpperCase()}
                </Badge>
                {/* availability removed */}
              </div>
              <CardTitle className="text-slate-100 text-lg leading-tight">
                {article.external_url ? (
                  <a
                    href={article.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    {article.title}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                ) : (
                  <Link
                    href={`/strategic-narratives/dnd-ttrpgs/${article.slug}`}
                    className="hover:text-red-400 transition-colors"
                  >
                    {article.title}
                  </Link>
                )}
              </CardTitle>
              <CardDescription className="text-slate-400">{article.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDisplayDate(article.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>{article.reading_time} min</span>
                </div>
              </div>

              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {tag}
                    </Badge>
                  ))}
                  {article.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                      +{article.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-2">No content found</div>
          <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
