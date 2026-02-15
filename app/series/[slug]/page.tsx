import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { DateText } from "@/components/date-text"
import { getAllSeries, getSeriesBySlug } from "@/lib/series-utils"

interface SeriesDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSeries().map((series) => ({ slug: series.slug }))
}

export async function generateMetadata({ params }: SeriesDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const series = getSeriesBySlug(slug)
  if (!series) {
    return {
      title: "Series not found | John Munn",
    }
  }

  return {
    title: `${series.name} | Series | John Munn`,
    description:
      series.description ||
      `Read the ${series.name} series in order.`,
  }
}

export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
  const { slug } = await params
  const series = getSeriesBySlug(slug)

  if (!series) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1 bg-bg-base">
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="mb-8">
              <Link
                href="/series"
                className="inline-flex items-center gap-2 text-text-muted hover:text-text-strong transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all series
              </Link>
            </div>

            <header className="mb-12">
              <h1 className="section-title text-3xl font-bold tracking-tight text-text-strong mb-3 w-fit">{series.name}</h1>
              {series.description && (
                <p className="text-lg text-text-body max-w-3xl leading-relaxed">{series.description}</p>
              )}
            </header>

            <ol className="space-y-5">
              {series.entries.map((entry, index) => (
                <li key={`${entry.section}-${entry.slug}`} className="border border-border-subtle rounded-xl p-5 bg-bg-paper">
                  <p className="text-xs uppercase tracking-wide text-text-muted mb-2">
                    Part {entry.series_order ?? index + 1}
                  </p>
                  <Link href={entry.href} className="block group">
                    <h2 className="text-xl font-semibold text-text-strong group-hover:text-accent-primary transition-colors mb-2">
                      {entry.title}
                    </h2>
                    <p className="text-sm text-text-body mb-2 line-clamp-2">{entry.excerpt}</p>
                    <div className="text-xs text-text-muted flex items-center gap-4">
                      <DateText value={entry.date} options={{ year: "numeric", month: "long", day: "numeric" }} />
                      {entry.reading_time && <span>{entry.reading_time} min read</span>}
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
