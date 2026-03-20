"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { getDateTimestamp } from "@/lib/date-utils"
import { DateText } from "@/components/date-text"
import { EditorialSurface, PageSection, SectionIntro } from "@/components/design-system"

interface Article {
  slug: string
  title: string
  date: string
  excerpt?: string
  reading_time?: number
  readingTime?: number
  category: string
  categoryColor: string
  href: string
}

export default function HomePageClient() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadership, technical] = await Promise.all([
          fetch("/api/content/leadership").then((r) => r.json()),
          fetch("/api/content/technical").then((r) => r.json()),
        ])

        const combined: Article[] = [
          ...(leadership.articles || []).map((a: { slug: string; title: string; date: string; excerpt?: string; reading_time?: number; readingTime?: number }) => ({
            ...a,
            category: "Leadership",
            categoryColor: "text-text-muted",
            href: `/strategic-narratives/leadership-strategy/${a.slug}`,
            readingTime: a.reading_time ?? a.readingTime,
          })),
          ...(technical.articles || []).map((a: { slug: string; title: string; date: string; excerpt?: string; reading_time?: number; readingTime?: number }) => ({
            ...a,
            category: "Technical",
            categoryColor: "text-text-muted",
            href: `/strategic-narratives/technical-architecture/${a.slug}`,
            readingTime: a.reading_time ?? a.readingTime,
          })),
        ]

        const sorted = combined.sort((a, b) => getDateTimestamp(b.date) - getDateTimestamp(a.date))
        setArticles(sorted.slice(0, 3))
      } catch (error) {
        console.error("Error fetching articles:", error)
        setArticles([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="ds-page flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {/* Hero — bg-paper; image flush left, consistent crop via aspect-ratio + focal point */}
        <section aria-label="Hero" className="w-full bg-bg-paper lg:min-h-[min(85vh,720px)]">
          <div className="grid w-full grid-cols-1 lg:h-[min(85vh,720px)] lg:grid-cols-[minmax(320px,1fr)_1fr]">
            {/* Profile image — fixed aspect ratio so crop is consistent; focal point keeps face in frame */}
            <div className="relative order-2 aspect-[4/5] w-full overflow-hidden bg-hero-whisper lg:order-1 lg:h-full lg:aspect-auto">
              <Image
                src="/me.png"
                alt="John Munn"
                width={784}
                height={943}
                className="h-full w-full object-cover object-[20%_25%]"
                priority
                sizes="(max-width: 1023px) 100vw, 50vw"
              />
            </div>
            <div className="order-1 flex w-full min-w-0 flex-col justify-center space-y-5 px-4 py-10 sm:px-6 sm:py-12 md:px-6 lg:order-2 lg:pl-12 lg:pr-16 lg:py-16">
              <div className="ds-reading-width">
                <p className="ds-kicker mb-4">Engineering leadership and technical strategy</p>
                <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-text-strong sm:text-5xl xl:text-6xl">
                  John Munn
                </h1>
                <p className="ds-lead mt-4 max-w-xl font-normal">
                  Engineering leader and writer focused on the messy intersection of technology and people.
                </p>
                <p className="ds-copy mt-4 max-w-xl font-normal">
                  I help teams cut through complexity, whether it&apos;s technical debt, scaling challenges, or
                  organizational growing pains. Twenty years of experience has taught me that good strategy starts
                  with understanding what&apos;s actually happening, not what the slide deck says is happening.
                </p>
                <div className="flex flex-col gap-3 pt-2 min-[400px]:flex-row">
                  <Button size="lg" variant="editorial" className="px-6 py-3" asChild>
                    <Link href="/writing">
                      Writing
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="quiet" size="lg" className="px-6 py-3" asChild>
                    <Link href="/contact">Contact</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Writing — bg-base; hairline under title; titles stand on their own, more breathing room */}
        <PageSection aria-labelledby="writing-heading" tone="base" containerClassName="max-w-5xl">
          <SectionIntro
            title="Writing"
            description="Leadership and technical architecture, written from real-world experience building and leading teams through complexity."
            actions={
              <Button variant="ghost" className="w-fit text-text-body hover:text-accent-primary" asChild>
                <Link href="/writing">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            }
            className="mb-14"
          />

          <div aria-live="polite" aria-busy={isLoading}>
            {!isLoading && articles.length > 0 && (
              <ul className="space-y-16">
                {articles.map((article) => (
                  <li key={`${article.category}-${article.slug}`} className="border-b border-border-subtle pb-16 last:border-b-0 last:pb-0">
                    <Link href={article.href} className="group block">
                      <h3 className="text-xl font-bold tracking-tight text-text-strong group-hover:text-accent-primary transition-colors mb-2 leading-snug">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-text-body text-[0.9375rem] leading-relaxed line-clamp-2 mb-2">{article.excerpt}</p>
                      )}
                      <span className="text-xs text-text-muted">
                        <DateText
                          value={article.date}
                          options={{
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }}
                        />
                        {article.readingTime ? ` · ${article.readingTime} min read` : ""}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {!isLoading && articles.length === 0 && (
              <p className="text-text-muted">No writing yet.</p>
            )}
          </div>
        </PageSection>

        {/* Projects — bg-soft; top divider; lead-in + framing */}
        <PageSection aria-labelledby="projects-heading" tone="soft" divider containerClassName="max-w-5xl">
          <EditorialSurface className="p-8 sm:p-10">
            <SectionIntro
              title="Projects"
              description="Selected projects that explore systems, tooling, and decision-making in practice."
              kicker="Applied work"
              className="mb-6"
            />
            <p className="ds-copy max-w-xl">Applied work and exploration. What I build and why.</p>
            <p className="ds-meta mb-10 mt-3 max-w-2xl">
              These are applied explorations, not products, built to understand systems more deeply.
            </p>
            <Link href="/projects" className="ds-link inline-block py-2 text-base">
                See projects
            </Link>
          </EditorialSurface>
        </PageSection>

        {/* Contact — bg-paper; calm ending, left-aligned */}
        <PageSection aria-labelledby="contact-heading" tone="paper" spacing="roomy" containerClassName="max-w-5xl">
          <div className="text-left">
            <SectionIntro
              title="Contact"
              description="Open to conversation, mentoring, collaboration, or just saying hello. Email or LinkedIn."
              className="mb-5"
            />
            <Link href="/contact" className="ds-link inline-block py-2 text-base">
              Get in touch
            </Link>
          </div>
        </PageSection>
      </main>
      <SiteFooter />
    </div>
  )
}
