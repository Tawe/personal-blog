import { Metadata } from "next"
import { buildMetadata } from "@/lib/seo-metadata"

export const metadata: Metadata = buildMetadata({
  title: "Writing Collections",
  description: "Writing collections spanning leadership, technical architecture, Artumin, and tabletop design.",
  path: "/strategic-narratives",
  keywords: ["writing collections", "leadership writing", "technical architecture", "artumin", "tabletop design"],
})

export default function StrategicNarrativesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
