import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Dice6, Scroll, Wand2 } from "lucide-react"

import { ContentLayout } from "@/components/content-layout"
import { EditorialSurface, PageSection, SectionIntro } from "@/components/design-system"
import { Button } from "@/components/ui/button"
import { processContentDirectory } from "@/lib/content-api"
import { DND_CONFIG } from "@/lib/content-configs"
import { buildMetadata } from "@/lib/seo-metadata"
import { DndTtrpgsClient } from "./client"

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
      title: "D&D and TTRPGs | John Munn",
      description: "Creative mechanics, homebrew content, and tabletop design thinking.",
      path: "/strategic-narratives/dnd-ttrpgs",
      keywords: ["dnd homebrew", "ttrpg design", "tabletop systems"],
      noindex: true,
    })
  }

  return buildMetadata({
    title: "D&D and TTRPGs | John Munn",
    description: "Creative mechanics, homebrew content, and tabletop design thinking.",
    path: "/strategic-narratives/dnd-ttrpgs",
    keywords: ["dnd homebrew", "ttrpg design", "tabletop systems"],
  })
}

export default async function DndTtrpgsPage() {
  const articles = await processContentDirectory(DND_CONFIG)
  const tags = Array.from(new Set(articles.flatMap((article) => article.tags || []))).sort()
  const systems = Array.from(new Set(articles.map((article) => String(article.system)).filter(Boolean))).sort()

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
            <p className="ds-kicker">Tabletop Collection</p>
            <h1 className="ds-heading">D&amp;D and TTRPGs</h1>
            <p className="ds-lead mx-auto max-w-3xl">
              Homebrew systems, tabletop design notes, and practical thinking about collaborative play.
            </p>
            <p className="ds-copy mx-auto max-w-3xl">
              This collection covers mechanics, monsters, adventures, and design philosophy, with an emphasis on work that is both narratively interesting and mechanically usable.
            </p>
          </div>
        </section>

        <PageSection tone="paper" spacing="compact" containerClassName="max-w-6xl">
          <SectionIntro
            title="What This Collection Covers"
            description="The throughline is design that supports memorable play without sacrificing clarity, balance, or table usability."
            className="mb-10"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Game Mechanics",
                body: "Rules, structures, and experimental mechanics built to open new possibilities in play.",
                icon: Dice6,
              },
              {
                title: "Homebrew Content",
                body: "Custom monsters, items, spells, and content designed to be engaging at the table.",
                icon: Wand2,
              },
              {
                title: "Design Philosophy",
                body: "Essays and notes about encounter design, player experience, and the craft of running memorable games.",
                icon: Scroll,
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
            title="Entries"
            description="Filter by system, content type, or topic without leaving the page."
            className="mb-10"
          />
          <DndTtrpgsClient articles={articles} tags={tags} systems={systems} />
        </PageSection>
      </div>
    </ContentLayout>
  )
}
