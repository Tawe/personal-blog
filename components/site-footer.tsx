import Link from "next/link"
import { Mountain } from "lucide-react"
import { Github, Linkedin, Twitter } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col gap-6 py-8 md:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Mountain className="h-6 w-6" />
              <span className="font-bold">John Doe</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Head of Development | Technical Writer | Fantasy Storyteller | D&D Enthusiast
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            <div className="flex flex-col gap-2">
              <p className="font-medium">Site</p>
              <nav className="flex flex-col gap-2">
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  Home
                </Link>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </Link>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium">Content</p>
              <nav className="flex flex-col gap-2">
                <Link href="/technical-writing" className="text-sm text-muted-foreground hover:text-foreground">
                  Technical Writing
                </Link>
                <Link href="/leadership-fantasy" className="text-sm text-muted-foreground hover:text-foreground">
                  Leadership Fantasy
                </Link>
                <Link href="/dnd-creations" className="text-sm text-muted-foreground hover:text-foreground">
                  D&D Creations
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium">Services</p>
              <nav className="flex flex-col gap-2">
                <Link href="/team-building" className="text-sm text-muted-foreground hover:text-foreground">
                  Team Building
                </Link>
                <Link href="/team-building#services" className="text-sm text-muted-foreground hover:text-foreground">
                  On-site Sessions
                </Link>
                <Link href="/team-building#services" className="text-sm text-muted-foreground hover:text-foreground">
                  Virtual Adventures
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium">Social</p>
              <nav className="flex flex-col gap-2">
                <Link href="https://twitter.com" className="text-sm text-muted-foreground hover:text-foreground">
                  Twitter
                </Link>
                <Link href="https://github.com" className="text-sm text-muted-foreground hover:text-foreground">
                  GitHub
                </Link>
                <Link href="https://linkedin.com" className="text-sm text-muted-foreground hover:text-foreground">
                  LinkedIn
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} John Doe. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="https://twitter.com" aria-label="Twitter">
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link href="https://github.com" aria-label="GitHub">
              <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link href="https://linkedin.com" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
