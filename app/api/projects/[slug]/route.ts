import { NextResponse } from "next/server"
import { getProject } from "@/lib/project-utils"
import path from "path"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const contentDir = path.join(process.cwd(), "content/projects")
    const project = await getProject({ contentDir, slug })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const response = NextResponse.json({ project })
    
    // Add caching headers for Vercel
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600')
    response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=3600')
    
    return response
  } catch (error) {
    console.error("Error loading project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

