"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"

import { DateText } from "@/components/date-text"
import { RuleHeading } from "@/components/design-system"

export interface WritingItem {
  slug: string
  title: string
  date: string
  excerpt?: string
  reading_time?: number
  series?: string
  theme: "Leadership" | "Technical"
  href: string
}

const themeFilterOptions = ["All", "Leadership", "Technical"] as const

interface WritingIndexClientProps {
  items: WritingItem[]
}

export function WritingIndexClient({ items }: WritingIndexClientProps) {
  const [themeFilter, setThemeFilter] = useState<typeof themeFilterOptions[number]>("All")
  const [searchQuery, setSearchQuery] = useState("")

  const byTheme = themeFilter === "All" ? items : items.filter((i) => i.theme === themeFilter)
  const query = searchQuery.trim().toLowerCase()
  const filtered = query
    ? byTheme.filter((i) => i.title.toLowerCase().includes(query) || (i.excerpt && i.excerpt.toLowerCase().includes(query)))
    : byTheme

  return (
    <section className="w-full py-16 md:py-24 lg:py-28">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <header className="mb-14">
          <RuleHeading as="h1" tone="page" className="mb-3">
            Writing
          </RuleHeading>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-text-body">
            Leadership, technical architecture, and the systems that connect them. One feed, one body of work.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link href="/series" className="text-accent-primary hover:text-accent-primary-hover">
              Browse series
            </Link>
            <Link href="/strategic-narratives" className="text-accent-primary hover:text-accent-primary-hover">
              Browse collections
            </Link>
          </div>
        </header>

        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-h-[44px] w-full rounded-lg border border-border-subtle bg-bg-paper py-3 pl-10 pr-4 text-base text-text-body placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30 sm:text-sm touch-manipulation"
              aria-label="Search articles"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {themeFilterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setThemeFilter(option)}
                aria-pressed={themeFilter === option}
                className={`min-h-[44px] rounded-lg px-4 py-3 text-sm font-medium transition-colors touch-manipulation ${
                  themeFilter === option
                    ? "bg-bg-soft text-text-strong"
                    : "bg-bg-soft/80 text-text-body hover:bg-bg-soft hover:text-text-strong"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-text-body">{searchQuery.trim() ? "No articles match your search." : "No pieces yet."}</p>
        ) : (
          <ul className="space-y-16">
            {filtered.map((item) => (
              <li key={`${item.theme}-${item.slug}`} className="border-b border-border-subtle pb-16 last:border-b-0 last:pb-0">
                <Link href={item.href} className="group block">
                  <h2 className="mb-2 text-2xl font-bold leading-snug tracking-tight text-text-strong transition-colors group-hover:text-accent-primary">
                    {item.title}
                  </h2>
                  {item.excerpt ? (
                    <p className="mb-2 line-clamp-2 text-[0.9375rem] leading-relaxed text-text-body">{item.excerpt}</p>
                  ) : null}
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <DateText
                      value={item.date}
                      options={{
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }}
                    />
                    {item.reading_time ? <span>{item.reading_time} min read</span> : null}
                    {item.series ? <span>Series: {item.series}</span> : null}
                    <span className="inline-flex items-center gap-1 text-text-muted transition-all group-hover:gap-2 group-hover:text-accent-primary">
                      Read more
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
