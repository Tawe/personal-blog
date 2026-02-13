"use client"

import { ContentLayout } from "@/components/content-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  ArrowLeft,
  ExternalLink,
  Github,
  Code,
  Server,
  Rocket,
  Database,
  Terminal,
  Wrench,
  LucideIcon,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DateText } from "@/components/date-text"

interface ProjectClientPageProps {
  project: {
    slug: string
    title: string
    description: string
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

// Map icon strings to icon components
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
        <div className="mb-8">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-text-muted">
            <Link
              href="/workbench"
              className="hover:text-text-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              Workbench
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
            <span className="text-text-strong" aria-current="page">
              {project.title}
            </span>
          </nav>
        </div>

        <div className="mb-8">
          <Button
            variant="ghost"
            className="text-text-muted hover:text-text-strong !hover:bg-transparent !active:bg-transparent !focus-visible:bg-transparent"
            asChild
          >
            <Link href="/workbench">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Workbench
            </Link>
          </Button>
        </div>

        <header className="mb-8">
          {project.featured_image && (
            <div className="relative mb-8 rounded-xl overflow-hidden">
              <Image
                src={project.featured_image}
                alt=""
                width={800}
                height={400}
                className="aspect-video w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">{project.title}</h1>
                  <h2 className="text-2xl text-slate-100 font-medium mt-2 mb-4">{project.description}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-slate-200">
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
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {!project.featured_image && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent-primary/15 rounded-lg">
                  <IconComponent className="h-8 w-8 text-accent-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl lg:text-5xl font-bold text-text-strong leading-tight mb-2">{project.title}</h1>
                  <h2 className="text-2xl text-text-body font-medium mt-2 mb-4">{project.description}</h2>
                  <div className="flex items-center gap-4 mb-4">
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
                    <div className="flex items-center gap-2 text-text-muted">
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
                  </div>
                </div>
              </div>
            )}

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
        </header>

        {project.content && (
          <article className="prose prose-blue max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: project.content || "" }} />
          </article>
        )}
      </div>
    </ContentLayout>
  )
}
