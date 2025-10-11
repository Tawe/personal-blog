import { createContentApiResponse } from "@/lib/content-api"
import { TECHNICAL_CONFIG } from "@/lib/content-configs"

export async function GET() {
  return createContentApiResponse(TECHNICAL_CONFIG)
}
