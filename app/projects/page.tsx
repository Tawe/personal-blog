"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Code, ExternalLink, Github, Server, Rocket, Database, Terminal, Wrench, LucideIcon } from "lucide-react"
import Image from "next/image"

interface Project {
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
}

const iconMap: Record<string, LucideIcon> = {
  Code,
  Server,
  Rocket,
  Database,
  Terminal,
  Wrench,
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects")
        const data = await response.json()
        setProjects(data.projects || [])
      } catch (error) {
        console.error("Error fetching projects:", error)
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <section className="w-full py-16 md:py-24 lg:py-32 bg-bg-paper">
          <div className="container px-4 md:px-6">
            <div className="max-w-2xl">
              <h1 className="section-title text-3xl font-bold tracking-tight sm:text-4xl xl:text-5xl text-text-strong mb-4 w-fit">
                Projects
              </h1>
              <p className="text-xl text-text-body font-normal mb-3 mt-3">
                Applied work and exploration
              </p>
              <p className="max-w-[600px] text-text-body md:text-lg leading-relaxed font-normal">
                These are applied explorations, not products, built to understand systems more deeply. Each project communicates what it explores and what it says about how I think.
              </p>
              <div className="mt-6">
                <Link
                  href="/writing"
                  className="inline-block text-base text-accent-primary hover:text-accent-primary-hover font-medium py-2 underline underline-offset-4 decoration-accent-primary/40 hover:decoration-accent-primary transition-colors"
                >
                  Explore Writing
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="w-full py-16 md:py-24 lg:py-32 bg-bg-soft">
          <div className="container px-4 md:px-6">
            <div className="mb-12">
              <h2 className="section-title text-2xl font-bold tracking-tight text-text-strong mb-2 w-fit">What I'm building</h2>
           
            </div>
            <div aria-live="polite" aria-busy={isLoading}>
            {isLoading ? (
              <p className="text-text-muted text-sm">Loading projects...</p>
            ) : projects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => {
                  const IconComponent = iconMap[project.icon] || Code
                  return (
                    <Link key={project.slug} href={`/projects/${project.slug}`} className="block">
                      <Card className="bg-white border-border-subtle hover:border-accent-primary/40 transition-all duration-300 flex flex-col h-full cursor-pointer group overflow-hidden shadow-sm">
                        {project.featured_image && (
                          <div className="relative w-full h-48 overflow-hidden">
                            <Image
                              src={project.featured_image}
                              alt=""
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/60 via-text-primary/10 to-transparent" />
                            <div className="absolute top-3 right-3">
                              <Badge
                                variant={project.status === "active" ? "default" : "secondary"}
                                className={
                                  project.status === "active"
                                    ? "bg-emphasis/20 text-emphasis backdrop-blur-sm"
                                    : project.status === "experimental"
                                    ? "bg-yellow-600/20 text-yellow-300 backdrop-blur-sm"
                                    : "bg-text-muted/30 text-text-secondary backdrop-blur-sm"
                                }
                              >
                                {project.status}
                              </Badge>
                            </div>
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {!project.featured_image && (
                                <div className="p-2 bg-accent-primary/15 rounded-lg flex-shrink-0">
                                  <IconComponent className="h-6 w-6 text-accent-primary" />
                                </div>
                              )}
                              <CardTitle className="text-text-strong font-semibold group-hover:text-accent-primary transition-colors line-clamp-2">
                                {project.title}
                              </CardTitle>
                            </div>
                            {!project.featured_image && (
                              <Badge
                                variant={project.status === "active" ? "default" : "secondary"}
                                className={
                                  project.status === "active"
                                    ? "bg-green-600/20 text-green-300 flex-shrink-0"
                                    : project.status === "experimental"
                                    ? "bg-accent-secondary/20 text-text-secondary flex-shrink-0"
                                    : "bg-text-muted/30 text-text-secondary flex-shrink-0"
                                }
                              >
                                {project.status}
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-text-body font-normal leading-relaxed line-clamp-3">
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                          <div className="flex flex-wrap gap-2">
                            {project.tags.slice(0, 3).map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="border-border-subtle text-text-muted text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {project.tags.length > 3 && (
                              <Badge variant="outline" className="border-border-subtle text-text-muted text-xs">
                                +{project.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                          {(project.github || project.demo) && (
                            <div className="flex items-center gap-2 text-xs text-text-muted pt-2 mt-2 border-t border-border-subtle">
                              {project.github && (
                                <div className="flex items-center gap-1">
                                  <Github className="h-3 w-3" />
                                  <span>Code</span>
                                </div>
                              )}
                              {project.github && project.demo && <span>•</span>}
                              {project.demo && (
                                <div className="flex items-center gap-1">
                                  <ExternalLink className="h-3 w-3" />
                                  <span>Demo</span>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="text-text-muted text-sm">No projects yet. Check back soon.</p>
            )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
