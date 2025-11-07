import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Strategic Narratives",
  description: "Explore insights across technical leadership, strategic thinking, and innovative problem-solving. Articles on leadership strategy, technical architecture, D&D content, and world-building.",
  openGraph: {
    title: "Strategic Narratives | John Munn",
    description: "Explore insights across technical leadership, strategic thinking, and innovative problem-solving.",
    url: "https://johnmunn.tech/strategic-narratives",
    siteName: "John Munn - Technical Leader",
    images: [
      {
        url: "/me.jpeg",
        width: 1200,
        height: 630,
        alt: "John Munn - Strategic Narratives",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strategic Narratives | John Munn",
    description: "Explore insights across technical leadership, strategic thinking, and innovative problem-solving.",
    images: ["/me.jpeg"],
  },
  alternates: {
    canonical: "https://johnmunn.tech/strategic-narratives",
  },
}

export default function StrategicNarrativesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

