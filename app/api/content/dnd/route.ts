import { NextResponse } from "next/server"
import { getAllDndContent, getAllDndTags, getAllDndSystems } from "@/lib/content"

export async function GET() {
  try {
    const articles = getAllDndContent()
    const tags = getAllDndTags()
    const systems = getAllDndSystems()

    return NextResponse.json({ articles, tags, systems })
  } catch (error) {
    console.error("Error fetching D&D content:", error)
    return NextResponse.json({ articles: [], tags: [], systems: [] })
  }
}
