import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Dice6, GraduationCap, Lightbulb, MessageSquare, Target } from "lucide-react"

import { buildMetadata } from "@/lib/seo-metadata"
import { ContentLayout } from "@/components/content-layout"
import { EditorialSurface, FeatureCard, PageSection, RuleHeading, SectionIntro } from "@/components/design-system"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = buildMetadata({
  title: "Services | Technical Leadership & Team Development",
  description: "Technical leadership mentoring and team development services for engineering organizations.",
  path: "/services",
  keywords: ["technical leadership mentoring", "engineering team development", "team building for engineers"],
})

const services = [
  {
    title: "D&D Team Building",
    href: "/services/team-building",
    icon: Dice6,
    kicker: "For teams",
    summary: "Structured tabletop facilitation for engineering teams that need better collaboration under pressure.",
    audience: "Best for teams dealing with coordination debt, low-trust handoffs, or communication breakdowns during delivery.",
    outcomes: [
      "Make team communication patterns visible",
      "Expose role ambiguity and handoff friction",
      "Build shared language around coordination and accountability",
    ],
    primaryCta: "Explore Team Building",
  },
  {
    title: "Technical Leadership Mentoring",
    href: "/services/mentoring",
    icon: GraduationCap,
    kicker: "For leaders",
    summary: "One-on-one mentoring for engineering leaders working through consequential technical and organizational decisions.",
    audience: "Best for managers, staff+ engineers, and heads of engineering navigating broader scope and noisier tradeoffs.",
    outcomes: [
      "Clarify difficult leadership and architecture decisions",
      "Improve communication with non-technical stakeholders",
      "Leave with sharper framing and concrete next moves",
    ],
    primaryCta: "Explore Mentoring",
  },
]

const principles = [
  {
    title: "Practical and Grounded",
    body: "The work is based on live decisions, real team constraints, and frameworks that hold up under pressure.",
    icon: Target,
  },
  {
    title: "Creative Without Being Vague",
    body: "Unusual formats are useful only when they produce clearer thinking, better behavior, and stronger execution.",
    icon: Lightbulb,
  },
  {
    title: "Built Around Conversation",
    body: "The value is not advice thrown over the wall. It is structured dialogue that improves judgment and action.",
    icon: MessageSquare,
  },
]

export default function ServicesPage() {
  return (
    <ContentLayout>
      <div className="space-y-16 md:space-y-20">
        <section className="mx-auto max-w-4xl text-center">
          <p className="ds-kicker mb-4">Services</p>
          <h1 className="ds-heading mb-5">Structured support for engineering teams and technical leaders</h1>
          <p className="ds-lead mx-auto max-w-3xl">
            I offer two focused services: team-building work for organizations that need better coordination, and
            mentoring for leaders carrying harder technical and organizational decisions.
          </p>
        </section>

        <PageSection tone="paper" spacing="compact" containerClassName="max-w-6xl">
          <SectionIntro
            title="What I Offer"
            description="Both offers are built for practical environments where better judgment, communication, and coordination matter more than motivational theater."
            className="mb-10"
          />
          <div className="grid gap-8 lg:grid-cols-2">
            {services.map(({ title, href, icon: Icon, kicker, summary, audience, outcomes, primaryCta }) => (
              <FeatureCard
                key={title}
                icon={Icon}
                kicker={kicker}
                title={title}
                summary={summary}
                footer={
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button variant="editorial" asChild>
                      <Link href={href}>
                        {primaryCta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="quiet" asChild>
                      <Link href="/contact">Start a Conversation</Link>
                    </Button>
                  </div>
                }
              >
                <div className="space-y-6">
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">Good fit</p>
                    <p className="ds-copy">{audience}</p>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">Typical outcomes</p>
                    <ul className="space-y-3 text-text-body">
                      {outcomes.map((outcome) => (
                        <li key={outcome} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent-primary" aria-hidden="true" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FeatureCard>
            ))}
          </div>
        </PageSection>

        <PageSection tone="soft" spacing="compact" containerClassName="max-w-5xl">
          <SectionIntro
            title="How I Work"
            description="The format differs by service, but the philosophy is the same: start from the real situation, make the important dynamics visible, and leave with concrete actions."
            className="mb-10"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {principles.map(({ title, body, icon: Icon }) => (
              <EditorialSurface key={title} className="h-full p-6">
                <div className="mb-4 inline-flex rounded-lg bg-bg-soft p-2 text-accent-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-text-strong">{title}</h3>
                <p className="ds-copy">{body}</p>
              </EditorialSurface>
            ))}
          </div>
        </PageSection>

        <PageSection tone="paper" spacing="compact" containerClassName="max-w-4xl">
          <EditorialSurface className="p-8 text-center sm:p-10">
            <RuleHeading as="h2" className="mx-auto mb-4">
              Next Step
            </RuleHeading>
            <p className="ds-lead mx-auto max-w-2xl">
              If one of these offers sounds relevant, the best first move is a short conversation about your context and goals.
            </p>
            <p className="ds-copy mx-auto mt-4 max-w-2xl">
              We can quickly determine whether the fit is real, what format makes sense, and whether a focused engagement would be useful.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="editorial" asChild>
                <Link href="/contact">Contact Me</Link>
              </Button>
              <Button variant="quiet" asChild>
                <Link href="/writing">Read the Writing First</Link>
              </Button>
            </div>
          </EditorialSurface>
        </PageSection>
      </div>
    </ContentLayout>
  )
}
