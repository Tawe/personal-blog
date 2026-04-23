interface CollectionPageSchemaItem {
  title: string
  url: string
  date?: string
  excerpt?: string
}

interface CollectionPageSchemaProps {
  name: string
  description: string
  url: string
  about?: string[]
  items: CollectionPageSchemaItem[]
  itemType?: "Article" | "BlogPosting" | "CreativeWork" | "SoftwareSourceCode"
}

export function CollectionPageSchema({
  name,
  description,
  url,
  about = [],
  items,
  itemType = "Article",
}: CollectionPageSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name,
    description,
    url,
    isPartOf: {
      "@id": "https://johnmunn.tech/#website",
    },
    about,
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: item.url,
        item: {
          "@type": itemType,
          headline: item.title,
          url: item.url,
          description: item.excerpt,
          datePublished: item.date,
        },
      })),
    },
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
