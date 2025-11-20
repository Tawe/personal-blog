import { notFound } from "next/navigation"
import { ProjectClientPage } from "./ProjectClientPage"
import { getProject, getProjectLightweight } from "@/lib/project-utils"
import { generateSlug } from "@/lib/slug-utils"
import fs from "fs"
import path from "path"
import { Metadata } from "next"

// Generate static params for all projects
export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content/projects")
  if (!fs.existsSync(contentDir)) {
    return []
  }
  const files = fs.readdirSync(contentDir)
  const markdownFiles = files.filter((file) => file.endsWith(".md"))
  
  return markdownFiles.map((filename) => ({
    slug: generateSlug(filename)
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const contentDir = path.join(process.cwd(), "content/projects")
  const project = getProjectLightweight({ contentDir, slug })

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    }
  }

  const title = `${project.title} | Workbench`
  const description = project.description
  const url = `https://johnmunn.tech/workbench/${slug}`

  return {
    title,
    description,
    keywords: project.tags || [],
    authors: [{ name: "John Munn" }],
    openGraph: {
      title,
      description,
      url,
      siteName: "John Munn - Technical Leader",
      images: project.featured_image
        ? [
            {
              url: project.featured_image,
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ]
        : [
            {
              url: "/me.jpeg",
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.featured_image ? [project.featured_image] : ["/me.jpeg"],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

async function loadProject(slug: string) {
  const contentDir = path.join(process.cwd(), "content/projects")
  const project = await getProject({ contentDir, slug })
  return project
}

export default async function ProjectPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const project = await loadProject(slug)
  
  if (!project) {
    notFound()
  }

  return <ProjectClientPage project={project} />
}

