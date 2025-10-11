import { createContentApiResponse } from "@/lib/content-api"
import { LEADERSHIP_CONFIG } from "@/lib/content-configs"

export async function GET() {
  return createContentApiResponse(LEADERSHIP_CONFIG)
}
