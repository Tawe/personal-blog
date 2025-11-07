import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Technical Architecture",
  description: "Deep dives into system design, scalability, and technology decisions. Articles on software architecture, cloud systems, DevOps, AI/ML, and technical best practices.",
  openGraph: {
    title: "Technical Architecture | John Munn",
    description: "Deep dives into system design, scalability, and technology decisions.",
    url: "https://johnmunn.tech/strategic-narratives/technical-architecture",
    siteName: "John Munn - Technical Leader",
    images: [
      {
        url: "/me.jpeg",
        width: 1200,
        height: 630,
        alt: "John Munn - Technical Architecture",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Architecture | John Munn",
    description: "Deep dives into system design, scalability, and technology decisions.",
    images: ["/me.jpeg"],
  },
  alternates: {
    canonical: "https://johnmunn.tech/strategic-narratives/technical-architecture",
  },
}

export default function TechnicalArchitectureLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

