import type { Metadata } from "next"
import { RagAtlasClient } from "./RagAtlasClient"
import { BreadcrumbSchema } from "@/components/breadcrumb-schema"

const ATLAS_URL = "https://johnmunn.tech/strategic-narratives/technical-architecture/the-rag-atlas"
const SOURCE_ARTICLE_URL =
  "https://johnmunn.tech/strategic-narratives/technical-architecture/the-rag-atlas-a-visual-guide-to-retrieval-patterns"

export const metadata: Metadata = {
  title: "The RAG Atlas: A Visual Guide to Retrieval Patterns",
  description:
    "Interactive visual reference covering ten RAG patterns, with flow diagrams, node-by-node inspection, and a live simulator for latency/cost/accuracy tradeoffs.",
  keywords: ["RAG", "Retrieval Augmented Generation", "LLM", "Vector Search", "AI Architecture", "Machine Learning"],
  authors: [{ name: "John Munn" }],
  category: "technology",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "The RAG Atlas: A Visual Guide to Retrieval Patterns",
    description:
      "Ten RAG architectures mapped visually with flow diagrams, node inspector, and a live simulator.",
    url: ATLAS_URL,
    siteName: "John Munn - Technical Leader",
    images: [
      {
        url: "/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "The RAG Atlas — interactive retrieval pattern diagrams",
      },
    ],
    locale: "en_US",
    type: "website",
    publishedTime: "2026-02-19T00:00:00Z",
    modifiedTime: "2026-02-20T00:00:00Z",
    authors: ["John Munn"],
  },
  twitter: {
    card: "summary_large_image",
    title: "The RAG Atlas: A Visual Guide to Retrieval Patterns",
    description:
      "Ten RAG architectures mapped visually with flow diagrams, node inspector, and a live simulator.",
    images: ["/placeholder.jpg"],
  },
  alternates: {
    canonical: ATLAS_URL,
  },
}

export default function RagAtlasPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${ATLAS_URL}#webpage`,
        url: ATLAS_URL,
        name: "The RAG Atlas: A Visual Guide to Retrieval Patterns",
        description:
          "Interactive visual reference covering ten RAG patterns, with flow diagrams, node-by-node inspection, and a live simulator for latency/cost/accuracy tradeoffs.",
        isPartOf: { "@id": "https://johnmunn.tech/#website" },
        inLanguage: "en-US",
        about: {
          "@type": "Thing",
          name: "Retrieval-Augmented Generation",
        },
        mainEntity: { "@id": `${ATLAS_URL}#learningresource` },
      },
      {
        "@type": "LearningResource",
        "@id": `${ATLAS_URL}#learningresource`,
        name: "The RAG Atlas",
        educationalLevel: "Intermediate",
        learningResourceType: "Interactive Diagram",
        isBasedOn: SOURCE_ARTICLE_URL,
        url: ATLAS_URL,
      },
    ],
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Writing", url: "/writing" },
          { name: "The RAG Atlas (Article)", url: SOURCE_ARTICLE_URL },
          { name: "Interactive Atlas", url: "/strategic-narratives/technical-architecture/the-rag-atlas" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <RagAtlasClient />
    </>
  )
}
