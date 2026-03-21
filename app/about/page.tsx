"use client"

import Image from "next/image"
import Link from "next/link"

import { BreadcrumbSchema } from "@/components/breadcrumb-schema"
import { ContentLayout } from "@/components/content-layout"
import { EditorialSurface, PageSection, SectionIntro } from "@/components/design-system"
import { Button } from "@/components/ui/button"

const focusAreas = [
  {
    title: "Leadership Under Pressure",
    body: "Helping engineering teams and leaders make better decisions when scope grows, ownership blurs, and systems become harder to reason about.",
  },
  {
    title: "Architecture With Consequences",
    body: "Connecting technical architecture to organizational realities, so strategy is grounded in how teams actually build and operate software.",
  },
  {
    title: "Narrative as a Thinking Tool",
    body: "Using writing and structured explanation to make complicated systems easier to understand, communicate, and improve.",
  },
]

const trustSignals = [
  "Two decades working across software delivery, architecture, and engineering leadership",
  "Writing across leadership, technical systems, AI tradeoffs, worldbuilding, and tabletop design",
  "Advisory work that favors practical judgment over abstract playbooks",
]

export default function AboutPage() {
  return (
    <ContentLayout>
      <div className="space-y-16 md:space-y-20">
        <section className="mx-auto max-w-5xl">
          <BreadcrumbSchema
            items={[
              { name: "Home", url: "/" },
              { name: "About", url: "/about" },
            ]}
          />
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="space-y-6">
              <p className="ds-kicker">About</p>
              <h1 className="ds-heading">Engineering leadership, technical strategy, and systems that have to survive real conditions</h1>
              <p className="ds-lead max-w-3xl">
                I&apos;m an engineering leader and writer focused on the intersection of technology, people, and the systems that connect them.
              </p>
              <p className="ds-copy">
                Most of my work has been about helping teams navigate complexity that does not stay politely technical. It shows up as scaling pressure, unclear ownership, communication debt, architecture drift, and decisions that make sense locally but compound badly over time.
              </p>
              <p className="ds-copy">
                I care about how systems behave under stress: codebases, teams, organizations, and the narratives people use to understand what is happening. That is the throughline behind the writing, the mentoring, and the kinds of conversations I tend to be most useful in.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="editorial" asChild>
                  <Link href="/contact">Start a Conversation</Link>
                </Button>
                <Button variant="quiet" asChild>
                  <Link href="/writing">Read the Writing</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-paper shadow-[var(--shadow-soft)]">
                <Image
                  src="/me.png"
                  width={320}
                  height={360}
                  alt="John Munn"
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <PageSection tone="paper" spacing="compact" containerClassName="max-w-6xl">
          <SectionIntro
            title="What I Help With"
            description="The common thread is not a single technology. It is making difficult systems and difficult decisions easier to understand and move through."
            className="mb-10"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {focusAreas.map((area) => (
              <EditorialSurface key={area.title} className="h-full p-6">
                <h2 className="mb-3 text-xl font-semibold text-text-strong">{area.title}</h2>
                <p className="ds-copy">{area.body}</p>
              </EditorialSurface>
            ))}
          </div>
        </PageSection>

        <PageSection tone="soft" spacing="compact" containerClassName="max-w-5xl">
          <EditorialSurface className="p-8 sm:p-10">
            <SectionIntro
              title="Why This Perspective"
              description="I am most useful when the problem is messy enough that technical, organizational, and narrative issues are all entangled."
              className="mb-8"
            />
            <ul className="space-y-4 text-text-body">
              {trustSignals.map((signal) => (
                <li key={signal} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent-primary" aria-hidden="true" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
            <p className="ds-copy mt-8">
              I also write in the{" "}
              <Link href="/strategic-narratives/world-of-artumin" className="ds-link">
                World of Artumin
              </Link>
              , where strategic and leadership ideas get tested through narrative rather than direct argument.
            </p>
          </EditorialSurface>
        </PageSection>

        <PageSection tone="paper" spacing="compact" containerClassName="max-w-4xl">
          <EditorialSurface className="p-8 text-center sm:p-10">
            <SectionIntro
              title="Who This Is For"
              description="Engineering leaders, staff+ engineers, founders, and teams trying to think more clearly about architecture, communication, and change."
              align="center"
              className="mb-6"
            />
            <p className="ds-copy mx-auto max-w-2xl">
              If that sounds close to the problems you are working through, the best next step is a direct note about your situation and what kind of conversation would be useful.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="editorial" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <Button variant="quiet" asChild>
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </EditorialSurface>
        </PageSection>
      </div>
    </ContentLayout>
  )
}
