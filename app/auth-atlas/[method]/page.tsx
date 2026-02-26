import type { Metadata } from "next"
import { AuthAtlasClient } from "../AuthAtlasClient"
import { buildMetadata } from "@/lib/seo-metadata"
import { authMethods } from "../data/authMethods"

type AuthAtlasMethodPageProps = {
  params: { method: string }
}

const methodAliases: Record<string, string> = {
  jwt: "jwt-refresh",
  sessions: "session-cookies",
  opaque: "opaque-tokens",
  hmac: "hmac-signed",
}

function resolveMethodId(method: string) {
  const normalized = method.toLowerCase()
  return methodAliases[normalized] ?? normalized
}

export async function generateMetadata({ params }: AuthAtlasMethodPageProps): Promise<Metadata> {
  const { method } = params
  const resolved = resolveMethodId(method)
  const selected = authMethods.find((entry) => entry.id === resolved)
  const methodName = selected?.name ?? "Auth Method"
  const methodDescription = selected?.description ?? selected?.tagline ?? "Interactive authentication flow and trade-off guidance."

  return buildMetadata({
    title: `Auth Atlas: ${methodName}`,
    description: `${methodDescription} Step-by-step diagrams and practical trade-off guidance.`,
    path: `/auth-atlas/${resolved}`,
    keywords: ["authentication", "auth flow", methodName.toLowerCase()],
    openGraphType: "article",
  })
}

export default async function AuthAtlasMethodPage({ params }: AuthAtlasMethodPageProps) {
  return <AuthAtlasClient initialMethodId={params.method} />
}
