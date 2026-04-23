import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ExternalLink, Github } from "lucide-react"
import { DateText } from "@/components/date-text"
import { EditorialPill, EditorialSurface, PageSection, SectionIntro } from "@/components/design-system"

interface Article {
  slug: string
  title: string
  date: string
  excerpt?: string
  readingTime?: number
  category: string
  href: string
}

interface FeaturedProject {
  slug: string
  title: string
  description: string
  status: string
  tags: string[]
  href: string
  github?: string
  demo?: string
  featuredImage?: string
}

const proofPoints = [
  "20+ years leading teams through scaling pressure, architectural change, and messy delivery contexts.",
  "Writing and advisory work across engineering leadership, architecture, and AI decision-making.",
  "Practical guidance for leaders who need clearer judgment, not heavier process.",
]

export default function HomePageClient({
  articles,
  featuredProject,
}: {
  articles: Article[]
  featuredProject: FeaturedProject | null
}) {
  return (
    <div className="ds-page flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <section aria-label="Hero" className="w-full bg-bg-paper lg:min-h-[min(85vh,720px)]">
          <div className="grid w-full grid-cols-1 lg:h-[min(85vh,720px)] lg:grid-cols-[minmax(320px,1fr)_1fr]">
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
                <div className="flex flex-col gap-3 pt-6 min-[400px]:flex-row">
                  <Button size="lg" variant="editorial" className="px-6 py-3" asChild>
                    <Link href="/writing">
                      Start With the Writing
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="quiet" size="lg" className="px-6 py-3" asChild>
                    <Link href="/services">See How I Help</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PageSection tone="base" spacing="compact" containerClassName="max-w-5xl">
          <SectionIntro
            title="How I Work"
            description="I bring technical depth, leadership experience, and a writing practice that helps make complex situations easier to reason about."
            className="mb-8"
          />
          <div className="space-y-4 border-t border-border-subtle pt-6">
            {proofPoints.map((point) => (
              <div key={point} className="flex gap-4 border-b border-border-subtle pb-4 last:border-b-0 last:pb-0">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary" aria-hidden="true" />
                <p className="ds-copy">{point}</p>
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection aria-labelledby="writing-heading" tone="base" containerClassName="max-w-5xl">
          <SectionIntro
            title="Writing"
            description="The best entry point to the site. Leadership and technical architecture, written from real-world experience building and leading teams through complexity."
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

          <div>
            {articles.length > 0 && (
              <ul className="space-y-16">
                {articles.map((article) => (
                  <li key={`${article.category}-${article.slug}`} className="border-b border-border-subtle pb-16 last:border-b-0 last:pb-0">
                    <Link href={article.href} className="group block">
                      <div className="mb-3">
                        <EditorialPill tone={article.category === "Leadership" ? "accent" : "neutral"} className="normal-case tracking-normal">
                          {article.category}
                        </EditorialPill>
                      </div>
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

            {articles.length === 0 && (
              <p className="text-text-muted">No writing yet.</p>
            )}
          </div>
        </PageSection>

        <PageSection aria-labelledby="projects-heading" tone="soft" divider containerClassName="max-w-5xl">
          <EditorialSurface className="p-8 sm:p-10">
            <SectionIntro
              title="Projects"
              description="Selected projects that explore systems, tooling, and decision-making in practice."
              kicker="Applied work"
              className="mb-6"
            />
            <p className="ds-copy max-w-xl">Applied work and exploration. What I build and why.</p>
            <p className="ds-meta mb-8 mt-3 max-w-2xl">
              These are applied explorations, not products, built to understand systems more deeply.
            </p>

            {featuredProject ? (
              <div className="overflow-hidden rounded-[1.5rem] border border-border-subtle bg-bg-paper">
                {featuredProject.featuredImage ? (
                  <div className="relative aspect-[16/8] w-full overflow-hidden border-b border-border-subtle">
                    <Image
                      src={featuredProject.featuredImage}
                      alt={featuredProject.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1023px) 100vw, 960px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                    <div className="absolute right-4 top-4">
                      <EditorialPill
                        tone={featuredProject.status === "active" ? "success" : featuredProject.status === "experimental" ? "warm" : "neutral"}
                        className="backdrop-blur-sm"
                      >
                        {featuredProject.status}
                      </EditorialPill>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-5 p-6 sm:p-8">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">Featured Project</p>
                    <Link href={featuredProject.href} className="group block">
                      <h3 className="text-2xl font-bold tracking-tight text-text-strong transition-colors group-hover:text-accent-primary sm:text-3xl">
                        {featuredProject.title}
                      </h3>
                    </Link>
                    <p className="max-w-3xl text-[0.98rem] leading-relaxed text-text-body">{featuredProject.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {featuredProject.tags.slice(0, 4).map((tag) => (
                      <EditorialPill key={tag} tone="neutral" className="normal-case tracking-normal">
                        {tag}
                      </EditorialPill>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 pt-1 min-[460px]:flex-row min-[460px]:items-center">
                    <Button variant="editorial" asChild>
                      <Link href={featuredProject.href}>
                        Explore Project
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    {featuredProject.demo ? (
                      <Button variant="quiet" asChild>
                        <Link href={featuredProject.demo} target="_blank" rel="noopener noreferrer">
                          Live Demo
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : null}
                    {featuredProject.github ? (
                      <Button variant="ghost" className="w-fit text-text-body hover:text-accent-primary" asChild>
                        <Link href={featuredProject.github} target="_blank" rel="noopener noreferrer">
                          View Code
                          <Github className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-8">
              <Link href="/projects" className="ds-link inline-block py-2 text-base">
                See all projects
              </Link>
            </div>
          </EditorialSurface>
        </PageSection>

        <PageSection aria-labelledby="contact-heading" tone="paper" spacing="roomy" containerClassName="max-w-5xl">
          <EditorialSurface className="p-8 sm:p-10">
            <SectionIntro
              title="Start a Conversation"
              description="Good fit if you want help framing a messy technical decision, improving engineering communication, or thinking through leadership and architecture tradeoffs."
              className="mb-6"
            />
            <p className="ds-meta max-w-2xl">
              The fastest way in is a short note about your context, what feels unclear, and what kind of conversation would be useful.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button variant="editorial" asChild>
                <Link href="/contact">Contact Me</Link>
              </Button>
              <Button variant="quiet" asChild>
                <Link href="/about">Read More About Me</Link>
              </Button>
            </div>
          </EditorialSurface>
        </PageSection>
      </main>
      <SiteFooter />
    </div>
  )
}
