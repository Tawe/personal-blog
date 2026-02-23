import { Metadata } from "next"
import { buildMetadata } from "@/lib/seo-metadata"

export const metadata: Metadata = buildMetadata({
  title: "Contact | John Munn",
  description: "Open to mentoring, collaboration, and technical leadership conversations.",
  path: "/contact",
  keywords: ["contact John Munn", "technical leadership mentoring", "engineering consulting"],
})

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
