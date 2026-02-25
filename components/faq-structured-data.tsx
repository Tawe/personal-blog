interface FAQItem {
  question: string
  answer: string
}

interface FAQStructuredDataProps {
  items: FAQItem[]
}

export function FAQStructuredData({ items }: FAQStructuredDataProps) {
  if (!items.length) return null

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
      }}
    />
  )
}
