import { NextResponse } from "next/server"
import { getAllProjects } from "@/lib/project-utils"
import path from "path"

export async function GET() {
  try {
    const contentDir = path.join(process.cwd(), "content/projects")
    const projects = await getAllProjects(contentDir)
    
    return NextResponse.json({ 
      projects,
    })
  } catch (error) {
    console.error("Error loading projects:", error)
    return NextResponse.json({ 
      projects: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

