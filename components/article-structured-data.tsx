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
  }
  articleUrl: string
  articleSection: string
  type?: 'Article' | 'BlogPosting' | 'CreativeWork'
}

function toISODateTime(dateStr: string): string {
  if (!dateStr) return dateStr
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    "headline": article.title,
    "description": article.excerpt,
    "url": articleUrl,
    "datePublished": toISODateTime(article.date),
    "dateModified": toISODateTime(article.updated || article.date),
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
    "keywords": article.tags.join(", "),
    "articleSection": articleSection,
    "wordCount": article.reading_time * 200,
    "timeRequired": `PT${article.reading_time}M`,
    ...(article.featured_image && {
      "image": {
        "@type": "ImageObject",
        "url": article.featured_image.startsWith('http') ? article.featured_image : `${baseUrl}${article.featured_image}`,
        "width": 1200,
        "height": 630
      }
    })
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

