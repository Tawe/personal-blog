import { Metadata } from "next"
import Link from "next/link"
import { buildMetadata } from "@/lib/seo-metadata"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BreadcrumbSchema } from "@/components/breadcrumb-schema"

export const metadata: Metadata = buildMetadata({
  title: "Technical Leadership Mentoring | John Munn",
  description:
    "Technical leadership mentoring for engineering managers, staff+ engineers, and heads of engineering navigating complex decisions, organizational friction, and expanding scope.",
  path: "/services/mentoring",
  keywords: [
    "technical leadership mentoring",
    "engineering leadership mentoring",
    "engineering management coaching",
    "staff engineer leadership",
    "head of engineering mentoring",
    "technical decision making",
    "leadership communication for engineers",
    "organizational design for engineering teams",
  ],
})

export default function MentoringPage() {
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
                { name: "Technical Leadership Mentoring", url: "/services/mentoring" },
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
                <li className="text-text-secondary">Technical Leadership Mentoring</li>
              </ol>
            </nav>
            <header className="mb-12">
              <h1 className="text-3xl font-bold tracking-tight text-text-strong sm:text-4xl">Technical Leadership Mentoring</h1>
              <p className="mt-5 text-lg text-text-body leading-relaxed">
                Mentoring, in this context, is a structured place to think clearly about difficult leadership problems.
                It exists because technical leadership is rarely blocked by a lack of effort. More often, it is blocked by
                unclear tradeoffs, noisy context, and decisions that carry organizational consequences.
              </p>
              <p className="mt-4 text-text-body leading-relaxed">
                I work with leaders on the real situations they are handling now: architecture choices, team design,
                stakeholder alignment, and the communication load that comes with broader scope.
              </p>
            </header>

            <section className="border-t border-border-subtle pt-10">
              <h2 className="text-2xl font-semibold text-text-strong">What This Helps With</h2>
              <p className="mt-4 text-text-body leading-relaxed">
                Most conversations center on a few recurring leadership realities.
              </p>
              <ul className="mt-5 space-y-3 text-text-body leading-relaxed">
                <li>Making high-impact technical decisions under uncertainty, without defaulting to false precision</li>
                <li>Stepping from staff-level execution into broader leadership accountability</li>
                <li>Designing team ownership, delegation, and operating rhythms that reduce escalation loops</li>
                <li>Explaining technical risk and direction to non-technical stakeholders in ways that hold up over time</li>
                <li>Navigating cross-functional friction and organizational constraints without losing technical coherence</li>
              </ul>
            </section>

            <section className="border-t border-border-subtle pt-10 mt-12">
              <h2 className="text-2xl font-semibold text-text-strong">How Sessions Typically Work</h2>
              <p className="mt-4 text-text-body leading-relaxed">
                The format is intentionally simple.
              </p>
              <div className="mt-5 space-y-5">
                <p className="text-text-body leading-relaxed">
                  <span className="font-medium text-text-strong">1. Context and constraints first.</span> We start with
                  what is actually happening in your environment, not a generic framework.
                </p>
                <p className="text-text-body leading-relaxed">
                  <span className="font-medium text-text-strong">2. Work the live problem.</span> Sessions focus on
                  decisions currently in flight and the communication required around them.
                </p>
                <p className="text-text-body leading-relaxed">
                  <span className="font-medium text-text-strong">3. Leave with concrete next moves.</span> You should
                  finish with clearer judgment, sharper framing, and specific actions you can apply immediately.
                </p>
                <p className="text-sm text-text-muted">
                  Most engagements run as recurring one-on-one conversations, adjusted to your current decision load.
                </p>
              </div>
            </section>

            <section className="border-t border-border-subtle pt-10 mt-12">
              <h2 className="text-2xl font-semibold text-text-strong">Who This Is a Good Fit For</h2>
              <ul className="mt-5 space-y-3 text-text-body leading-relaxed">
                <li>Engineering managers carrying heavier strategic and organizational complexity</li>
                <li>Staff and principal engineers moving into leadership responsibilities</li>
                <li>Heads of engineering balancing short-term delivery pressure with long-term system health</li>
                <li>Technical leaders who need a grounded sounding board for high-stakes decisions</li>
              </ul>
            </section>

            <section className="border-t border-border-subtle pt-10 mt-12">
              <h2 className="text-2xl font-semibold text-text-strong">Conversation</h2>
              <p className="mt-4 text-text-body leading-relaxed">
                If you are working through a decision that feels consequential and want a clear second perspective,
                <Link
                  href="/contact"
                  className="ml-1 text-accent-primary hover:text-accent-primary-hover underline underline-offset-2 font-medium"
                >
                  get in touch
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
