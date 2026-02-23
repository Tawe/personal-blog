import { Metadata } from "next"
import { buildMetadata } from "@/lib/seo-metadata"

export const metadata: Metadata = buildMetadata({
  title: "D&D and TTRPGs | John Munn",
  description: "Creative mechanics, homebrew content, and tabletop innovations for collaborative play.",
  path: "/strategic-narratives/dnd-ttrpgs",
  keywords: ["D&D", "TTRPG", "homebrew mechanics", "tabletop design"],
})

export default function DndTtrpgsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
