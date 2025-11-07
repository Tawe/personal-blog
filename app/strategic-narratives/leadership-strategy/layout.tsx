import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Leadership & Strategy",
  description: "Insights on building teams, driving innovation, and leading through complexity. Articles on technical leadership, team building, strategic decision-making, and organizational transformation.",
  openGraph: {
    title: "Leadership & Strategy | John Munn",
    description: "Insights on building teams, driving innovation, and leading through complexity.",
    url: "https://johnmunn.tech/strategic-narratives/leadership-strategy",
    siteName: "John Munn - Technical Leader",
    images: [
      {
        url: "/me.jpeg",
        width: 1200,
        height: 630,
        alt: "John Munn - Leadership & Strategy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leadership & Strategy | John Munn",
    description: "Insights on building teams, driving innovation, and leading through complexity.",
    images: ["/me.jpeg"],
  },
  alternates: {
    canonical: "https://johnmunn.tech/strategic-narratives/leadership-strategy",
  },
}

export default function LeadershipStrategyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

