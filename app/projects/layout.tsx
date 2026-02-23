import { Metadata } from "next"
import { buildMetadata } from "@/lib/seo-metadata"

export const metadata: Metadata = buildMetadata({
  title: "Projects | John Munn",
  description: "Applied technical projects and experiments. Architecture decisions, implementation tradeoffs, and outcomes.",
  path: "/projects",
  keywords: ["engineering projects", "software architecture projects", "technical portfolio"],
})

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children
}
