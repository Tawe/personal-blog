import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, BookOpen, Target, Users } from "lucide-react"

import { CollectionPageSchema } from "@/components/collection-page-schema"
import { ContentLayout } from "@/components/content-layout"
import { EditorialSurface, PageSection, SectionIntro } from "@/components/design-system"
import { Button } from "@/components/ui/button"
import { processContentDirectory } from "@/lib/content-api"
import { LEADERSHIP_CONFIG } from "@/lib/content-configs"
import { buildMetadata } from "@/lib/seo-metadata"
import { getDateTimestamp } from "@/lib/date-utils"
import { LeadershipStrategyClient } from "./client"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams
  const hasQueryParams = Object.keys(params).length > 0
  
  // If there are query parameters (like ?tag=...), set noindex and canonicalize to base URL
  if (hasQueryParams) {
    return buildMetadata({
      title: "Leadership & Strategy | John Munn",
      description: "Insights on building teams, driving innovation, and leading through complexity",
      path: "/strategic-narratives/leadership-strategy",
      keywords: ["leadership strategy", "engineering leadership"],
      noindex: true,
    })
  }

  // Base page metadata
  return buildMetadata({
    title: "Leadership & Strategy | John Munn",
    description: "Insights on building teams, driving innovation, and leading through complexity",
    path: "/strategic-narratives/leadership-strategy",
    keywords: ["leadership strategy", "technical leadership", "engineering management"],
  })
}

export default async function LeadershipStrategyPage() {
  const articles = await processContentDirectory(LEADERSHIP_CONFIG)
  const tags = Array.from(new Set(articles.flatMap((article) => article.tags || []))).sort()
  const schemaItems = [...articles]
    .sort((a, b) => getDateTimestamp(b.date) - getDateTimestamp(a.date))
    .slice(0, 24)
    .map((article) => ({
      title: article.title,
      url: `https://johnmunn.tech/strategic-narratives/leadership-strategy/${article.slug}`,
      date: article.date,
      excerpt: article.excerpt,
    }))

  return (
    <ContentLayout>
      <CollectionPageSchema
        name="Leadership & Strategy"
        description="Engineering leadership and strategy articles on team design, organizational judgment, decision-making, and leadership under pressure."
        url="https://johnmunn.tech/strategic-narratives/leadership-strategy"
        about={["Engineering leadership", "Technical leadership", "Organizational design", "Leadership strategy"]}
        items={schemaItems}
      />
      <div className="space-y-16 md:space-y-20">
        <section className="mx-auto max-w-5xl">
          <div className="mb-8">
            <Button variant="ghost" className="w-fit px-0 text-text-body hover:text-accent-primary" asChild>
              <Link href="/strategic-narratives">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Writing Collections
              </Link>
            </Button>
          </div>

          <div className="space-y-6 text-center">
            <p className="ds-kicker">Leadership Collection</p>
            <h1 className="ds-heading">Leadership &amp; Strategy</h1>
            <p className="ds-lead mx-auto max-w-3xl">
              Writing about engineering leadership, organizational judgment, and how teams navigate real complexity.
            </p>
            <p className="ds-copy mx-auto max-w-3xl">
              This collection focuses on the work around the work: team design, strategic communication, decision quality,
              and the systems leaders build around people as much as software.
            </p>
          </div>
        </section>

        <PageSection tone="paper" spacing="compact" containerClassName="max-w-6xl">
          <SectionIntro
            title="What This Collection Covers"
            description="The emphasis is not leadership as performance. It is leadership as clearer thinking, stronger coordination, and better decisions under pressure."
            className="mb-10"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Team Building",
                body: "Creating high-performing teams through clearer communication, trust, and shared responsibility.",
                icon: Users,
              },
              {
                title: "Strategic Thinking",
                body: "Connecting technical decisions to broader organizational goals and long-term outcomes.",
                icon: Target,
              },
              {
                title: "Continuous Learning",
                body: "Building organizations that can reflect, adapt, and improve instead of repeating the same failure modes.",
                icon: BookOpen,
              },
            ].map(({ title, body, icon: Icon }) => (
              <EditorialSurface key={title} className="h-full p-6">
                <div className="mb-4 inline-flex rounded-lg bg-bg-soft p-2 text-accent-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="mb-3 text-xl font-semibold text-text-strong">{title}</h2>
                <p className="ds-copy">{body}</p>
              </EditorialSurface>
            ))}
          </div>
        </PageSection>

        <PageSection tone="soft" spacing="compact" containerClassName="max-w-5xl">
          <SectionIntro
            title="Focused Entry Points"
            description="If you came looking for a more direct path than the full collection, these intent-based pages are a faster start."
            className="mb-10"
          />
          <div className="grid gap-6 md:grid-cols-2">
            <EditorialSurface className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-text-strong">Engineering Leadership Articles</h2>
              <p className="ds-copy mb-5">
                A curated landing page for readers specifically looking for engineering leadership articles on accountability, judgment, team design, and communication.
              </p>
              <Button variant="outline" asChild>
                <Link href="/engineering-leadership-articles">Explore the hub</Link>
              </Button>
            </EditorialSurface>
            <EditorialSurface className="p-6">
              <h2 className="mb-3 text-xl font-semibold text-text-strong">AI Systems Strategy</h2>
              <p className="ds-copy mb-5">
                Cross-collection reading on AI architecture, governance, evaluation, and the organizational tradeoffs around adoption.
              </p>
              <Button variant="outline" asChild>
                <Link href="/ai-systems-strategy">Explore the hub</Link>
              </Button>
            </EditorialSurface>
          </div>
        </PageSection>

        <PageSection tone="soft" spacing="compact" containerClassName="max-w-6xl">
          <SectionIntro
            title="Articles"
            description="Search and filter the collection without leaving the page."
            className="mb-10"
          />
          <LeadershipStrategyClient articles={articles} tags={tags} />
        </PageSection>
      </div>
    </ContentLayout>
  )
}
