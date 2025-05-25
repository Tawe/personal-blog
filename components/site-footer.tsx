import Link from "next/link"
import { Code2, Linkedin, Github, BookOpen, Rss, Code, Edit } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold text-slate-100">John Munn</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Technical Leader building scalable solutions and high-performing teams through strategic thinking and
              innovative problem-solving.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-slate-100 font-semibold">Navigation</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/vision" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                Vision
              </Link>
              <Link href="/technical-strategy" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                Technical Strategy
              </Link>
              <Link
                href="/strategic-narratives"
                className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
              >
                Strategic Narratives
              </Link>
              <Link href="/team-building" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                Team Building
              </Link>
              <Link href="/mentoring" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                Mentoring
              </Link>
            </nav>
          </div>

          {/* Strategic Narratives */}
          <div className="space-y-4">
            <h3 className="text-slate-100 font-semibold">Strategic Narratives</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/strategic-narratives/leadership-strategy"
                className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
              >
                Leadership & Strategy
              </Link>
              <Link
                href="/strategic-narratives/technical-architecture"
                className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
              >
                Technical Architecture
              </Link>
              <Link
                href="https://tawe.substack.com/"
                className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
              >
                World of Artumin ↗
              </Link>
              <Link
                href="https://tawe.substack.com/"
                className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
              >
                Game Design & Systems ↗
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-slate-100 font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <Link
                href="https://www.linkedin.com/in/john-munn-bbab434b/"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com/Tawe"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://medium.com/@johnmunn"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="Medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Edit className="h-5 w-5" />
              </Link>
              <Link
                href="https://dev.to/tawe"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="Dev.to"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code className="h-5 w-5" />
              </Link>
              <Link
                href="https://tawe.substack.com/"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="Tales from Artumin - Substack"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BookOpen className="h-5 w-5" />
              </Link>
              <Link
                href="/rss.xml"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="RSS Feed"
              >
                <Rss className="h-5 w-5" />
              </Link>
            </div>
            <div className="space-y-2">
              <Link href="/contact" className="text-slate-400 hover:text-blue-400 transition-colors text-sm block">
                Contact
              </Link>
              <Link href="/rss.xml" className="text-slate-400 hover:text-blue-400 transition-colors text-sm block">
                RSS Feed
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} John Munn. All rights reserved.</p>
          <p className="text-slate-500 text-sm mt-4 md:mt-0">Built with Next.js and MDX</p>
        </div>
      </div>
    </footer>
  )
}
