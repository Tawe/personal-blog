"use client"

import { useMemo, useState } from "react"
import { Dice6, ExternalLink, Search, X } from "lucide-react"

import { EditorialPill } from "@/components/design-system"
import { ExclusiveRibbon } from "@/components/exclusive-ribbon"
import {
  CollectionArticleCard,
  CollectionBrowserPanel,
  CollectionEmptyState,
  CollectionResultCount,
  TogglePillGroup,
} from "@/components/collection-browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const contentTypes = ["thought-piece", "mechanic", "monster", "magic-item", "npc", "adventure", "product"] as const

interface DndContentMetadata {
  slug: string
  title: string
  excerpt: string
  date: string
  reading_time?: number
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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedSystems, setSelectedSystems] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [playtestedOnly, setPlaytestedOnly] = useState(false)
  const [showAllTopics, setShowAllTopics] = useState(false)
  const TOPICS_LIMIT = 20
  const playtestedCheckboxId = "playtested-only"

  const filteredArticles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return articles.filter((article) => {
      const matchesSearch =
        query === "" ||
        article.title.toLowerCase().includes(query) ||
        article.excerpt?.toLowerCase().includes(query) ||
        article.tags.some((tag) => tag.toLowerCase().includes(query))

      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => article.tags.includes(tag))
      const matchesSystems = selectedSystems.length === 0 || selectedSystems.includes(article.system)
      const matchesTypes = selectedTypes.length === 0 || selectedTypes.includes(article.type)
      const matchesPlaytested = !playtestedOnly || article.playtested === true

      return matchesSearch && matchesTags && matchesSystems && matchesTypes && matchesPlaytested
    })
  }, [articles, playtestedOnly, searchTerm, selectedSystems, selectedTags, selectedTypes])

  const hasActiveFilters =
    searchTerm.trim() !== "" || selectedTags.length > 0 || selectedSystems.length > 0 || selectedTypes.length > 0 || playtestedOnly

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
    setSelectedSystems([])
    setSelectedTypes([])
    setPlaytestedOnly(false)
  }

  const toggleSelection = (value: string, selected: string[], setSelected: (value: string[]) => void) => {
    setSelected(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value])
  }

  return (
    <div className="space-y-8">
      <CollectionBrowserPanel>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dice6 className="h-5 w-5 text-accent-primary" />
            <h3 className="text-lg font-semibold text-text-strong">Filter RPG Content</h3>
          </div>
          {hasActiveFilters ? (
            <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="text-text-muted hover:text-accent-primary">
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          ) : null}
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            type="text"
            placeholder="Search mechanics, monsters, adventures..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="border-border-subtle bg-bg-paper pl-10 text-text-body placeholder:text-text-muted"
            aria-label="Search articles"
          />
        </div>

        <div className="mb-4 grid gap-4 md:grid-cols-2">
          <TogglePillGroup
            label="System"
            items={systems}
            selected={selectedSystems}
            onToggle={(value) => toggleSelection(value, selectedSystems, setSelectedSystems)}
            formatLabel={(value) => value.toUpperCase()}
          />

          <TogglePillGroup
            label="Content Type"
            items={[...contentTypes]}
            selected={selectedTypes}
            onToggle={(value) => toggleSelection(value, selectedTypes, setSelectedTypes)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor={playtestedCheckboxId} className="flex items-center gap-2 text-sm text-text-body">
            <input
              id={playtestedCheckboxId}
              type="checkbox"
              checked={playtestedOnly}
              onChange={(event) => setPlaytestedOnly(event.target.checked)}
              className="rounded border-border-subtle bg-bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            Show only playtested content
          </label>
        </div>

        {tags.length > 0 ? (
          <TogglePillGroup
            label="Categories"
            items={tags}
            selected={selectedTags}
            onToggle={(value) => toggleSelection(value, selectedTags, setSelectedTags)}
            limit={TOPICS_LIMIT}
            showAll={showAllTopics}
            onToggleShowAll={() => setShowAllTopics((value) => !value)}
          />
        ) : null}

        <CollectionResultCount filteredCount={filteredArticles.length} totalCount={articles.length} noun="items" />
      </CollectionBrowserPanel>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <CollectionArticleCard
            key={article.slug}
            href={article.external_url || `/strategic-narratives/dnd-ttrpgs/${article.slug}`}
            hrefExternal={Boolean(article.external_url)}
            title={article.title}
            excerpt={article.excerpt}
            date={article.date}
            readingTime={article.reading_time}
            featuredImage={article.featured_image}
            overlay={article.website_exclusive ? <ExclusiveRibbon /> : undefined}
            pills={
              <>
                <EditorialPill tone="accent" className="normal-case tracking-normal">
                  {article.system.toUpperCase()}
                </EditorialPill>
                <EditorialPill tone="neutral" className="normal-case tracking-normal">
                  {article.type}
                </EditorialPill>
                {article.external_url ? <ExternalLink className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" /> : null}
              </>
            }
            footer={
              article.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 3).map((tag) => (
                    <EditorialPill key={tag} tone="neutral" className="normal-case tracking-normal">
                      {tag}
                    </EditorialPill>
                  ))}
                  {article.tags.length > 3 ? (
                    <EditorialPill tone="neutral" className="normal-case tracking-normal">
                      +{article.tags.length - 3}
                    </EditorialPill>
                  ) : null}
                </div>
              ) : undefined
            }
          />
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <CollectionEmptyState title="No content found" body="Try adjusting your search or filter criteria." />
      ) : null}
    </div>
  )
}
