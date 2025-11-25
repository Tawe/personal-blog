"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Code, Wrench, Rocket, ExternalLink, Github, ArrowRight, Terminal, Database, Server, LucideIcon } from "lucide-react"
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

// Map icon strings to icon components
const iconMap: Record<string, LucideIcon> = {
  Code,
  Server,
  Rocket,
  Database,
  Terminal,
  Wrench,
}

export default function WorkbenchPage() {
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
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Workbench
                  </h1>
                  <p className="text-xl text-primary font-semibold">
                    Projects, builds, and technical experimentation
                  </p>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    I've always balanced leadership with building. This page is where I keep the things I'm working on, the quick prototypes, worldbuilding tools, and small pieces of software that grow out of curiosity and weekend experiments. None of them are perfect. They're simply the things I'm exploring right now.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="#projects">View Projects</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/strategic-narratives">Explore My Writing</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Image
                    src="/workbench.png"
                    width={400}
                    height={400}
                    alt="John Munn - Workbench"
                    className="rounded-xl object-cover"
                    priority
                  />
                  <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground p-3 rounded-full">
                    <Code className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section id="projects" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Active Projects</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Experiments, prototypes, and tools I'm actively shaping.
                </p>
                <p className="max-w-[900px] text-muted-foreground md:text-lg">
                  Some are tiny, some are strange, and most start as sparks of curiosity.
                </p>
              </div>
            </div>
            {isLoading ? (
              <div className="text-center text-slate-400 py-12">
                <p>Loading projects...</p>
              </div>
            ) : projects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => {
                  const IconComponent = iconMap[project.icon] || Code
                  return (
                    <Link
                      key={project.slug}
                      href={`/workbench/${project.slug}`}
                      className="block"
                    >
                      <Card className="bg-slate-800/50 border-slate-600 hover:border-blue-500 transition-all duration-300 flex flex-col h-full cursor-pointer group overflow-hidden">
                        {project.featured_image && (
                          <div className="relative w-full h-48 overflow-hidden">
                            <Image
                              src={project.featured_image}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                            <div className="absolute top-3 right-3">
                              <Badge 
                                variant={project.status === "active" ? "default" : "secondary"}
                                className={
                                  project.status === "active" 
                                    ? "bg-green-600/20 text-green-300 backdrop-blur-sm" 
                                    : project.status === "experimental"
                                    ? "bg-yellow-600/20 text-yellow-300 backdrop-blur-sm"
                                    : "bg-slate-600/20 text-slate-300 backdrop-blur-sm"
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
                                <div className="p-2 bg-blue-600/20 rounded-lg flex-shrink-0">
                                  <IconComponent className="h-6 w-6 text-blue-400" />
                                </div>
                              )}
                              <CardTitle className="text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2">
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
                                    ? "bg-yellow-600/20 text-yellow-300 flex-shrink-0"
                                    : "bg-slate-600/20 text-slate-300 flex-shrink-0"
                                }
                              >
                                {project.status}
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-slate-400 line-clamp-3">
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {project.tags.slice(0, 3).map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="border-slate-600 text-slate-300 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {project.tags.length > 3 && (
                                <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                                  +{project.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                            {(project.github || project.demo) && (
                              <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-700">
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
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-12">
                <p>No projects yet. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">More Coming Soon</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  This workbench is actively being built. Check back for new projects, experiments, and technical deep-dives.
                </p>
              </div>
              <div className="pt-4">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/strategic-narratives">
                    Explore My Writing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

