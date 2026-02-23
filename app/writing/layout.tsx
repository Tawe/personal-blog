import { Metadata } from "next"
import { buildMetadata } from "@/lib/seo-metadata"

export const metadata: Metadata = buildMetadata({
  title: "Writing | John Munn",
  description: "Leadership and technical architecture writing. One body of work on teams, systems, tradeoffs, and complex challenges.",
  path: "/writing",
  keywords: ["technical writing", "engineering leadership writing", "technical architecture articles"],
})

export default function WritingLayout({ children }: { children: React.ReactNode }) {
  return children
}
