import { ContentFilter } from "./content-filter"
import type { TechnicalArticleMetadata } from "@/lib/content"

export function TechnicalContentFilter(props: any) {
  return ContentFilter<TechnicalArticleMetadata>(props)
}
