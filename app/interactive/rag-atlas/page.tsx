import type { Metadata } from "next"
import { RagAtlasClient } from "@/app/strategic-narratives/technical-architecture/the-rag-atlas/RagAtlasClient"
import { buildMetadata } from "@/lib/seo-metadata"

const SHARE_IMAGE = "/ragatlas.png"

export const metadata: Metadata = buildMetadata({
  title: "The RAG Atlas: Interactive",
  description: "Interactive visual reference for RAG patterns with flow diagrams, node inspection, and tradeoff simulation.",
  path: "/interactive/rag-atlas",
  keywords: ["RAG patterns", "RAG evaluation", "retrieval augmented generation", "interactive architecture"],
  image: SHARE_IMAGE,
  imageAlt: "The RAG Atlas interactive preview",
  openGraphType: "article",
})

export default function InteractiveRagAtlasPage() {
  return <RagAtlasClient />
}
