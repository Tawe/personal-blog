import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, BookOpen, Target, Users } from "lucide-react"

import { ContentLayout } from "@/components/content-layout"
import { EditorialSurface, PageSection, SectionIntro } from "@/components/design-system"
import { Button } from "@/components/ui/button"
import { processContentDirectory } from "@/lib/content-api"
import { LEADERSHIP_CONFIG } from "@/lib/content-configs"
import { buildMetadata } from "@/lib/seo-metadata"
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

  return (
    <ContentLayout>
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
