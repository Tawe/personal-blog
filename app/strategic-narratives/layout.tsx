import { Metadata } from "next"
import { buildMetadata } from "@/lib/seo-metadata"

export const metadata: Metadata = buildMetadata({
  title: "Strategic Narratives | John Munn",
  description: "Technical leadership, architecture strategy, and decision-making narratives across complex systems.",
  path: "/strategic-narratives",
  keywords: ["strategic narratives", "technical strategy", "engineering leadership insights"],
})

export default function StrategicNarrativesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
