import { notFound } from "next/navigation"
import { ProjectClientPage } from "./ProjectClientPage"
import { getProject, getProjectLightweight } from "@/lib/project-utils"
import { generateSlug } from "@/lib/slug-utils"
import fs from "fs"
import path from "path"
import { Metadata } from "next"
import { buildMetadata } from "@/lib/seo-metadata"

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content/projects")
  if (!fs.existsSync(contentDir)) return []
  const files = fs.readdirSync(contentDir)
  const markdownFiles = files.filter((file) => file.endsWith(".md"))
  return markdownFiles.map((filename) => ({ slug: generateSlug(filename) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const contentDir = path.join(process.cwd(), "content/projects")
  const project = getProjectLightweight({ contentDir, slug })

  if (!project) {
    return buildMetadata({
      title: "Project Not Found",
      description: "The requested project could not be found.",
      path: `/projects/${slug}`,
      noindex: true,
    })
  }

  const title = `${project.title} | Projects`
  const description = project.description

  return buildMetadata({
    title,
    description,
    path: `/projects/${slug}`,
    keywords: [...(project.tags || []), "engineering project", "technical case study"],
    image: project.featured_image || "/me.jpeg",
    imageAlt: project.title,
    openGraphType: "article",
  })
}

async function loadProject(slug: string) {
  const contentDir = path.join(process.cwd(), "content/projects")
  return getProject({ contentDir, slug })
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await loadProject(slug)
  if (!project) notFound()
  return <ProjectClientPage project={project} />
}
