import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Compass, Cpu, Lightbulb } from "lucide-react"

import {
  CollectionArticleCard,
  CollectionEmptyState,
} from "@/components/collection-browser"
import { ContentLayout } from "@/components/content-layout"
import {
  EditorialPill,
  EditorialSurface,
  FeatureCard,
  PageSection,
  RuleHeading,
  SectionIntro,
} from "@/components/design-system"
import { Button } from "@/components/ui/button"
import { buildMetadata } from "@/lib/seo-metadata"
import { CollectionBrowserPreview } from "./CollectionBrowserPreview"

export const metadata: Metadata = buildMetadata({
  title: "System Preview",
  description: "Internal preview route for the shared editorial design system.",
  path: "/system",
  noindex: true,
})

const featureCards = [
  {
    title: "Editorial Card",
    kicker: "FeatureCard",
    icon: Compass,
    summary: "Used for hub cards, offer summaries, and collection overviews that need a strong title and structured follow-through.",
    bullets: [
      "Optional kicker and icon",
      "Shared spacing and hierarchy",
      "Footer slot for CTA actions",
    ],
  },
  {
    title: "Collection Surface",
    kicker: "EditorialSurface",
    icon: Cpu,
    summary: "Use for structured panels, grouped content, or proof blocks that need a calm elevated surface without inventing a new style.",
    bullets: [
      "Paper-like depth",
      "Neutral border and shadow",
      "Works across light editorial pages",
    ],
  },
]

const previewTags = ["Architecture", "Leadership", "Systems", "AI", "Worldbuilding", "Tabletop"]

export default function SystemPreviewPage() {
  return (
    <ContentLayout>
      <div className="space-y-16 md:space-y-20">
        <section className="mx-auto max-w-4xl text-center">
          <p className="ds-kicker mb-4">Internal Route</p>
          <h1 className="ds-heading mb-5">Design system preview</h1>
          <p className="ds-lead mx-auto max-w-3xl">
            A single reference page for the site&apos;s shared editorial primitives, layout rhythm, and reusable UI choices.
          </p>
        </section>

        <PageSection tone="paper" spacing="compact" containerClassName="max-w-6xl">
          <SectionIntro
            title="Headings and copy"
            description="Use these instead of inventing page-local heading stacks or ad hoc intro treatments."
            className="mb-10"
          />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <EditorialSurface className="p-8">
              <RuleHeading as="h1" tone="page" className="mb-5">
                Page heading
              </RuleHeading>
              <p className="ds-lead max-w-2xl">
                Large, confident, and reserved for the primary title of a page or major landing surface.
              </p>
              <p className="ds-copy mt-5 max-w-2xl">
                Body copy should stay calm and readable. The system is intentionally light-first and editorial, with accent color used for direction rather than decoration.
              </p>
            </EditorialSurface>

            <EditorialSurface className="p-8">
              <p className="ds-kicker mb-3">Reference</p>
              <RuleHeading className="mb-4">Section heading</RuleHeading>
              <p className="ds-copy">
                Section headings should use the shared rule treatment rather than page-specific underlines or border utilities.
              </p>
              <p className="ds-meta mt-6">Meta copy is for dates, framing, and secondary support text.</p>
              <div className="mt-6">
                <Link href="/writing" className="ds-link">
                  Standard editorial link
                </Link>
              </div>
            </EditorialSurface>
          </div>
        </PageSection>

        <PageSection tone="soft" spacing="compact" containerClassName="max-w-6xl">
          <SectionIntro
            title="Buttons and pills"
            description="Primary actions should be rare and obvious. Pills should stay lightweight and informational."
            className="mb-10"
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <EditorialSurface className="p-8">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">Buttons</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="editorial" asChild>
                  <Link href="/contact">
                    Primary action
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="quiet" asChild>
                  <Link href="/services">Secondary action</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/projects">Utility action</Link>
                </Button>
              </div>
            </EditorialSurface>

            <EditorialSurface className="p-8">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">Pills</p>
              <div className="flex flex-wrap gap-3">
                <EditorialPill tone="accent">Accent pill</EditorialPill>
                <EditorialPill tone="neutral">Neutral pill</EditorialPill>
                <EditorialPill tone="success">Success pill</EditorialPill>
                <EditorialPill tone="warm">Warm pill</EditorialPill>
              </div>
            </EditorialSurface>
          </div>
        </PageSection>

        <PageSection tone="paper" spacing="compact" containerClassName="max-w-6xl">
          <SectionIntro
            title="Card patterns"
            description="These are the preferred content-card patterns for top-level pages and collection hubs."
            className="mb-10"
          />
          <div className="grid gap-8 lg:grid-cols-2">
            {featureCards.map((card) => (
              <FeatureCard
                key={card.title}
                icon={card.icon}
                kicker={card.kicker}
                title={card.title}
                summary={card.summary}
                footer={
                  <Button variant="editorial" asChild>
                    <Link href="/writing">
                      Example CTA
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                }
              >
                <ul className="space-y-3 text-text-body">
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent-primary" aria-hidden="true" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </FeatureCard>
            ))}
          </div>
        </PageSection>

        <PageSection tone="soft" spacing="compact" containerClassName="max-w-6xl">
          <SectionIntro
            title="Section composition"
            description="A page should usually be assembled from shared sections, with each section carrying a clear tone and a small amount of variation."
            className="mb-10"
          />
          <div className="grid gap-6 md:grid-cols-3">
            <EditorialSurface className="h-full p-6">
              <div className="mb-4 inline-flex rounded-lg bg-bg-soft p-2 text-accent-primary">
                <Lightbulb className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-text-strong">Base tone</h3>
              <p className="ds-copy">Default reading surface for content-heavy sections and long-form layout.</p>
            </EditorialSurface>
            <EditorialSurface className="h-full p-6">
              <div className="mb-4 inline-flex rounded-lg bg-bg-soft p-2 text-accent-primary">
                <Lightbulb className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-text-strong">Soft tone</h3>
              <p className="ds-copy">Use for contrast between major sections without shifting into a new visual dialect.</p>
            </EditorialSurface>
            <EditorialSurface className="h-full p-6">
              <div className="mb-4 inline-flex rounded-lg bg-bg-soft p-2 text-accent-primary">
                <Lightbulb className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-text-strong">Paper tone</h3>
              <p className="ds-copy">Use when you want a calmer, more presentation-like section or a high-trust closing surface.</p>
            </EditorialSurface>
          </div>
        </PageSection>

        <PageSection tone="paper" spacing="compact" containerClassName="max-w-6xl">
          <SectionIntro
            title="Collection browser"
            description="These primitives now drive the writing collection hubs. Use them for shared filter panels, content cards, result counts, and empty states."
            className="mb-10"
          />
          <div className="space-y-8">
            <CollectionBrowserPreview previewTags={previewTags} />

            <div className="grid gap-6 lg:grid-cols-2">
              <CollectionArticleCard
                href="/writing"
                title="Collection article card"
                excerpt="Shared article/listing card for collection hubs, with optional metadata rows, pills, media, and footer content."
                date="2026-03-20"
                readingTime={8}
                featuredImage="/me.png"
                pills={
                  <>
                    <EditorialPill tone="accent" className="normal-case tracking-normal">
                      Technical
                    </EditorialPill>
                    <EditorialPill tone="neutral" className="normal-case tracking-normal">
                      intermediate
                    </EditorialPill>
                  </>
                }
                footer={
                  <div className="flex flex-wrap gap-1">
                    <EditorialPill tone="neutral" className="normal-case tracking-normal">
                      systems
                    </EditorialPill>
                    <EditorialPill tone="neutral" className="normal-case tracking-normal">
                      architecture
                    </EditorialPill>
                    <EditorialPill tone="neutral" className="normal-case tracking-normal">
                      +2
                    </EditorialPill>
                  </div>
                }
              />

              <CollectionEmptyState
                title="No matching entries"
                body="Empty states should stay quiet, direct, and visually consistent with the rest of the collection browser."
              />
            </div>
          </div>
        </PageSection>
      </div>
    </ContentLayout>
  )
}
