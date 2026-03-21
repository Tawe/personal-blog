import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Cloud, Code, Zap } from "lucide-react"

import { ContentLayout } from "@/components/content-layout"
import { EditorialSurface, PageSection, SectionIntro } from "@/components/design-system"
import { Button } from "@/components/ui/button"
import { processContentDirectory } from "@/lib/content-api"
import { TECHNICAL_CONFIG } from "@/lib/content-configs"
import { buildMetadata } from "@/lib/seo-metadata"
import { TechnicalArchitectureClient } from "./client"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams
  const hasQueryParams = Object.keys(params).length > 0

  if (hasQueryParams) {
    return buildMetadata({
      title: "Technical Architecture | John Munn",
      description: "Deep dives into system design, scalability, and technology decisions.",
      path: "/strategic-narratives/technical-architecture",
      keywords: ["technical architecture", "system design", "software architecture"],
      noindex: true,
    })
  }

  return buildMetadata({
    title: "Technical Architecture | John Munn",
    description: "Deep dives into system design, scalability, and technology decisions.",
    path: "/strategic-narratives/technical-architecture",
    keywords: ["technical architecture", "system design", "software architecture"],
  })
}

export default async function TechnicalArchitecturePage() {
  const articles = await processContentDirectory(TECHNICAL_CONFIG)
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
            <p className="ds-kicker">Technical Collection</p>
            <h1 className="ds-heading">Technical Architecture</h1>
            <p className="ds-lead mx-auto max-w-3xl">
              System design, software architecture, AI tradeoffs, and the practical reasoning behind difficult technical decisions.
            </p>
            <p className="ds-copy mx-auto max-w-3xl">
              The focus here is explanation that helps people act: concrete tradeoffs, operational consequences, and clearer language for complicated systems.
            </p>
          </div>
        </section>

        <PageSection tone="paper" spacing="compact" containerClassName="max-w-6xl">
          <SectionIntro
            title="What This Collection Covers"
            description="The goal is not technical theater. It is making architecture and systems thinking usable for real teams."
            className="mb-10"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Architecture & Design",
                body: "Patterns, tradeoffs, and system structure explained in a way that supports actual engineering decisions.",
                icon: Code,
              },
              {
                title: "Performance & Optimization",
                body: "How systems behave under load, where bottlenecks emerge, and how optimization changes the shape of a design.",
                icon: Zap,
              },
              {
                title: "Cloud & Operations",
                body: "Infrastructure, platform concerns, and the operational realities that make architecture succeed or fail.",
                icon: Cloud,
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
            description="Search and filter by topic or technology without leaving the page."
            className="mb-10"
          />
          <TechnicalArchitectureClient articles={articles} tags={tags} />
        </PageSection>
      </div>
    </ContentLayout>
  )
}
