interface ProjectStructuredDataProps {
  project: {
    title: string
    description: string
    slug: string
    tags: string[]
    featured_image?: string
    date: string
    github?: string | null
    demo?: string | null
  }
  projectUrl: string
}

function toISODateTime(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return ""
  if (dateStr instanceof Date) return dateStr.toISOString()
  if (dateStr.includes("T")) return dateStr
  return `${dateStr}T00:00:00Z`
}

export function ProjectStructuredData({ project, projectUrl }: ProjectStructuredDataProps) {
  const baseUrl = "https://johnmunn.tech"
  const relatedLinks = [project.github, project.demo].filter(Boolean) as string[]
  const normalizedImageUrl = project.featured_image
    ? (project.featured_image.startsWith("http")
      ? project.featured_image
      : `${baseUrl}${project.featured_image}`)
    : undefined

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "@id": `${projectUrl}#project`,
    name: project.title,
    headline: project.title,
    description: project.description,
    url: projectUrl,
    datePublished: toISODateTime(project.date),
    dateModified: toISODateTime(project.date),
    inLanguage: "en-US",
    codeRepository: project.github || undefined,
    programmingLanguage: project.tags,
    keywords: project.tags.join(", "),
    author: {
      "@type": "Person",
      name: "John Munn",
      url: baseUrl,
      image: `${baseUrl}/me.jpeg`,
    },
    publisher: {
      "@type": "Person",
      name: "John Munn",
      url: baseUrl,
      image: `${baseUrl}/me.jpeg`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": projectUrl,
    },
    about: project.tags.map((tag) => ({
      "@type": "Thing",
      name: tag,
    })),
    ...(normalizedImageUrl && {
      image: {
        "@type": "ImageObject",
        url: normalizedImageUrl,
        width: 1200,
        height: 630,
      },
    }),
    ...(project.demo && {
      subjectOf: {
        "@type": "WebApplication",
        name: project.title,
        url: project.demo,
        applicationCategory: "DeveloperApplication",
      },
    }),
    ...(relatedLinks.length > 0 && {
      sameAs: relatedLinks,
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(softwareSchema, null, 2).replace(/</g, "\\u003c"),
      }}
    />
  )
}
