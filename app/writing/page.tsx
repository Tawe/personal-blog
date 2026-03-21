import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { LEADERSHIP_CONFIG, TECHNICAL_CONFIG } from "@/lib/content-configs"
import { processContentDirectory } from "@/lib/content-api"
import { getDateTimestamp } from "@/lib/date-utils"

import { buildWritingItems } from "./build-writing-items"
import { WritingIndexClient } from "./WritingIndexClient"

export default async function WritingPage() {
  const [leadership, technical] = await Promise.all([
    processContentDirectory(LEADERSHIP_CONFIG),
    processContentDirectory(TECHNICAL_CONFIG),
  ])

  const items = buildWritingItems(leadership, technical).sort((a, b) => getDateTimestamp(b.date) - getDateTimestamp(a.date))

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1 bg-bg-base">
        <WritingIndexClient items={items} />
      </main>
      <SiteFooter />
    </div>
  )
}
