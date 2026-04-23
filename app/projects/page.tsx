import path from "path"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Code, ExternalLink, Github, Server, Rocket, Globe, Database, Terminal, Wrench, type LucideIcon } from "lucide-react"

import { EditorialPill, EditorialSurface, RuleHeading } from "@/components/design-system"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { CollectionPageSchema } from "@/components/collection-page-schema"
import { getAllProjectsLightweight } from "@/lib/project-utils"
import { buildMetadata } from "@/lib/seo-metadata"

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Applied engineering projects, interactive experiments, tools, and prototypes by John Munn across AI systems, simulations, developer tools, and browser-based experiences.",
  path: "/projects",
  keywords: [
    "engineering projects",
    "software projects",
    "developer tools",
    "interactive simulations",
    "browser games",
    "John Munn projects",
  ],
  image: "/me.jpeg",
  imageAlt: "Projects by John Munn",
})

const iconMap: Record<string, LucideIcon> = {
  Code,
  Server,
  Rocket,
  Globe,
  Database,
  Terminal,
  Wrench,
}

function getStatusTone(status: string) {
  switch (status) {
    case "active":
      return "success" as const
    case "experimental":
      return "warm" as const
    default:
      return "neutral" as const
  }
}

export default function ProjectsPage() {
  const contentDir = path.join(process.cwd(), "content/projects")
  const projects = getAllProjectsLightweight(contentDir)
  const schemaItems = projects.map((project) => ({
    title: project.title,
    url: `https://johnmunn.tech/projects/${project.slug}`,
    date: project.date,
    excerpt: project.description,
  }))

  return (
    <div className="flex min-h-screen flex-col">
      <CollectionPageSchema
        name="Projects"
        description="Applied engineering projects, prototypes, tools, and interactive experiments by John Munn."
        url="https://johnmunn.tech/projects"
        about={["Engineering projects", "Developer tools", "Interactive simulations", "Applied systems thinking"]}
        items={schemaItems}
        itemType="SoftwareSourceCode"
      />
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <section className="w-full bg-bg-paper py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="max-w-2xl">
              <RuleHeading as="h1" tone="page" className="mb-4">
                Projects
              </RuleHeading>
              <p className="mb-3 mt-3 text-xl font-normal text-text-body">Applied work and exploration</p>
              <p className="max-w-[600px] text-text-body font-normal leading-relaxed md:text-lg">
                These are applied explorations, not products, built to understand systems more deeply. Each project
                communicates what it explores and what it says about how I think.
              </p>
              <div className="mt-6">
                <Link
                  href="/writing"
                  className="inline-block py-2 text-base font-medium text-accent-primary underline decoration-accent-primary/40 underline-offset-4 transition-colors hover:text-accent-primary-hover hover:decoration-accent-primary"
                >
                  Explore Writing
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="w-full bg-bg-soft py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mb-12">
              <RuleHeading as="h2" className="mb-2">
                What I&apos;m building
              </RuleHeading>
            </div>
            {projects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => {
                  const IconComponent = iconMap[project.icon] || Code
                  return (
                    <Link key={project.slug} href={`/projects/${project.slug}`} className="group block">
                      <EditorialSurface className="flex h-full cursor-pointer flex-col overflow-hidden transition-all duration-300 group-hover:border-accent-primary/40 group-hover:shadow-[var(--shadow-lift)]">
                        {project.featured_image ? (
                          <div className="relative h-48 w-full overflow-hidden">
                            <Image
                              src={project.featured_image}
                              alt=""
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:hover:transform-none"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/60 via-text-primary/10 to-transparent" />
                            <div className="absolute right-3 top-3">
                              <EditorialPill tone={getStatusTone(project.status)} className="backdrop-blur-sm">
                                {project.status}
                              </EditorialPill>
                            </div>
                          </div>
                        ) : null}
                        <div className="p-6">
                          <div className="mb-2 flex items-start justify-between gap-3">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              {!project.featured_image ? (
                                <div className="flex-shrink-0 rounded-lg bg-accent-primary/15 p-2">
                                  <IconComponent className="h-6 w-6 text-accent-primary" />
                                </div>
                              ) : null}
                              <h2 className="line-clamp-2 text-2xl font-semibold tracking-tight text-text-strong transition-colors group-hover:text-accent-primary">
                                {project.title}
                              </h2>
                            </div>
                            {!project.featured_image ? (
                              <EditorialPill tone={getStatusTone(project.status)} className="shrink-0">
                                {project.status}
                              </EditorialPill>
                            ) : null}
                          </div>
                          <p className="line-clamp-3 font-normal leading-relaxed text-text-body">{project.description}</p>
                        </div>
                        <div className="flex flex-1 flex-col justify-between px-6 pb-6 pt-0">
                          <div className="flex flex-wrap gap-2">
                            {project.tags.slice(0, 3).map((tag, tagIndex) => (
                              <EditorialPill key={tagIndex} tone="neutral" className="normal-case tracking-normal">
                                {tag}
                              </EditorialPill>
                            ))}
                            {project.tags.length > 3 ? (
                              <EditorialPill tone="neutral" className="normal-case tracking-normal">
                                +{project.tags.length - 3}
                              </EditorialPill>
                            ) : null}
                          </div>
                          {project.github || project.demo ? (
                            <div className="mt-2 flex items-center gap-2 border-t border-border-subtle pt-2 text-xs text-text-muted">
                              {project.github ? (
                                <div className="flex items-center gap-1">
                                  <Github className="h-3 w-3" />
                                  <span>Code</span>
                                </div>
                              ) : null}
                              {project.github && project.demo ? <span>•</span> : null}
                              {project.demo ? (
                                <div className="flex items-center gap-1">
                                  <ExternalLink className="h-3 w-3" />
                                  <span>Demo</span>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      </EditorialSurface>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-text-muted">No projects yet. Check back soon.</p>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
