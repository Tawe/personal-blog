import { NextResponse } from "next/server"
import { getAllTechnicalArticles, getAllTechnicalTags } from "@/lib/content"

export async function GET() {
  try {
    const articles = getAllTechnicalArticles()
    const tags = getAllTechnicalTags()

    return NextResponse.json({ articles, tags })
  } catch (error) {
    console.error("Error fetching technical content:", error)
    return NextResponse.json({ articles: [], tags: [] })
  }
}
