"use client"

import { ContentLayout } from "@/components/content-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  ExternalLink,
  Github,
  Code,
  Server,
  Rocket,
  Database,
  Terminal,
  Wrench,
  LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { DateText } from "@/components/date-text"
import { SharedHero } from "@/components/shared-hero"

interface ProjectClientPageProps {
  project: {
    slug: string
    title: string
    description: string
    subtitle?: string
    status: "active" | "experimental" | "archived"
    tags: string[]
    github?: string | null
    demo?: string | null
    icon: string
    featured_image?: string
    date: string
    content?: string
  }
}

const iconMap: Record<string, LucideIcon> = {
  Code,
  Server,
  Rocket,
  Database,
  Terminal,
  Wrench,
}

export function ProjectClientPage({ project }: ProjectClientPageProps) {
  const IconComponent = iconMap[project.icon] || Code

  return (
    <ContentLayout>
      <div className="max-w-4xl mx-auto">
        <SharedHero
          breadcrumbLabel="Projects"
          breadcrumbUrl="/projects"
          backLabel="Back to Projects"
          backUrl="/projects"
          showBackLink={false}
          title={project.title}
          subtitle={project.subtitle || project.description}
          imageSrc={project.featured_image || undefined}
          imageAlt={project.title}
          imagePriority={Boolean(project.featured_image)}
          metaItems={
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <DateText
                value={project.date}
                options={{
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }}
              />
            </div>
          }
          overlayBadge={
            <div className="absolute top-4 right-4">
              <Badge
                variant={project.status === "active" ? "default" : "secondary"}
                className={
                  project.status === "active"
                    ? "bg-emerald-500/30 text-emerald-100 border border-emerald-300/30"
                    : project.status === "experimental"
                    ? "bg-amber-500/30 text-amber-100 border border-amber-300/30"
                    : "bg-slate-500/30 text-slate-100 border border-slate-300/30"
                }
              >
                {project.status}
              </Badge>
            </div>
          }
        />

        {!project.featured_image && (
          <div className="mb-6 flex items-center gap-2">
            <Badge
              variant={project.status === "active" ? "default" : "secondary"}
              className={
                project.status === "active"
                  ? "bg-emphasis/20 text-emphasis"
                  : project.status === "experimental"
                  ? "bg-accent-secondary/20 text-text-secondary"
                  : "bg-text-muted/30 text-text-secondary"
              }
            >
              {project.status}
            </Badge>
            <div className="p-2 bg-accent-primary/15 rounded-lg">
              <IconComponent className="h-5 w-5 text-accent-primary" />
            </div>
          </div>
        )}

        <div className="mb-8 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-bg-secondary text-text-secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {(project.github || project.demo) && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-muted">Links:</span>
              {project.github && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-text-muted hover:text-text-strong !hover:bg-transparent !active:bg-transparent !focus-visible:bg-transparent"
                  asChild
                >
                  <Link href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                    View Code<span className="sr-only"> (opens in new tab)</span>
                  </Link>
                </Button>
              )}
              {project.demo && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-text-muted hover:text-text-strong !hover:bg-transparent !active:bg-transparent !focus-visible:bg-transparent"
                  asChild
                >
                  <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                    Live Demo<span className="sr-only"> (opens in new tab)</span>
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>

        {project.content && (
          <article className="prose prose-blue max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: project.content || "" }} />
          </article>
        )}
      </div>
    </ContentLayout>
  )
}
