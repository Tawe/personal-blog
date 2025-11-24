import { LeadershipStrategyPageClient } from "./page-client"
import type { Metadata } from "next"
import { Metadata } from "next"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams
  const hasQueryParams = Object.keys(params).length > 0
  const baseUrl = "https://johnmunn.tech/strategic-narratives/leadership-strategy"
  
  // If there are query parameters (like ?tag=...), set noindex and canonicalize to base URL
  if (hasQueryParams) {
    return {
      title: "Leadership & Strategy | John Munn",
      description: "Insights on building teams, driving innovation, and leading through complexity",
      robots: {
        index: false,
        follow: true,
        googleBot: {
          index: false,
          follow: true,
        },
      },
      alternates: {
        canonical: baseUrl,
      },
    }
  }

  // Base page metadata
  return {
    title: "Leadership & Strategy | John Munn",
    description: "Insights on building teams, driving innovation, and leading through complexity",
    openGraph: {
      title: "Leadership & Strategy | John Munn",
      description: "Insights on building teams, driving innovation, and leading through complexity",
      url: baseUrl,
      siteName: "John Munn - Technical Leader",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Leadership & Strategy | John Munn",
      description: "Insights on building teams, driving innovation, and leading through complexity",
    },
    alternates: {
      canonical: baseUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default async function LeadershipStrategyPage({ searchParams }: PageProps) {
  return <LeadershipStrategyPageClient />
}
