import { createContentApiResponse } from "@/lib/content-api"
import { ARTUMIN_CONFIG } from "@/lib/content-configs"

export async function GET() {
  return createContentApiResponse(ARTUMIN_CONFIG)
}
