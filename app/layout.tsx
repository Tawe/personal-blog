import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { PersonSchema } from "@/components/person-schema"
import { WebsiteSchema } from "@/components/website-schema"

export const metadata: Metadata = {
  title: {
    default: "John Munn - Technical Leader & Engineering Strategist",
    template: "%s | John Munn",
  },
  description:
    "Technical leader, engineering strategist, and team builder with expertise in scalable architecture, strategic thinking, and innovative problem-solving. Dungeon Master applying storytelling to leadership.",
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
    url: "https://johnmunn.tech",
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
  metadataBase: new URL("https://johnmunn.tech"),
  alternates: {
    canonical: "https://johnmunn.tech",
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
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        {/* Preload critical resources */}
        <link rel="preload" href="/me.jpeg" as="image" type="image/jpeg" />
        <link rel="preload" href="/pentagon-growth.svg" as="image" type="image/svg+xml" />
        {/* Resource hints for better performance */}
        <link rel="prefetch" href="/strategic-narratives" />
        <link rel="prefetch" href="/contact" />
        <PersonSchema />
        <WebsiteSchema />
      </head>
      <body>{children}</body>
    </html>
  )
}
