import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Boxes, GitCompareArrows, ClipboardCheck } from "lucide-react"

const experiences = [
  {
    title: "API vs Message vs Event-Driven Architecture",
    href: "/interactive/architecture-playground",
    description:
      "Compare API-driven, message-driven, and event-driven systems with interactive diagrams, tradeoff filters, and scenario guidance.",
    icon: GitCompareArrows,
  },
  {
    title: "The RAG Atlas",
    href: "/interactive/rag-atlas",
    description:
      "Explore retrieval patterns with node inspection, animated dataflow, and simulation controls for latency/cost/accuracy tradeoffs.",
    icon: Boxes,
  },
  {
    title: "Interactive AI Evals Explainer",
    href: "/interactive/ai-evals-explainer",
    description:
      "Learn how to evaluate RAG systems, agents, and copilots with practical tradeoffs, failure modes, and maturity stages.",
    icon: ClipboardCheck,
  },
]

export default function InteractiveHubPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <section className="rounded-2xl border border-border bg-gradient-to-r from-white via-slate-50 to-blue-50 p-6 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Interactive Labs</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            A unified place for interactive architecture explorations and visual learning tools.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {experiences.map((experience) => {
            const Icon = experience.icon
            return (
              <Link
                key={experience.href}
                href={experience.href}
                className="group rounded-xl border border-border bg-card p-5 transition hover:border-accent-primary hover:bg-accent/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-slate-900 dark:hover:bg-slate-800/80"
              >
                <div className="flex items-start gap-3">
                  <span className="rounded-lg border border-border bg-muted p-2 text-accent-primary dark:bg-slate-800">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-card-foreground group-hover:text-accent-primary">
                      {experience.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{experience.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
