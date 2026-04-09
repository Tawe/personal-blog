interface ProfilePageSchemaProps {
  url?: string
}

export function ProfilePageSchema({ url = "https://johnmunn.tech/about" }: ProfilePageSchemaProps) {
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profile-page`,
    "url": url,
    "mainEntityOfPage": {
      "@type": "ProfilePage",
      "@id": `${url}#profile-page`
    },
    "mainEntity": {
      "@type": "Person",
      "@id": "https://johnmunn.tech/#person",
      "name": "John Munn",
      "url": "https://johnmunn.tech",
      "image": "https://johnmunn.tech/me.jpeg",
      "jobTitle": "Engineering leader and writer",
      "description": "Engineering leader and writer. Two decades at the intersection of technology, people, and the systems that connect them.",
      "sameAs": [
        "https://www.linkedin.com/in/john-munn-bbab434b/",
        "https://github.com/Tawe",
        "https://medium.com/@johnmunn",
        "https://dev.to/tawe",
        "https://tawe.substack.com/"
      ]
    },
    "inLanguage": "en-US",
    "isPartOf": {
      "@id": "https://johnmunn.tech/#website"
    },
    "dateCreated": "2024-01-01",
    "dateModified": new Date().toISOString().split("T")[0]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(profilePageSchema, null, 2).replace(/</g, '\\u003c')
      }}
    />
  )
}
