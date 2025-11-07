import { Metadata } from "next"

export const metadata: Metadata = {
  title: "D&D and TTRPGs",
  description: "Creative mechanics, homebrew content, and tabletop innovations. Custom monsters, spells, items, and character options designed for balanced and engaging play.",
  openGraph: {
    title: "D&D and TTRPGs | John Munn",
    description: "Creative mechanics, homebrew content, and tabletop innovations.",
    url: "https://johnmunn.tech/strategic-narratives/dnd-ttrpgs",
    siteName: "John Munn - Technical Leader",
    images: [
      {
        url: "/me.jpeg",
        width: 1200,
        height: 630,
        alt: "John Munn - D&D and TTRPGs",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "D&D and TTRPGs | John Munn",
    description: "Creative mechanics, homebrew content, and tabletop innovations.",
    images: ["/me.jpeg"],
  },
  alternates: {
    canonical: "https://johnmunn.tech/strategic-narratives/dnd-ttrpgs",
  },
}

export default function DndTtrpgsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

