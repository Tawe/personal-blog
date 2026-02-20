import { Metadata } from "next"

export const metadata: Metadata = {
  title: "World of Artumin | John Munn",
  description:
    "Reflective fantasy and leadership fables exploring worth, power, and courage through narrative.",
  keywords: [
    "World of Artumin",
    "leadership fables",
    "fantasy leadership stories",
    "strategic narratives",
    "John Munn",
  ],
  authors: [{ name: "John Munn" }],
  creator: "John Munn",
  publisher: "John Munn",
  category: "technology",
  openGraph: {
    title: "World of Artumin | John Munn",
    description:
      "Reflective fantasy and leadership fables exploring worth, power, and courage through narrative.",
    url: "https://johnmunn.tech/strategic-narratives/world-of-artumin",
    siteName: "John Munn - Technical Leader",
    images: [
      {
        url: "/theblackpowdercover.png",
        width: 1200,
        height: 630,
        alt: "World of Artumin by John Munn",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "World of Artumin | John Munn",
    description:
      "Reflective fantasy and leadership fables exploring worth, power, and courage through narrative.",
    images: ["/theblackpowdercover.png"],
    creator: "@JohnMunn5",
  },
  alternates: {
    canonical: "https://johnmunn.tech/strategic-narratives/world-of-artumin",
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

export default function WorldOfArtuminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
