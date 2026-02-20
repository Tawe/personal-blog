"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-bg-primary to-bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-12 max-w-5xl mx-auto">
              <div className="flex flex-col justify-center space-y-6">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl xl:text-5xl text-text-strong">
                  About
                </h1>
                <p className="text-text-body leading-relaxed">
                  I'm an engineering leader and writer who's spent the last two decades working at the intersection of technology, people, and the systems that connect them.
                </p>
                <p className="text-text-body leading-relaxed">
                  Most of my career has been about helping teams navigate complexity, not the abstract kind, but the real kind that shows up as technical debt, scaling pressure, unclear ownership, and well-intentioned decisions compounding over time. I've learned that progress usually comes less from heroic fixes and more from seeing what's actually happening, then making steady, deliberate changes that people can sustain.
                </p>
                <p className="text-text-body leading-relaxed">
                  I care deeply about how systems behave under stress. Codebases, teams, and organizations all reveal their true shape when things get hard, and that's where most of my thinking lives. I'm interested in how structure influences behavior, how narratives shape alignment, and how leaders can hold uncertainty without rushing to oversimplify it.
                </p>
                <p className="text-text-body leading-relaxed">
                  Outside of the work itself, I value calm, curiosity, and generosity of thought. I enjoy mentoring, writing, and exchanging ideas with people who are trying to build things that last, whether that's software, teams, or cultures.
                </p>
                <p className="text-text-body leading-relaxed">
                  I also write in the{" "}
                  <Link
                    href="/strategic-narratives/world-of-artumin"
                    className="text-accent-primary hover:text-accent-primary-hover underline underline-offset-2 font-medium"
                  >
                    World of Artumin
                  </Link>
                  , where I explore strategic and leadership ideas through narrative.
                </p>
                <p className="text-text-body leading-relaxed pt-2">
                  If you're interested in talking, about leadership, architecture, or a problem you're trying to untangle, the best next step is{" "}
                  <Link href="/contact" className="text-accent-primary hover:text-accent-primary-hover underline underline-offset-2 font-medium">
                    getting in touch
                  </Link>
                  .
                </p>
              </div>
              <div className="flex items-start justify-center lg:justify-end">
                <div className="relative">
                  <Image
                    src="/me.png"
                    width={320}
                    height={320}
                    alt="John Munn"
                    className="rounded-xl object-cover aspect-square"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
