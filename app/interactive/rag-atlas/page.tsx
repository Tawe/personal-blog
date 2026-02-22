import type { Metadata } from "next"
import { RagAtlasClient } from "@/app/strategic-narratives/technical-architecture/the-rag-atlas/RagAtlasClient"

const PAGE_URL = "https://johnmunn.tech/interactive/rag-atlas"
const SHARE_IMAGE = "/ragatlas.png"

export const metadata: Metadata = {
  title: "The RAG Atlas: Interactive",
  description:
    "Interactive visual reference for RAG patterns with flow diagrams, node inspection, and tradeoff simulation.",
  keywords: [
    "RAG",
    "retrieval-augmented generation",
    "interactive architecture",
    "AI systems design",
    "RAG patterns",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "The RAG Atlas: Interactive",
    description:
      "Explore RAG patterns with interactive flow diagrams, node-level inspection, and tradeoff simulation.",
    url: PAGE_URL,
    siteName: "John Munn",
    type: "article",
    images: [
      {
        url: SHARE_IMAGE,
        width: 1200,
        height: 630,
        alt: "The RAG Atlas interactive preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The RAG Atlas: Interactive",
    description:
      "Interactive RAG pattern explorer with visual flows, node inspection, and tradeoff simulation.",
    images: [SHARE_IMAGE],
  },
  alternates: {
    canonical: PAGE_URL,
  },
}

export default function InteractiveRagAtlasPage() {
  return <RagAtlasClient />
}
