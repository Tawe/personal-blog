import path from "path"
import type { ContentConfig } from "./content-api"

export const LEADERSHIP_CONFIG: ContentConfig = {
  contentDir: path.join(process.cwd(), "content/leadership"),
  customFields: {
    featured: false,
    medium_link: undefined,
    devto_link: undefined,
    substack_link: undefined,
  }
}

export const TECHNICAL_CONFIG: ContentConfig = {
  contentDir: path.join(process.cwd(), "content/technical-writings"),
  defaultType: "article",
  customFields: {
    difficulty: "intermediate",
    code_languages: [],
    updated: undefined,
  }
}

export const ARTUMIN_CONFIG: ContentConfig = {
  contentDir: path.join(process.cwd(), "content/artumin"),
  defaultType: "story",
  customFields: {
    categories: [],
    region: undefined,
    status: "published",
    connections: [],
  }
}

export const DND_CONFIG: ContentConfig = {
  contentDir: path.join(process.cwd(), "content/dnd-musings"),
  defaultType: "homebrew",
  customFields: {
    system: "D&D 5e",
    level_range: undefined,
    availability: "free",
    duration: undefined,
    price: undefined,
    platform: undefined,
    external_url: undefined,
    rating: undefined,
    playtested: false,
  }
}

// Helper function to get config by content type
export function getContentConfig(contentType: string): ContentConfig {
  switch (contentType) {
    case "leadership":
      return LEADERSHIP_CONFIG
    case "technical":
    case "technical-writings":
      return TECHNICAL_CONFIG
    case "artumin":
      return ARTUMIN_CONFIG
    case "dnd":
    case "dnd-musings":
      return DND_CONFIG
    default:
      throw new Error(`Unknown content type: ${contentType}`)
  }
}