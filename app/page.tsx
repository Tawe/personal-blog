import { Metadata } from "next"
import HomePageClient from "./home-client"
import { buildMetadata } from "@/lib/seo-metadata"

export const metadata: Metadata = buildMetadata({
  title: "John Munn - Technical Leader & Engineering Strategist",
  description:
    "Technical leader, engineering strategist, and team builder. Writing on leadership, technical architecture, and AI system tradeoffs.",
  path: "/",
  keywords: [
    "engineering leadership",
    "technical leader",
    "technical architecture",
    "AI strategy",
    "software engineering management",
  ],
  image: "/me.jpeg",
  imageAlt: "John Munn - Technical Leader & Engineering Strategist",
})

export default function HomePage() {
  return <HomePageClient />
}
