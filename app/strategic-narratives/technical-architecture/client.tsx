"use client"

import { useMemo, useState } from "react"
import { Code, Search, X } from "lucide-react"

import { EditorialPill } from "@/components/design-system"
import {
  CollectionArticleCard,
  CollectionBrowserPanel,
  CollectionEmptyState,
  CollectionResultCount,
  TogglePillGroup,
} from "@/components/collection-browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TechnicalArticleMetadata {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags: string[]
  reading_time?: number
  difficulty?: "beginner" | "intermediate" | "advanced"
  type?: "tutorial" | "guide" | "analysis" | "documentation"
  code_languages?: string[]
  image?: string
  featured_image?: string
}

interface TechnicalArchitectureClientProps {
  articles: TechnicalArticleMetadata[]
  tags: string[]
}

export function TechnicalArchitectureClient({ articles, tags }: TechnicalArchitectureClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAllTopics, setShowAllTopics] = useState(false)
  const TOPICS_LIMIT = 20

  const filteredArticles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return articles.filter((article) => {
      const matchesSearch =
        query === "" ||
        article.title.toLowerCase().includes(query) ||
        article.excerpt?.toLowerCase().includes(query) ||
        article.code_languages?.some((lang) => lang.toLowerCase().includes(query))

      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => article.tags.includes(tag))

      return matchesSearch && matchesTags
    })
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
          <h3 className="text-lg font-semibold text-text-strong">Filter Technical Articles</h3>
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
            placeholder="Search articles, technologies..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search articles"
            className="border-border-subtle bg-bg-paper pl-10 text-text-body placeholder:text-text-muted"
          />
        </div>

        {tags.length > 0 ? (
          <TogglePillGroup
            label="Technologies & Topics"
            items={tags}
            selected={selectedTags}
            onToggle={toggleTag}
            limit={TOPICS_LIMIT}
            showAll={showAllTopics}
            onToggleShowAll={() => setShowAllTopics((value) => !value)}
          />
        ) : null}

        <CollectionResultCount filteredCount={filteredArticles.length} totalCount={articles.length} noun="articles" />
      </CollectionBrowserPanel>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <CollectionArticleCard
            key={article.slug}
            href={`/strategic-narratives/technical-architecture/${article.slug}`}
            title={article.title}
            excerpt={article.excerpt}
            date={article.date}
            readingTime={article.reading_time}
            image={article.image}
            featuredImage={article.featured_image}
            pills={
              <>
                <EditorialPill tone="accent" className="normal-case tracking-normal">
                  Technical
                </EditorialPill>
                {article.difficulty ? (
                  <EditorialPill tone="neutral" className="normal-case tracking-normal">
                    {article.difficulty}
                  </EditorialPill>
                ) : null}
              </>
            }
            metaExtra={
              article.code_languages && article.code_languages.length > 0 ? (
                <div className="mb-3 flex items-center gap-2 text-sm text-text-muted">
                  <Code className="h-3 w-3" />
                  <div className="flex flex-wrap gap-1">
                    {article.code_languages.slice(0, 3).map((language) => (
                      <EditorialPill key={language} tone="neutral" className="normal-case tracking-normal">
                        {language}
                      </EditorialPill>
                    ))}
                    {article.code_languages.length > 3 ? (
                      <EditorialPill tone="neutral" className="normal-case tracking-normal">
                        +{article.code_languages.length - 3}
                      </EditorialPill>
                    ) : null}
                  </div>
                </div>
              ) : undefined
            }
            footer={
              article.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 2).map((tag) => (
                    <EditorialPill key={tag} tone="neutral" className="normal-case tracking-normal">
                      {tag}
                    </EditorialPill>
                  ))}
                  {article.tags.length > 2 ? (
                    <EditorialPill tone="neutral" className="normal-case tracking-normal">
                      +{article.tags.length - 2}
                    </EditorialPill>
                    ) : null}
                </div>
              ) : undefined
            }
          />
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <CollectionEmptyState title="No articles found" body="Try adjusting your search or filter criteria." />
      ) : null}
    </div>
  )
}
