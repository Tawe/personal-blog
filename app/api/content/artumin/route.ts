import { NextResponse } from "next/server"
import { getAllArtumiContent, getAllTags } from "@/lib/content"

export async function GET() {
  try {
    const articles = getAllArtumiContent()
    const tags = getAllTags("artumin")

    return NextResponse.json({ articles, tags })
  } catch (error) {
    console.error("Error fetching artumin content:", error)
    return NextResponse.json({ articles: [], tags: [] })
  }
}
