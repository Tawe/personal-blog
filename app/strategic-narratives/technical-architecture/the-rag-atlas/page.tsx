import type { Metadata } from "next"
import { RagAtlasClient } from "./RagAtlasClient"
import { BreadcrumbSchema } from "@/components/breadcrumb-schema"
import { buildMetadata } from "@/lib/seo-metadata"

const ATLAS_URL = "https://johnmunn.tech/strategic-narratives/technical-architecture/the-rag-atlas"
const SOURCE_ARTICLE_URL =
  "https://johnmunn.tech/strategic-narratives/technical-architecture/the-rag-atlas-a-visual-guide-to-retrieval-patterns"
const SOURCE_ARTICLE_IMAGE = "/ragatlas.png"

export const metadata: Metadata = buildMetadata({
  title: "The RAG Atlas: A Visual Guide to Retrieval Patterns",
  description: "Interactive visual reference covering ten RAG patterns, with flow diagrams, node-by-node inspection, and a live simulator for latency/cost/accuracy tradeoffs.",
  path: "/strategic-narratives/technical-architecture/the-rag-atlas",
  keywords: ["RAG", "retrieval augmented generation", "AI architecture", "vector search", "LLM systems"],
  image: SOURCE_ARTICLE_IMAGE,
  imageAlt: "The RAG Atlas — interactive retrieval pattern diagrams",
})

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
