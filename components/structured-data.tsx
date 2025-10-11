interface StructuredDataProps {
  article: {
    title: string
    excerpt: string
    date: string
    slug: string
    tags: string[]
    featured_image?: string
    reading_time: number
    type?: string
    system?: string
    availability?: string
  }
  type: 'article' | 'blogPost' | 'creativeWork'
}

export function StructuredData({ article, type }: StructuredDataProps) {
  const baseUrl = "https://johnmunn.dev"
  const articleUrl = `${baseUrl}/strategic-narratives/dnd-ttrpgs/${article.slug}`
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? "Article" : type === 'blogPost' ? "BlogPosting" : "CreativeWork",
    "headline": article.title,
    "description": article.excerpt,
    "url": articleUrl,
    "datePublished": article.date,
    "dateModified": article.date,
    "author": {
      "@type": "Person",
      "name": "John Munn",
      "url": baseUrl,
      "image": `${baseUrl}/me.jpeg`,
      "jobTitle": "Technical Leader & Engineering Strategist",
      "description": "Technical leader, engineering strategist, and team builder with expertise in scalable architecture, strategic thinking, and innovative problem-solving."
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
    "articleSection": "D&D & TTRPGs",
    "wordCount": article.reading_time * 200, // Approximate word count
    "timeRequired": `PT${article.reading_time}M`,
    ...(article.featured_image && {
      "image": {
        "@type": "ImageObject",
        "url": article.featured_image.startsWith('http') ? article.featured_image : `${baseUrl}${article.featured_image}`,
        "width": 1200,
        "height": 630
      }
    }),
    ...(type === 'article' && article.type && {
      "genre": article.type,
      "about": article.tags.map(tag => ({
        "@type": "Thing",
        "name": tag
      }))
    }),
    ...(article.system && {
      "mentions": {
        "@type": "Thing",
        "name": article.system
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
