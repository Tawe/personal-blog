import { ContentFilter } from "./content-filter"
import type { ArtumiContentMetadata } from "@/lib/content"

export function ArtumiContentFilter(props: any) {
  return ContentFilter<ArtumiContentMetadata>(props)
}
