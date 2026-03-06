import { Metadata } from "next"
import Link from "next/link"
import { buildMetadata } from "@/lib/seo-metadata"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BreadcrumbSchema } from "@/components/breadcrumb-schema"

export const metadata: Metadata = buildMetadata({
  title: "D&D Team Building for Technical Organizations | John Munn",
  description:
    "D&D team building for engineering organizations: structured tabletop facilitation to improve communication, collaboration, and decision-making under pressure.",
  path: "/services/team-building",
  keywords: [
    "engineering team building",
    "technical team facilitation",
    "D&D team building",
    "team dynamics workshop for engineers",
    "cross functional collaboration workshop",
    "engineering communication workshop",
    "technical team decision making",
  ],
  image: "/teambuilding.png",
  imageAlt: "D&D Team Building for Technical Organizations",
})

export default function TeamBuildingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-bg-base">
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <BreadcrumbSchema
              items={[
                { name: "Home", url: "/" },
                { name: "About", url: "/about" },
                { name: "D&D Team Building", url: "/services/team-building" },
              ]}
            />
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-text-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-accent-primary transition-colors">Home</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/about" className="hover:text-accent-primary transition-colors">About</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-text-secondary">D&D Team Building</li>
              </ol>
            </nav>
            <header className="mb-12">
              <h1 className="text-3xl font-bold tracking-tight text-text-strong sm:text-4xl">D&D Team Building</h1>
              <p className="mt-5 text-lg text-text-body leading-relaxed">
                This is a facilitated team exercise for technical organizations, not a novelty event. It exists to help
                teams see how they communicate, decide, and coordinate under pressure, then improve those patterns in a
                practical way.
              </p>
              <p className="mt-4 text-text-body leading-relaxed">
                D&D creates a useful mirror for engineering work: ambiguous information, interdependent roles,
                constrained resources, and decisions with consequences. The value is not the game itself. The value is
                what becomes visible when the team has to think and act together.
              </p>
            </header>

            <section className="border-t border-border-subtle pt-10">
              <h2 className="text-2xl font-semibold text-text-strong">What This Helps With</h2>
              <p className="mt-4 text-text-body leading-relaxed">
                Most teams use this format when collaboration issues are present but difficult to diagnose directly.
              </p>
              <ul className="mt-5 space-y-3 text-text-body leading-relaxed">
                <li>Communication breakdowns during high-pressure work</li>
                <li>Unclear role boundaries and repeated handoff friction</li>
                <li>Decision patterns that over-index on speed or consensus without clarity</li>
                <li>Low trust across functions, even when individual contributors are strong</li>
                <li>A need for shared language around coordination and accountability</li>
              </ul>
            </section>

            <section className="border-t border-border-subtle pt-10 mt-12">
              <h2 className="text-2xl font-semibold text-text-strong">How Sessions Typically Work</h2>
              <p className="mt-4 text-text-body leading-relaxed">
                The structure is straightforward and intentionally grounded.
              </p>
              <div className="mt-5 space-y-5">
                <p className="text-text-body leading-relaxed">
                  <span className="font-medium text-text-strong">1. Context and objectives.</span> We begin with your
                  team context and what you want to learn or improve.
                </p>
                <p className="text-text-body leading-relaxed">
                  <span className="font-medium text-text-strong">2. Facilitated scenario session.</span> The team works
                  through a structured tabletop scenario while I observe interaction patterns and decision dynamics.
                </p>
                <p className="text-text-body leading-relaxed">
                  <span className="font-medium text-text-strong">3. Debrief and translation.</span> We connect what
                  happened in-session to day-to-day engineering work and identify concrete adjustments.
                </p>
                <p className="text-sm text-text-muted">
                  Sessions can be scoped for intact engineering teams or cross-functional leadership groups.
                </p>
              </div>
            </section>

            <section className="border-t border-border-subtle pt-10 mt-12">
              <h2 className="text-2xl font-semibold text-text-strong">Who This Is a Good Fit For</h2>
              <ul className="mt-5 space-y-3 text-text-body leading-relaxed">
                <li>Engineering teams navigating growth, reorgs, or changing ownership boundaries</li>
                <li>Leaders who want to improve collaboration quality without performative team-building exercises</li>
                <li>Organizations dealing with coordination debt across product, engineering, and operations</li>
                <li>Teams that value practical reflection and are willing to adjust behavior, not just discuss it</li>
              </ul>
            </section>

            <section className="border-t border-border-subtle pt-10 mt-12">
              <h2 className="text-2xl font-semibold text-text-strong">Conversation</h2>
              <p className="mt-4 text-text-body leading-relaxed">
                If this sounds relevant for your team,
                <Link
                  href="/contact"
                  className="ml-1 text-accent-primary hover:text-accent-primary-hover underline underline-offset-2 font-medium"
                >
                  get in touch
                </Link>
                . We can quickly determine whether this format fits your goals and context.
              </p>
              <p className="mt-4 text-text-body leading-relaxed">
                If you're looking for one-on-one leadership support instead, see
                <Link
                  href="/services/mentoring"
                  className="ml-1 text-accent-primary hover:text-accent-primary-hover underline underline-offset-2 font-medium"
                >
                  technical leadership mentoring
                </Link>
                .
              </p>
            </section>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
