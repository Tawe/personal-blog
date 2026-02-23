import { Metadata } from "next"
import { buildMetadata } from "@/lib/seo-metadata"

export const metadata: Metadata = buildMetadata({
  title: "Technical Architecture | John Munn",
  description: "Deep dives into system design, scaling tradeoffs, architecture patterns, and AI system reliability.",
  path: "/strategic-narratives/technical-architecture",
  keywords: ["technical architecture", "system design", "RAG architecture", "distributed systems"],
})

export default function TechnicalArchitectureLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
