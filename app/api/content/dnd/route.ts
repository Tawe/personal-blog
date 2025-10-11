import { createContentApiResponse } from "@/lib/content-api"
import { DND_CONFIG } from "@/lib/content-configs"

export async function GET() {
  return createContentApiResponse(DND_CONFIG)
}
