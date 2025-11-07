import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact - Let's Connect",
  description: "Ready to discuss leadership, mentoring, or collaboration opportunities? Get in touch with John Munn for technical leadership guidance, team building, or strategic consulting.",
  openGraph: {
    title: "Contact - Let's Connect | John Munn",
    description: "Ready to discuss leadership, mentoring, or collaboration opportunities? Get in touch with John Munn.",
    url: "https://johnmunn.tech/contact",
    siteName: "John Munn - Technical Leader",
    images: [
      {
        url: "/me.jpeg",
        width: 1200,
        height: 630,
        alt: "John Munn - Contact",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact - Let's Connect | John Munn",
    description: "Ready to discuss leadership, mentoring, or collaboration opportunities?",
    images: ["/me.jpeg"],
  },
  alternates: {
    canonical: "https://johnmunn.tech/contact",
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

