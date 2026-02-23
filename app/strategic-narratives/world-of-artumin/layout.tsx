import { Metadata } from "next"
import { buildMetadata } from "@/lib/seo-metadata"

export const metadata: Metadata = buildMetadata({
  title: "World of Artumin | John Munn",
  description: "Reflective fantasy and leadership fables exploring worth, power, and courage through narrative.",
  path: "/strategic-narratives/world-of-artumin",
  keywords: ["World of Artumin", "leadership fables", "strategic narratives", "fantasy storytelling"],
  image: "/theblackpowdercover.png",
  imageAlt: "World of Artumin by John Munn",
})

export default function WorldOfArtuminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
