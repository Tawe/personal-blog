import type { Metadata } from "next"
import ArchitecturePlaygroundPage from "@/app/workbench/architecture-playground/page"
import { buildMetadata } from "@/lib/seo-metadata"

const SHARE_IMAGE = "/architecture-playground.png"

export const metadata: Metadata = buildMetadata({
  title: "API vs Message vs Event-Driven Architecture",
  description: "Interactive systems design comparison of API-driven, message-driven, and event-driven architectures with tradeoff analysis.",
  path: "/interactive/architecture-playground",
  keywords: ["API architecture", "event-driven architecture", "message-driven architecture", "systems design tradeoffs"],
  image: SHARE_IMAGE,
  imageAlt: "API vs Message vs Event-Driven Architecture interactive guide",
  openGraphType: "article",
})

export default ArchitecturePlaygroundPage
