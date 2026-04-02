import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { CollectionPageSchema } from "@/components/collection-page-schema"
import { LEADERSHIP_CONFIG, TECHNICAL_CONFIG } from "@/lib/content-configs"
import { processContentDirectory } from "@/lib/content-api"
import { getDateTimestamp } from "@/lib/date-utils"

import { buildWritingItems } from "./build-writing-items"
import { WritingIndexClient } from "./WritingIndexClient"

interface WritingPageProps {
  searchParams?: Promise<{ search?: string }>
}

export default async function WritingPage({ searchParams }: WritingPageProps) {
  const [leadership, technical] = await Promise.all([
    processContentDirectory(LEADERSHIP_CONFIG),
    processContentDirectory(TECHNICAL_CONFIG),
  ])

  const items = buildWritingItems(leadership, technical).sort((a, b) => getDateTimestamp(b.date) - getDateTimestamp(a.date))
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const initialSearchQuery = resolvedSearchParams?.search?.trim() || ""
  const schemaItems = items.slice(0, 25).map((item) => ({
    title: item.title,
    url: `https://johnmunn.tech${item.href}`,
    date: item.date,
    excerpt: item.excerpt,
  }))

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1 bg-bg-base">
        <CollectionPageSchema
          name="Writing"
          description="Leadership and technical architecture writing. One body of work on teams, systems, tradeoffs, and complex challenges."
          url="https://johnmunn.tech/writing"
          about={["Engineering leadership", "Technical architecture", "AI systems", "Software strategy"]}
          items={schemaItems}
        />
        <WritingIndexClient items={items} initialSearchQuery={initialSearchQuery} />
      </main>
      <SiteFooter />
    </div>
  )
}
