import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpenText, Castle, Compass, Cpu } from "lucide-react"

import { ContentLayout } from "@/components/content-layout"
import { EditorialPill, EditorialSurface, FeatureCard, PageSection, RuleHeading, SectionIntro } from "@/components/design-system"
import { Button } from "@/components/ui/button"
import { processContentDirectory } from "@/lib/content-api"
import { ARTUMIN_CONFIG, DND_CONFIG, LEADERSHIP_CONFIG, TECHNICAL_CONFIG } from "@/lib/content-configs"
import { formatDisplayDate, getDateTimestamp } from "@/lib/date-utils"
import { buildMetadata } from "@/lib/seo-metadata"

export const metadata: Metadata = buildMetadata({
  title: "Writing Collections",
  description:
    "A guided writing hub for leadership, technical architecture, tabletop design, and the world of Artumin.",
  path: "/strategic-narratives",
  keywords: ["writing collections", "leadership writing", "technical architecture", "artumin", "dnd design"],
})

const collections = [
  {
    title: "Leadership & Strategy",
    href: "/strategic-narratives/leadership-strategy",
    icon: Compass,
    summary: "Writing about engineering leadership, organizational judgment, and how teams make better decisions.",
    highlights: [
      "Leadership framing for technical organizations",
      "Team dynamics, incentives, and communication",
      "Decision-making under ambiguity",
    ],
  },
  {
    title: "Technical Architecture",
    href: "/strategic-narratives/technical-architecture",
    icon: Cpu,
    summary: "Essays and explainers focused on systems thinking, architecture tradeoffs, and practical engineering depth.",
    highlights: [
      "Architecture explained in concrete terms",
      "Tradeoff-driven technical reasoning",
      "Bridges between strategy and implementation",
    ],
  },
  {
    title: "World of Artumin",
    href: "/strategic-narratives/world-of-artumin",
    icon: Castle,
    summary: "Original worldbuilding, story structure, and long-form creative work set in the world of Artumin.",
    highlights: [
      "Lore, factions, and setting design",
      "Narrative experiments and story fragments",
      "Creative worldbuilding with system-level thinking",
    ],
  },
  {
    title: "D&D and TTRPGs",
    href: "/strategic-narratives/dnd-ttrpgs",
    icon: BookOpenText,
    summary: "Homebrew material, tabletop design notes, and essays about collaborative play and structured imagination.",
    highlights: [
      "Encounter and system design ideas",
      "Tools for running better games",
      "Tabletop lessons that echo team dynamics",
    ],
  },
] as const

function getLatestDate(values: { date: string }[]) {
  if (values.length === 0) {
    return null
  }

  return values.reduce((latest, current) =>
    getDateTimestamp(current.date) > getDateTimestamp(latest.date) ? current : latest
  ).date
}

export default async function StrategicNarrativesPage() {
  const [leadership, technical, artumin, dnd] = await Promise.all([
    processContentDirectory(LEADERSHIP_CONFIG),
    processContentDirectory(TECHNICAL_CONFIG),
    processContentDirectory(ARTUMIN_CONFIG),
    processContentDirectory(DND_CONFIG),
  ])

  const collectionStats = {
    "/strategic-narratives/leadership-strategy": {
      count: leadership.length,
      lastUpdated: getLatestDate(leadership),
    },
    "/strategic-narratives/technical-architecture": {
      count: technical.length,
      lastUpdated: getLatestDate(technical),
    },
    "/strategic-narratives/world-of-artumin": {
      count: artumin.length,
      lastUpdated: getLatestDate(artumin),
    },
    "/strategic-narratives/dnd-ttrpgs": {
      count: dnd.length,
      lastUpdated: getLatestDate(dnd),
    },
  } as const

  return (
    <ContentLayout>
      <div className="space-y-16 md:space-y-20">
        <section className="mx-auto max-w-4xl text-center">
          <p className="ds-kicker mb-4">Writing Collections</p>
          <h1 className="ds-heading mb-5">A single hub for the site&apos;s deeper writing collections</h1>
          <p className="ds-lead mx-auto max-w-3xl">
            This section gathers the long-form work that sits between writing, worldbuilding, and applied systems
            thinking. Each collection has its own subject matter, but they all come from the same habit: using
            narrative structure to make complicated ideas easier to see and act on.
          </p>
        </section>

        <PageSection tone="paper" spacing="compact" containerClassName="max-w-6xl">
          <SectionIntro
            title="Collections"
            description="Browse by the lens you want to use. The visual language is shared; the material changes by domain."
            className="mb-10"
          />
          <div className="grid gap-8 md:grid-cols-2">
            {collections.map(({ title, href, icon: Icon, summary, highlights }) => {
              const stats = collectionStats[href]

              return (
                <FeatureCard
                  key={href}
                  icon={Icon}
                  title={title}
                  summary={summary}
                  footer={
                    <Button variant="editorial" asChild>
                      <Link href={href}>
                        Explore Collection
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  }
                >
                  <div className="mb-6 flex flex-wrap gap-2 border-y border-border-subtle/80 py-4">
                    <EditorialPill tone="neutral">{stats.count} entries</EditorialPill>
                    <EditorialPill tone="accent">
                      {stats.lastUpdated
                        ? formatDisplayDate(stats.lastUpdated, "en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "No published entries yet"}
                    </EditorialPill>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">What you&apos;ll find</p>
                    <ul className="space-y-3 text-text-body">
                      {highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent-primary" aria-hidden="true" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FeatureCard>
              )
            })}
          </div>
        </PageSection>

        <PageSection tone="soft" spacing="compact" containerClassName="max-w-4xl">
          <EditorialSurface className="p-8 text-center sm:p-10">
            <RuleHeading as="h2" className="mx-auto mb-4">
              Start Anywhere
            </RuleHeading>
            <p className="ds-lead mx-auto max-w-2xl">
              If you want the most direct path into the site, start with leadership or technical architecture.
            </p>
            <p className="ds-copy mx-auto mt-4 max-w-2xl">
              If you are more interested in creative systems, tabletop design, or fictional worlds, Artumin and the
              TTRPG collection show how those same habits of thinking play out in a different form.
            </p>
            <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
              <Link
                href="/engineering-leadership-articles"
                className="rounded-xl border border-border-subtle bg-bg-soft p-4 transition-colors hover:border-accent-primary/40"
              >
                <p className="text-sm font-semibold text-text-strong">Engineering Leadership Articles</p>
                <p className="mt-2 text-sm text-text-body">A direct entry point for team design, management, and leadership writing.</p>
              </Link>
              <Link
                href="/technical-architecture-articles"
                className="rounded-xl border border-border-subtle bg-bg-soft p-4 transition-colors hover:border-accent-primary/40"
              >
                <p className="text-sm font-semibold text-text-strong">Technical Architecture Articles</p>
                <p className="mt-2 text-sm text-text-body">A focused hub for system design, architecture, and operational tradeoff essays.</p>
              </Link>
              <Link
                href="/ai-systems-strategy"
                className="rounded-xl border border-border-subtle bg-bg-soft p-4 transition-colors hover:border-accent-primary/40"
              >
                <p className="text-sm font-semibold text-text-strong">AI Systems Strategy</p>
                <p className="mt-2 text-sm text-text-body">Cross-collection reading on AI evaluation, governance, architecture, and adoption strategy.</p>
              </Link>
            </div>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="editorial" asChild>
                <Link href="/writing">Go to Writing</Link>
              </Button>
              <Button variant="quiet" asChild>
                <Link href="/contact">Contact Me</Link>
              </Button>
            </div>
          </EditorialSurface>
        </PageSection>
      </div>
    </ContentLayout>
  )
}
