import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo-metadata"

export const metadata: Metadata = buildMetadata({
  title: "Auth Atlas: Interactive Authentication Guide",
  description:
    "Pick a scenario, pick a method, and step through auth flows with diagram-first guidance on trade-offs and gotchas.",
  path: "/auth-atlas",
  keywords: [
    "authentication methods",
    "auth flows",
    "oidc",
    "jwt refresh tokens",
    "opaque tokens",
  ],
  openGraphType: "article",
})

export default function AuthAtlasLayout({ children }: { children: React.ReactNode }) {
  return children
}

