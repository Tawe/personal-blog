import { NextResponse } from "next/server"
import { getAllArticles, getAllTags } from "@/lib/content"

export async function GET() {
  try {
    const articles = getAllArticles()
    const tags = getAllTags("leadership")

    return NextResponse.json({ articles, tags })
  } catch (error) {
    console.error("Error fetching leadership content:", error)
    return NextResponse.json({ articles: [], tags: [] })
  }
}
