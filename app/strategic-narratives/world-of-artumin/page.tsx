import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, BookOpen, Crown, Sword } from "lucide-react"

import { BreadcrumbSchema } from "@/components/breadcrumb-schema"
import { ContentLayout } from "@/components/content-layout"
import { EditorialSurface, PageSection, SectionIntro } from "@/components/design-system"
import { Button } from "@/components/ui/button"
import { processContentDirectory } from "@/lib/content-api"
import { ARTUMIN_CONFIG } from "@/lib/content-configs"
import { buildMetadata } from "@/lib/seo-metadata"
import { WorldOfArtuminClient } from "./client"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const hasQueryParams = Object.keys(params).length > 0

  return buildMetadata({
    title: "World of Artumin | John Munn",
    description: "Reflective fantasy and leadership fables exploring worth, power, and courage through narrative.",
    path: "/strategic-narratives/world-of-artumin",
    keywords: ["World of Artumin", "leadership fables", "strategic narratives", "fantasy storytelling"],
    image: "/theblackpowdercover.png",
    imageAlt: "World of Artumin by John Munn",
    noindex: hasQueryParams,
  })
}

export default async function WorldOfArtuminPage() {
  const articles = await processContentDirectory(ARTUMIN_CONFIG)
  const availableTags = Array.from(
    new Set(
      articles.flatMap((article) => [
        ...(Array.isArray(article.tags) ? article.tags : []),
        ...(Array.isArray(article.categories) ? article.categories : []),
      ])
    )
  ).sort()

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://johnmunn.tech/strategic-narratives/world-of-artumin#collection",
    url: "https://johnmunn.tech/strategic-narratives/world-of-artumin",
    name: "World of Artumin",
    description: "Reflective fantasy and leadership fables exploring worth, power, and courage through narrative.",
    isPartOf: { "@id": "https://johnmunn.tech/#website" },
    inLanguage: "en-US",
    about: {
      "@type": "CreativeWorkSeries",
      name: "World of Artumin",
      author: {
        "@type": "Person",
        name: "John Munn",
        url: "https://johnmunn.tech/about",
      },
    },
  }

  return (
    <ContentLayout>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Writing Collections", url: "/strategic-narratives" },
          { name: "World of Artumin", url: "/strategic-narratives/world-of-artumin" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema).replace(/</g, "\\u003c"),
        }}
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
            <p className="ds-kicker">Creative Collection</p>
            <h1 className="ds-heading">World of Artumin</h1>
            <p className="ds-lead mx-auto max-w-3xl">
              Reflective fantasy, leadership fables, and worldbuilding that use story to examine worth, power, and courage.
            </p>
            <p className="ds-copy mx-auto max-w-4xl">
              Artumin is where narrative does strategic work. The collection uses fictional settings, political pressure,
              and character choices to explore the same questions that show up in leadership, responsibility, and systems
              built by people.
            </p>
          </div>
        </section>

        <PageSection tone="paper" spacing="compact" containerClassName="max-w-6xl">
          <SectionIntro
            title="What This Collection Covers"
            description="Artumin is not a lore dump. It is a story-first collection where worldbuilding, character, and consequence are used to surface harder truths indirectly."
            className="mb-10"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Leadership Fables",
                body: "Stories about power, stewardship, succession, and the moral weight of command.",
                icon: Crown,
              },
              {
                title: "Character Pressure",
                body: "People under strain, trying to act with integrity when context makes the cost visible.",
                icon: Sword,
              },
              {
                title: "Worldbuilding With Purpose",
                body: "Cultures, institutions, and magical systems that support reflection instead of existing as decoration.",
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
            title="Stories and Reference Pieces"
            description="Search the collection by theme, category, or setting details without leaving the page."
            className="mb-10"
          />
          <WorldOfArtuminClient articles={articles} availableTags={availableTags} />
        </PageSection>
      </div>
    </ContentLayout>
  )
}
