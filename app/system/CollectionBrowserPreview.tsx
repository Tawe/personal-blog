"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"

import { CollectionBrowserPanel, CollectionResultCount, TogglePillGroup } from "@/components/collection-browser"
import { Button } from "@/components/ui/button"

interface CollectionBrowserPreviewProps {
  previewTags: string[]
}

export function CollectionBrowserPreview({ previewTags }: CollectionBrowserPreviewProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(["Architecture", "Systems"])
  const [showAll, setShowAll] = useState(false)

  const toggleTag = (tag: string) => {
    setSelectedTags((current) => (current.includes(tag) ? current.filter((value) => value !== tag) : [...current, tag]))
  }

  return (
    <CollectionBrowserPanel>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-strong">Filter panel</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-text-muted hover:text-accent-primary"
          onClick={() => setSelectedTags([])}
        >
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value="Architecture"
          readOnly
          aria-label="Collection browser search example"
          className="w-full rounded-md border border-border-subtle bg-bg-paper py-2 pl-10 pr-3 text-sm text-text-body"
        />
      </div>
      <TogglePillGroup
        label="Topics"
        items={previewTags}
        selected={selectedTags}
        onToggle={toggleTag}
        limit={4}
        showAll={showAll}
        onToggleShowAll={() => setShowAll((value) => !value)}
      />
      <CollectionResultCount filteredCount={12} totalCount={38} noun="entries" />
    </CollectionBrowserPanel>
  )
}
