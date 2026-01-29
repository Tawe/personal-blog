import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Writing | John Munn",
  description: "Leadership and technical architecture writing. One body of work on teams, systems, and complex challenges.",
  openGraph: {
    title: "Writing | John Munn",
    description: "Leadership and technical architecture writing. One body of work on teams, systems, and complex challenges.",
    url: "https://johnmunn.tech/writing",
    siteName: "John Munn - Technical Leader",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing | John Munn",
    description: "Leadership and technical architecture writing.",
  },
  alternates: {
    canonical: "https://johnmunn.tech/writing",
  },
}

export default function WritingLayout({ children }: { children: React.ReactNode }) {
  return children
}
