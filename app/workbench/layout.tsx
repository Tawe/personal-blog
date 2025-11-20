import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Workbench - Projects & Builds",
  description: "Technical projects, open source contributions, and experimental builds. A showcase of hands-on engineering work and technical experimentation.",
  openGraph: {
    title: "Workbench - Projects & Builds | John Munn",
    description: "Technical projects, open source contributions, and experimental builds.",
    url: "https://johnmunn.tech/workbench",
    siteName: "John Munn - Technical Leader",
    images: [
      {
        url: "/me.jpeg",
        width: 1200,
        height: 630,
        alt: "John Munn - Workbench",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Workbench - Projects & Builds | John Munn",
    description: "Technical projects, open source contributions, and experimental builds.",
    images: ["/me.jpeg"],
  },
  alternates: {
    canonical: "https://johnmunn.tech/workbench",
  },
}

export default function WorkbenchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

