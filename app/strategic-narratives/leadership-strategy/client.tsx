"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { EditorialPill } from "@/components/design-system"
import {
  CollectionArticleCard,
  CollectionBrowserPanel,
  CollectionEmptyState,
  CollectionResultCount,
  TogglePillGroup,
} from "@/components/collection-browser"

interface ArticleMetadata {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags: string[]
  reading_time?: number
  image?: string
  featured_image?: string
}

interface LeadershipStrategyClientProps {
  articles: ArticleMetadata[]
  tags: string[]
}

export function LeadershipStrategyClient({ articles, tags }: LeadershipStrategyClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAllTopics, setShowAllTopics] = useState(false)
  const TOPICS_LIMIT = 20

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => article.tags.includes(tag))

      return matchesSearch && matchesTags
    })
  }, [articles, searchTerm, selectedTags])

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
  }

  const hasActiveFilters = searchTerm.trim() !== "" || selectedTags.length > 0

  return (
    <div className="space-y-8">
      <CollectionBrowserPanel>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-strong">Filter Articles</h3>
          {hasActiveFilters && (
            <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="text-text-muted hover:text-accent-primary">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search articles"
            className="pl-10 border-border-subtle bg-bg-paper text-text-body placeholder:text-text-muted"
          />
        </div>

        {tags.length > 0 && (
          <TogglePillGroup
            label="Topics"
            items={tags}
            selected={selectedTags}
            onToggle={handleTagToggle}
            limit={TOPICS_LIMIT}
            showAll={showAllTopics}
            onToggleShowAll={() => setShowAllTopics(!showAllTopics)}
          />
        )}

        <CollectionResultCount filteredCount={filteredArticles.length} totalCount={articles.length} noun="articles" />
      </CollectionBrowserPanel>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <CollectionArticleCard
            key={article.slug}
            href={`/strategic-narratives/leadership-strategy/${article.slug}`}
            title={article.title}
            excerpt={article.excerpt}
            date={article.date}
            readingTime={article.reading_time}
            image={article.image}
            featuredImage={!article.image ? article.featured_image : undefined}
            pills={
              <EditorialPill tone="accent" className="normal-case tracking-normal">
                Leadership
              </EditorialPill>
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

      {filteredArticles.length === 0 && (
        <CollectionEmptyState title="No articles found" body="Try adjusting your search or filter criteria" />
      )}
    </div>
  )
}
