interface ArticleStructuredDataProps {
  article: {
    title: string
    excerpt: string
    date: string
    slug: string
    tags: string[]
    featured_image?: string
    reading_time: number
    updated?: string
    medium_link?: string
    devto_link?: string
    substack_link?: string
    linkedin_link?: string
  }
  articleUrl: string
  articleSection: string
  type?: 'Article' | 'BlogPosting' | 'CreativeWork'
}

function toISODateTime(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return ''
  if (dateStr instanceof Date) return dateStr.toISOString()
  if (dateStr.includes('T')) return dateStr
  return `${dateStr}T00:00:00Z`
}

export function ArticleStructuredData({
  article,
  articleUrl,
  articleSection,
  type = 'Article'
}: ArticleStructuredDataProps) {
  const baseUrl = "https://johnmunn.tech"
  const relatedProfiles = [
    article.medium_link,
    article.devto_link,
    article.substack_link,
    article.linkedin_link,
  ].filter(Boolean) as string[]
  const normalizedImageUrl = article.featured_image
    ? (article.featured_image.startsWith("http")
      ? article.featured_image
      : `${baseUrl}${article.featured_image}`)
    : undefined

  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${articleUrl}#article`,
    "headline": article.title,
    "name": article.title,
    "description": article.excerpt,
    "url": articleUrl,
    "datePublished": toISODateTime(article.date),
    "dateModified": toISODateTime(article.updated || article.date),
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "author": {
      "@type": "Person",
      "name": "John Munn",
      "url": baseUrl,
      "image": `${baseUrl}/me.jpeg`,
      "jobTitle": "Technical Leader & Engineering Strategist"
    },
    "publisher": {
      "@type": "Person",
      "name": "John Munn",
      "url": baseUrl,
      "image": `${baseUrl}/me.jpeg`
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "about": article.tags.map((tag) => ({
      "@type": "Thing",
      "name": tag
    })),
    "keywords": article.tags.join(", "),
    "articleSection": articleSection,
    "wordCount": article.reading_time * 200,
    "timeRequired": `PT${article.reading_time}M`,
    ...(normalizedImageUrl && {
      "image": {
        "@type": "ImageObject",
        "url": normalizedImageUrl,
        "width": 1200,
        "height": 630
      }
    }),
    ...(relatedProfiles.length > 0 && {
      "sameAs": relatedProfiles,
      "citation": relatedProfiles.map((url) => ({
        "@type": "CreativeWork",
        "url": url
      }))
    }),
    "potentialAction": {
      "@type": "ReadAction",
      "target": articleUrl
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(structuredData, null, 2).replace(/</g, '\\u003c')
      }}
    />
  )
}
