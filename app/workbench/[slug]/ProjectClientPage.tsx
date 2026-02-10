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
        {/* Back Navigation */}
        <div className="mb-8">
          <Button variant="ghost" className="text-slate-400 hover:text-slate-200" asChild>
            <Link href="/workbench">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Workbench
            </Link>
          </Button>
        </div>

        {/* Project Header */}
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
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <IconComponent className="h-8 w-8 text-blue-400" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 leading-tight mb-2">
                  {project.title}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <Badge
                    variant={project.status === "active" ? "default" : "secondary"}
                    className={
                      project.status === "active"
                        ? "bg-green-600/20 text-green-300"
                        : project.status === "experimental"
                        ? "bg-yellow-600/20 text-yellow-300"
                        : "bg-slate-600/20 text-slate-300"
                    }
                  >
                    {project.status}
                  </Badge>
                  <div className="flex items-center gap-2 text-slate-400">
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

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-slate-700/50 text-slate-300">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* External Links */}
            {(project.github || project.demo) && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-300">Links:</span>
                {project.github && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                      View Code<span className="sr-only"> (opens in new tab)</span>
                    </Link>
                  </Button>
                )}
                {project.demo && (
                  <Button variant="ghost" size="sm" asChild>
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

        {/* Project Content */}
        {project.content && (
          <article className="prose prose-blue max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: project.content || "" }} />
          </article>
        )}
      </div>
    </ContentLayout>
  )
}

