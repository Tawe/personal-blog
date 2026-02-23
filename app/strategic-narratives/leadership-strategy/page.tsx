import { LeadershipStrategyPageClient } from "./page-client"
import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo-metadata"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams
  const hasQueryParams = Object.keys(params).length > 0
  
  // If there are query parameters (like ?tag=...), set noindex and canonicalize to base URL
  if (hasQueryParams) {
    return buildMetadata({
      title: "Leadership & Strategy | John Munn",
      description: "Insights on building teams, driving innovation, and leading through complexity",
      path: "/strategic-narratives/leadership-strategy",
      keywords: ["leadership strategy", "engineering leadership"],
      noindex: true,
    })
  }

  // Base page metadata
  return buildMetadata({
    title: "Leadership & Strategy | John Munn",
    description: "Insights on building teams, driving innovation, and leading through complexity",
    path: "/strategic-narratives/leadership-strategy",
    keywords: ["leadership strategy", "technical leadership", "engineering management"],
  })
}

export default async function LeadershipStrategyPage({ searchParams }: PageProps) {
  return <LeadershipStrategyPageClient />
}
