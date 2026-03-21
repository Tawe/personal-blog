"use client"

import { useMemo, useState } from "react"
import { Crown, MapPinned, Search, X } from "lucide-react"

import { CollectionArticleCard, CollectionBrowserPanel, CollectionEmptyState, CollectionResultCount, TogglePillGroup } from "@/components/collection-browser"
import { EditorialPill } from "@/components/design-system"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getDateTimestamp } from "@/lib/date-utils"

interface ArtuminContentMetadata {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags: string[]
  reading_time?: number
  type?: string
  categories?: string[]
  region?: string
  status?: string
  image?: string
  featured_image?: string
}

interface WorldOfArtuminClientProps {
  articles: ArtuminContentMetadata[]
  availableTags: string[]
}

function formatLabel(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function getStatusTone(status?: string): "neutral" | "success" | "warm" {
  switch ((status || "").toLowerCase()) {
    case "complete":
    case "published":
      return "success"
    case "in-progress":
      return "warm"
    default:
      return "neutral"
  }
}

export function WorldOfArtuminClient({ articles, availableTags }: WorldOfArtuminClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAllTopics, setShowAllTopics] = useState(false)
  const TOPICS_LIMIT = 20

  const filteredArticles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return [...articles]
      .filter((article) => {
        const categories = Array.isArray(article.categories) ? article.categories : []
        const matchesSearch =
          query === "" ||
          article.title.toLowerCase().includes(query) ||
          article.excerpt?.toLowerCase().includes(query) ||
          article.region?.toLowerCase().includes(query) ||
          categories.some((category) => category.toLowerCase().includes(query))

        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.every((tag) => article.tags.includes(tag) || categories.includes(tag))

        return matchesSearch && matchesTags
      })
      .sort((a, b) => getDateTimestamp(b.date) - getDateTimestamp(a.date))
  }, [articles, searchTerm, selectedTags])

  const hasActiveFilters = searchTerm.trim() !== "" || selectedTags.length > 0

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((current) => (current.includes(tag) ? current.filter((value) => value !== tag) : [...current, tag]))
  }

  return (
    <div className="space-y-8">
      <CollectionBrowserPanel>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-accent-primary" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-text-strong">Explore Artumin</h3>
          </div>
          {hasActiveFilters ? (
            <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="text-text-muted hover:text-accent-primary">
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          ) : null}
        </div>

        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
          <Input
            type="text"
            placeholder="Search stories, characters, locations..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="border-border-subtle bg-bg-paper pl-10 text-text-body placeholder:text-text-muted"
            aria-label="Search Artumin entries"
          />
        </div>

        {availableTags.length > 0 ? (
          <TogglePillGroup
            label="Categories and Themes"
            items={availableTags}
            selected={selectedTags}
            onToggle={toggleTag}
            limit={TOPICS_LIMIT}
            showAll={showAllTopics}
            onToggleShowAll={() => setShowAllTopics((value) => !value)}
          />
        ) : null}

        <CollectionResultCount filteredCount={filteredArticles.length} totalCount={articles.length} noun="entries" />
      </CollectionBrowserPanel>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => {
          const categories = Array.isArray(article.categories) ? article.categories : []
          const taxonomy = Array.from(new Set([...categories, ...article.tags]))

          return (
            <CollectionArticleCard
              key={article.slug}
              href={`/strategic-narratives/world-of-artumin/${article.slug}`}
              title={article.title}
              excerpt={article.excerpt}
              date={article.date}
              readingTime={article.reading_time}
              image={article.image}
              featuredImage={article.featured_image}
              pills={
                <>
                  {article.type ? (
                    <EditorialPill tone="accent" className="normal-case tracking-normal">
                      {formatLabel(article.type)}
                    </EditorialPill>
                  ) : null}
                  {article.status ? (
                    <EditorialPill tone={getStatusTone(article.status)} className="normal-case tracking-normal">
                      {formatLabel(article.status)}
                    </EditorialPill>
                  ) : null}
                </>
              }
              metaExtra={
                article.region ? (
                  <div className="mb-3 flex items-center gap-2 text-sm text-text-muted">
                    <MapPinned className="h-3 w-3" aria-hidden="true" />
                    <EditorialPill tone="neutral" className="normal-case tracking-normal">
                      {article.region}
                    </EditorialPill>
                  </div>
                ) : undefined
              }
              footer={
                taxonomy.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {taxonomy.slice(0, 3).map((item) => (
                      <EditorialPill key={item} tone="neutral" className="normal-case tracking-normal">
                        {item}
                      </EditorialPill>
                    ))}
                    {taxonomy.length > 3 ? (
                      <EditorialPill tone="neutral" className="normal-case tracking-normal">
                        +{taxonomy.length - 3}
                      </EditorialPill>
                    ) : null}
                  </div>
                ) : undefined
              }
            />
          )
        })}
      </div>

      {filteredArticles.length === 0 ? (
        <CollectionEmptyState title="No Artumin entries found" body="Try adjusting your search or changing the selected themes." />
      ) : null}
    </div>
  )
}
