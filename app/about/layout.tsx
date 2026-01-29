import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | John Munn",
  description: "I help teams and leaders navigate complex systems — technical, human, and organizational. Leadership through complexity, long-term experience, calm reflective authority.",
  openGraph: {
    title: "About | John Munn",
    description: "I help teams and leaders navigate complex systems — technical, human, and organizational.",
    url: "https://johnmunn.tech/about",
    siteName: "John Munn - Technical Leader",
    images: [{ url: "/me.jpeg", width: 1200, height: 630, alt: "John Munn" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | John Munn",
    description: "I help teams and leaders navigate complex systems — technical, human, and organizational.",
    images: ["/me.jpeg"],
  },
  alternates: { canonical: "https://johnmunn.tech/about" },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
