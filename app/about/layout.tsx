import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | John Munn",
  description: "Engineering leader and writer. Two decades at the intersection of technology, people, and the systems that connect them. Systems under stress, structure, narratives, and building things that last.",
  openGraph: {
    title: "About | John Munn",
    description: "Engineering leader and writer. Two decades at the intersection of technology, people, and the systems that connect them.",
    url: "https://johnmunn.tech/about",
    siteName: "John Munn",
    images: [{ url: "/me.jpeg", width: 1200, height: 630, alt: "John Munn" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | John Munn",
    description: "Engineering leader and writer. Two decades at the intersection of technology, people, and the systems that connect them.",
    images: ["/me.jpeg"],
  },
  alternates: { canonical: "https://johnmunn.tech/about" },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
