import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects - Applied Work & Exploration",
  description: "Credible, curious, applied work. What I build and why — technical projects that explore problems and demonstrate how I think.",
  openGraph: {
    title: "Projects | John Munn",
    description: "Credible, curious, applied work. What I build and why.",
    url: "https://johnmunn.tech/projects",
    siteName: "John Munn",
    images: [
      {
        url: "/me.jpeg",
        width: 1200,
        height: 630,
        alt: "John Munn - Projects",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | John Munn",
    description: "Credible, curious, applied work. What I build and why.",
    images: ["/me.jpeg"],
  },
  alternates: {
    canonical: "https://johnmunn.tech/projects",
  },
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children
}
