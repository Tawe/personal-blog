import { Metadata } from "next"

export const metadata: Metadata = {
  title: "World of Artumin",
  description: "Reflective fantasy and leadership fables exploring worth, power, and courage. Stories that blend creative storytelling with profound leadership insights.",
  openGraph: {
    title: "World of Artumin | John Munn",
    description: "Reflective fantasy and leadership fables exploring worth, power, and courage.",
    url: "https://johnmunn.tech/strategic-narratives/world-of-artumin",
    siteName: "John Munn - Technical Leader",
    images: [
      {
        url: "/me.jpeg",
        width: 1200,
        height: 630,
        alt: "John Munn - World of Artumin",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "World of Artumin | John Munn",
    description: "Reflective fantasy and leadership fables exploring worth, power, and courage.",
    images: ["/me.jpeg"],
  },
  alternates: {
    canonical: "https://johnmunn.tech/strategic-narratives/world-of-artumin",
  },
}

export default function WorldOfArtuminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

