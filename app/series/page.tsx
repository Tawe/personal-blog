import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getAllSeries } from "@/lib/series-utils"

export const metadata = {
  title: "Series | John Munn",
  description: "Narrative article series across leadership and technical architecture.",
}

export default function SeriesIndexPage() {
  const allSeries = getAllSeries()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1 bg-bg-base">
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <header className="mb-12">
              <h1 className="section-title text-3xl font-bold tracking-tight text-text-strong mb-3 w-fit">Series</h1>
              <p className="text-lg text-text-body max-w-2xl">
                Follow connected storylines and multi-part narratives in order.
              </p>
            </header>

            {allSeries.length === 0 ? (
              <p className="text-text-body">No series published yet.</p>
            ) : (
              <ul className="space-y-8">
                {allSeries.map((series) => (
                  <li key={series.slug} className="border border-border-subtle rounded-xl p-6 bg-bg-paper">
                    <h2 className="text-2xl font-semibold text-text-strong mb-2">{series.name}</h2>
                    {series.description && (
                      <p className="text-text-body mb-4 leading-relaxed">{series.description}</p>
                    )}
                    <p className="text-sm text-text-muted mb-4">
                      {series.entries.length} {series.entries.length === 1 ? "article" : "articles"}
                    </p>
                    <Link
                      href={`/series/${series.slug}`}
                      className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-primary-hover transition-colors"
                    >
                      View series
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
