import { Metadata } from "next"
import HomePageClient from "./home-client"

export const metadata: Metadata = {
  title: "Home",
  description: "Technical leader, engineering strategist, and team builder. Writing on leadership, technical architecture, and the intersection of storytelling and technology.",
  openGraph: {
    title: "John Munn - Technical Leader & Engineering Strategist",
    description: "Technical leader, engineering strategist, and team builder with expertise in scalable architecture, strategic thinking, and innovative problem-solving.",
    url: "https://johnmunn.tech",
    siteName: "John Munn - Technical Leader",
    images: [
      {
        url: "/me.jpeg",
        width: 1200,
        height: 630,
        alt: "John Munn - Technical Leader & Engineering Strategist",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "John Munn - Technical Leader & Engineering Strategist",
    description: "Technical leader, engineering strategist, and team builder with expertise in scalable architecture, strategic thinking, and innovative problem-solving.",
    images: ["/me.jpeg"],
  },
  alternates: {
    canonical: "https://johnmunn.tech",
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

export default function HomePage() {
  return <HomePageClient />
}
