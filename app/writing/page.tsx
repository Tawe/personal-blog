"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"

interface WritingItem {
  slug: string
  title: string
  date: string
  excerpt?: string
  reading_time?: number
  theme: "Leadership" | "Technical"
  href: string
}

const themeFilterOptions = ["All", "Leadership", "Technical"] as const

export default function WritingPage() {
  const [items, setItems] = useState<WritingItem[]>([])
  const [themeFilter, setThemeFilter] = useState<typeof themeFilterOptions[number]>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadership, technical] = await Promise.all([
          fetch("/api/content/leadership").then((r) => r.json()),
          fetch("/api/content/technical").then((r) => r.json()),
        ])

        const combined: WritingItem[] = [
          ...(leadership.articles || []).map((a: { slug: string; title: string; date: string; excerpt?: string; reading_time?: number }) => ({
            slug: a.slug,
            title: a.title,
            date: a.date,
            excerpt: a.excerpt,
            reading_time: a.reading_time,
            theme: "Leadership" as const,
            href: `/strategic-narratives/leadership-strategy/${a.slug}`,
          })),
          ...(technical.articles || []).map((a: { slug: string; title: string; date: string; excerpt?: string; reading_time?: number }) => ({
            slug: a.slug,
            title: a.title,
            date: a.date,
            excerpt: a.excerpt,
            reading_time: a.reading_time,
            theme: "Technical" as const,
            href: `/strategic-narratives/technical-architecture/${a.slug}`,
          })),
        ]

        combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setItems(combined)
      } catch (error) {
        console.error("Error fetching writing:", error)
        setItems([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const byTheme = themeFilter === "All" ? items : items.filter((i) => i.theme === themeFilter)
  const query = searchQuery.trim().toLowerCase()
  const filtered = query
    ? byTheme.filter(
        (i) =>
          i.title.toLowerCase().includes(query) ||
          (i.excerpt && i.excerpt.toLowerCase().includes(query))
      )
    : byTheme

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-bg-base">
        <section className="w-full py-16 md:py-24 lg:py-28">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto">
            <header className="mb-14">
              <h1 className="section-title text-3xl font-bold tracking-tight text-text-strong mb-3 w-fit">Writing</h1>
              <p className="text-lg text-text-body leading-relaxed mt-3 max-w-2xl">
                Leadership, technical architecture, and the systems that connect them. One feed, one body of work.
              </p>
            </header>

            {/* Search + theme filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-12">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                <input
                  type="search"
                  placeholder="Search articles…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 min-h-[44px] rounded-lg border border-border-subtle bg-bg-paper text-text-body placeholder:text-text-muted text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary touch-manipulation"
                  aria-label="Search articles"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {themeFilterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setThemeFilter(option)}
                  className={`px-4 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors touch-manipulation ${
                    themeFilter === option
                      ? "bg-bg-soft text-text-strong"
                      : "bg-bg-soft/80 text-text-body hover:text-text-strong hover:bg-bg-soft"
                  }`}
                >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <p className="text-text-body">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-text-body">
                {searchQuery.trim() ? "No articles match your search." : "No pieces yet."}
              </p>
            ) : (
              <ul className="space-y-16">
                {filtered.map((item) => (
                  <li key={`${item.theme}-${item.slug}`} className="border-b border-border-subtle pb-16 last:border-b-0 last:pb-0">
                    <Link href={item.href} className="group block">
                      <h2 className="text-[1.5rem] font-semibold text-text-strong group-hover:text-accent-primary transition-colors mb-2 leading-snug">
                        {item.title}
                      </h2>
                      {item.excerpt && (
                        <p className="text-text-body text-[0.9375rem] leading-relaxed mb-2 line-clamp-2">{item.excerpt}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-text-muted">
                        <time>
                          {new Date(item.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                        {item.reading_time && <span>{item.reading_time} min read</span>}
                        <span className="inline-flex items-center gap-1 group-hover:gap-2 transition-all group-hover:text-accent-primary text-text-muted">
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
      </main>
      <SiteFooter />
    </div>
  )
}
