export function WebsiteSchema() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "John Munn - Technical Leader & Engineering Strategist",
    "url": "https://johnmunn.tech",
    "description": "Technical leader, engineering strategist, and team builder with expertise in scalable architecture, strategic thinking, and innovative problem-solving.",
    "publisher": {
      "@type": "Person",
      "name": "John Munn",
      "url": "https://johnmunn.tech",
      "image": "https://johnmunn.tech/me.jpeg"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://johnmunn.tech/strategic-narratives?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://www.linkedin.com/in/john-munn-bbab434b/",
      "https://github.com/Tawe",
      "https://medium.com/@johnmunn",
      "https://dev.to/tawe",
      "https://tawe.substack.com/"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteSchema, null, 2).replace(/</g, '\\u003c')
      }}
    />
  )
}

