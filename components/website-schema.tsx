export function WebsiteSchema() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "John Munn - Engineering leader and writer",
    "url": "https://johnmunn.tech",
    "description": "Engineering leader and writer. Systems, teams, and the work of building things that last. Open to conversation — mentoring, collaboration, and exchanging ideas.",
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
        "urlTemplate": "https://johnmunn.tech/writing?search={search_term_string}"
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

