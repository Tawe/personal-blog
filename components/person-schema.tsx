export function PersonSchema() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "John Munn",
    "url": "https://johnmunn.tech",
    "image": "https://johnmunn.tech/me.jpeg",
    "jobTitle": "Technical Leader & Engineering Strategist",
    "description": "Technical leader, engineering strategist, and team builder with expertise in scalable architecture, strategic thinking, and innovative problem-solving. Dungeon Master applying storytelling to leadership.",
    "sameAs": [
      "https://www.linkedin.com/in/john-munn-bbab434b/",
      "https://github.com/Tawe",
      "https://medium.com/@johnmunn",
      "https://dev.to/tawe",
      "https://tawe.substack.com/",
      "https://johnmunn.tech"
    ],
    "knowsAbout": [
      "Technical Leadership",
      "Engineering Strategy",
      "Software Architecture",
      "Team Building",
      "Scalable Systems",
      "Cloud Architecture",
      "DevOps",
      "Strategic Thinking",
      "Dungeon Master",
      "Leadership Development",
      "Event-Driven Architecture",
      "Microservices",
      "System Design",
      "AI and Machine Learning",
      "Software Engineering"
    ],
    "alumniOf": [],
    "award": [],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Technical Leader & Engineering Strategist",
      "occupationLocation": {
        "@type": "Country",
        "name": "United States"
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(personSchema, null, 2).replace(/</g, '\\u003c')
      }}
    />
  )
}

