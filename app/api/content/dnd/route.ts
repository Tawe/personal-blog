import { DND_CONFIG } from "@/lib/content-configs"

export async function GET() {
  // Dynamic import to avoid bundling gray-matter/marked at build time
  const { createContentApiResponse } = await import("@/lib/content-api")
  return createContentApiResponse(DND_CONFIG)
}
