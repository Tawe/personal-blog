import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "John Munn - Technical Leader & Engineering Strategist",
    template: "%s | John Munn",
  },
  description:
    "Technical leader, engineering strategist, and team builder with expertise in scalable architecture, strategic thinking, and innovative problem-solving. Dungeon Master applying storytelling to leadership.",
  keywords: [
    "technical leadership",
    "engineering strategy",
    "software architecture",
    "team building",
    "technical mentoring",
    "engineering management",
    "scalable systems",
    "cloud architecture",
    "DevOps",
    "strategic thinking",
    "dungeon master",
    "leadership development",
  ],
  authors: [{ name: "John Munn" }],
  creator: "John Munn",
  publisher: "John Munn",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://johnmunn.dev",
    siteName: "John Munn - Technical Leader",
    title: "John Munn - Technical Leader & Engineering Strategist",
    description:
      "Technical leader, engineering strategist, and team builder with expertise in scalable architecture, strategic thinking, and innovative problem-solving.",
    images: [
      {
        url: "/me.jpeg",
        width: 1200,
        height: 630,
        alt: "John Munn - Technical Leader & Engineering Strategist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "John Munn - Technical Leader & Engineering Strategist",
    description:
      "Technical leader, engineering strategist, and team builder with expertise in scalable architecture, strategic thinking, and innovative problem-solving.",
    images: ["/me.jpeg"],
  },
  icons: {
    icon: "/pentagon-growth.svg",
    shortcut: "/pentagon-growth.svg",
    apple: "/pentagon-growth.svg",
  },
  metadataBase: new URL("https://johnmunn.dev"),
  alternates: {
    canonical: "/",
  },
  category: "technology",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://johnmunn.dev" />
      </head>
      <body>{children}</body>
    </html>
  )
}
