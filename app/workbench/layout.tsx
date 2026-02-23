import { Metadata } from "next"
import { buildMetadata } from "@/lib/seo-metadata"

export const metadata: Metadata = buildMetadata({
  title: "Workbench | John Munn",
  description: "Technical projects, open-source builds, and interactive engineering experiments.",
  path: "/workbench",
  keywords: ["interactive engineering", "software experiments", "architecture playground"],
})

export default function WorkbenchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
