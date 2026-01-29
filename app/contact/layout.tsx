import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Let's Connect | John Munn",
  description: "Open to conversation — mentoring, collaboration, or just exchanging notes. Reach out by email or LinkedIn.",
  openGraph: {
    title: "Let's Connect | John Munn",
    description: "Open to conversation — mentoring, collaboration, or just exchanging notes. Reach out by email or LinkedIn.",
    url: "https://johnmunn.tech/contact",
    siteName: "John Munn",
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
    title: "Let's Connect | John Munn",
    description: "Open to conversation — mentoring, collaboration, or just exchanging notes.",
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

