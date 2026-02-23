import { Metadata } from "next"
import { buildMetadata } from "@/lib/seo-metadata"

export const metadata: Metadata = buildMetadata({
  title: "About | John Munn",
  description: "Engineering leader and writer focused on systems, teams, and technical strategy.",
  path: "/about",
  keywords: ["about John Munn", "engineering leader", "technical strategist"],
})

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
