import type { Metadata } from "next"
import ArchitecturePlaygroundPage from "@/app/workbench/architecture-playground/page"

const PAGE_URL = "https://johnmunn.tech/interactive/architecture-playground"
const SHARE_IMAGE = "/architecture-playground.png"

export const metadata: Metadata = {
  title: "API vs Message vs Event-Driven Architecture",
  description:
    "Interactive systems design page comparing API-driven, message-driven, and event-driven architectures with diagrams and scenario-driven recommendations.",
  keywords: [
    "API-driven architecture",
    "message-driven architecture",
    "event-driven architecture",
    "systems design",
    "architecture tradeoffs",
    "distributed systems",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "API vs Message vs Event-Driven Architecture",
    description:
      "Interactive systems design guide with diagrams, failure modes, comparisons, and scenario-based recommendations.",
    url: PAGE_URL,
    siteName: "John Munn",
    type: "article",
    images: [
      {
        url: SHARE_IMAGE,
        width: 1200,
        height: 630,
        alt: "API vs Message vs Event-Driven Architecture interactive guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "API vs Message vs Event-Driven Architecture",
    description:
      "Interactive guide to API-driven, message-driven, and event-driven tradeoffs, failure modes, and scaling patterns.",
    images: [SHARE_IMAGE],
  },
  alternates: {
    canonical: PAGE_URL,
  },
}

export default ArchitecturePlaygroundPage
