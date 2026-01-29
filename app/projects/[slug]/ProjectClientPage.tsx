"use client"

import { ContentLayout } from "@/components/content-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft, ExternalLink, Github, Code, Server, Rocket, Database, Terminal, Wrench, LucideIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
          <Button variant="ghost" className="text-text-secondary hover:text-accent-primary" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </div>

        <header className="mb-8">
          {project.featured_image && (
            <div className="relative mb-8 rounded-xl overflow-hidden">
              <Image
                src={project.featured_image}
                alt={project.title}
                width={800}
                height={400}
                className="aspect-video w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-text-primary/40 to-transparent" />
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent-primary/15 rounded-lg">
                <IconComponent className="h-8 w-8 text-accent-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-2">
                  {project.title}
                </h1>
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
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(project.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-bg-secondary text-text-secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {(project.github || project.demo) && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-text-secondary">Links:</span>
                {project.github && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </Link>
                  </Button>
                )}
                {project.demo && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </header>

        {project.content && (
          <article className="prose prose-invert prose-blue max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: project.content || "" }} />
          </article>
        )}
      </div>
    </ContentLayout>
  )
}
