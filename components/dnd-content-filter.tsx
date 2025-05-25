import { ContentFilter } from "./content-filter"
import type { DndContentMetadata } from "@/lib/content"

export function DndContentFilter(props: any) {
  return ContentFilter<DndContentMetadata>(props)
}
