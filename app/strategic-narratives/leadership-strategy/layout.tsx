import { Metadata } from "next"
import { buildMetadata } from "@/lib/seo-metadata"

export const metadata: Metadata = buildMetadata({
  title: "Leadership & Strategy | John Munn",
  description: "Technical leadership, team strategy, and organizational decision-making for engineering leaders.",
  path: "/strategic-narratives/leadership-strategy",
  keywords: ["engineering leadership", "leadership strategy", "technical management"],
})

export default function LeadershipStrategyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
