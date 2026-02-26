import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo-metadata"
import { AuthAtlasClient } from "./AuthAtlasClient"

/*
README
- Add a new auth method: edit /Users/johnmunn/Documents/projects/personal-blog/app/auth-atlas/data/authMethods.ts and append a typed AuthMethod object.
- Add a new scenario: edit /Users/johnmunn/Documents/projects/personal-blog/app/auth-atlas/data/scenarios.ts and add the scenario id to relevant methods in authMethods.ts bestFor/avoidFor lists.
*/

export const metadata: Metadata = buildMetadata({
  title: "Auth Atlas: Interactive Authentication Guide",
  description:
    "Interactive guide for authentication methods with scenarios, flow explorers, compare mode, and recommendation wizard.",
  path: "/auth-atlas",
  keywords: [
    "authentication methods",
    "OIDC vs OAuth",
    "JWT vs opaque tokens",
    "session cookies",
    "API authentication",
    "interactive auth guide",
  ],
  openGraphType: "article",
})

export default function AuthAtlasPage() {
  return <AuthAtlasClient />
}
