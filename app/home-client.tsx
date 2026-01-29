"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface Article {
  slug: string
  title: string
  date: string
  excerpt?: string
  reading_time?: number
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
          ...(leadership.articles || []).map((a: { slug: string; title: string; date: string; excerpt?: string; reading_time?: number }) => ({
            ...a,
            category: "Leadership",
            categoryColor: "text-text-muted",
            href: `/strategic-narratives/leadership-strategy/${a.slug}`,
            readingTime: a.reading_time ?? a.readingTime,
          })),
          ...(technical.articles || []).map((a: { slug: string; title: string; date: string; excerpt?: string; reading_time?: number }) => ({
            ...a,
            category: "Technical",
            categoryColor: "text-text-muted",
            href: `/strategic-narratives/technical-architecture/${a.slug}`,
            readingTime: a.reading_time ?? a.readingTime,
          })),
        ]

        const sorted = combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero — bg-paper; image flush left, consistent crop via aspect-ratio + focal point */}
        <section className="w-full bg-bg-paper lg:min-h-[min(85vh,720px)]">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,1fr)_1fr] w-full lg:h-[min(85vh,720px)]">
            {/* Profile image — fixed aspect ratio so crop is consistent; focal point keeps face in frame */}
            <div className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-full order-2 lg:order-1 bg-hero-whisper overflow-hidden">
              <Image
                src="/me.png"
                alt="John Munn"
                fill
                className="object-cover object-[20%_25%] lg:object-[20%_25%]"
                priority
                sizes="(max-width: 1023px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-center space-y-5 px-4 sm:px-6 md:px-6 lg:pl-12 lg:pr-16 py-10 sm:py-12 lg:py-16 order-1 lg:order-2 max-w-2xl w-full min-w-0">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl text-text-strong leading-tight">
                  John Munn
                </h1>
                <p className="text-xl text-text-body font-normal max-w-lg">
                Engineering leader and writer focused on the messy intersection of technology and people.
                </p>
                <p className="max-w-lg text-text-body leading-relaxed font-normal">
                I help teams cut through complexity, whether it's technical debt, scaling challenges, or organizational growing pains. Twenty years of experience has taught me that good strategy starts with understanding what's actually happening, not what the slide deck says is happening.
                 </p>
                <div className="flex flex-col gap-3 min-[400px]:flex-row pt-2">
                  <Button size="lg" className="bg-accent-primary hover:bg-accent-primary-hover text-white rounded-button py-3 px-6" asChild>
                    <Link href="/writing">
                      Writing
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="border-none bg-transparent text-accent-primary hover:bg-bg-soft rounded-button py-3 px-6" asChild>
                    <Link href="/contact">Contact</Link>
                  </Button>
                </div>
              </div>
          </div>
        </section>

        {/* Writing — bg-base; hairline under title; titles stand on their own, more breathing room */}
        <section className="w-full py-16 md:py-24 lg:py-28 bg-bg-base">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
              <div>
                <h2 className="section-title text-2xl font-bold tracking-tight text-text-strong mb-2 w-fit">Writing</h2>
                <p className="text-text-body max-w-xl mt-3">
                Leadership and technical architecture, written from real-world experience building and leading teams through complexity.
                </p>
              </div>
              <Button variant="ghost" className="text-text-body hover:text-accent-primary w-fit" asChild>
                <Link href="/writing">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {!isLoading && articles.length > 0 && (
              <ul className="space-y-16">
                {articles.map((article) => (
                  <li key={`${article.category}-${article.slug}`} className="border-b border-border-subtle pb-16 last:border-b-0 last:pb-0">
                    <Link href={article.href} className="group block">
                      <h3 className="text-[1.5rem] font-semibold text-text-strong group-hover:text-accent-primary transition-colors mb-2 leading-snug">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-text-body text-[0.9375rem] leading-relaxed line-clamp-2 mb-2">{article.excerpt}</p>
                      )}
                      <time className="text-xs text-text-muted">
                        {new Date(article.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {article.readingTime ? ` · ${article.readingTime} min read` : ""}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {!isLoading && articles.length === 0 && (
              <p className="text-text-muted">No writing yet.</p>
            )}
          </div>
        </section>

        {/* Projects — bg-soft; top divider; lead-in + framing */}
        <section className="w-full border-t border-accent-rule py-16 md:py-24 lg:py-28 bg-bg-soft">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="mb-6">
              <h2 className="section-title text-2xl font-bold tracking-tight text-text-strong mb-2 w-fit">Projects</h2>
              <p className="text-text-body text-sm max-w-xl mt-2">
                Selected projects that explore systems, tooling, and decision-making in practice.
              </p>
              <p className="text-text-body font-normal max-w-xl mt-3">
                Applied work and exploration. What I build and why.
              </p>
            </div>
            <p className="text-text-muted text-sm max-w-2xl mb-10">
              These are applied explorations, not products, built to understand systems more deeply.{" "}
            </p>
            <Link
                href="/projects"
                className="inline-block text-base text-accent-primary hover:text-accent-primary-hover font-medium py-2 underline underline-offset-4 decoration-accent-primary/40 hover:decoration-accent-primary transition-colors"
              >
                See projects
              </Link>
          </div>
        </section>

        {/* Contact — bg-paper; calm ending, left-aligned */}
        <section className="w-full py-20 md:py-28 lg:py-32 bg-bg-paper">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto text-left">
            <h2 className="section-title text-2xl font-bold tracking-tight text-text-strong mb-3 w-fit">Contact</h2>
            <p className="text-text-body leading-relaxed mb-8 mt-3">
              Open to conversation, mentoring, collaboration, or just saying hello. Email or LinkedIn.
            </p>
            <Link
              href="/contact"
              className="inline-block text-base text-accent-primary hover:text-accent-primary-hover font-medium py-2 underline underline-offset-4 decoration-accent-primary/40 hover:decoration-accent-primary transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
