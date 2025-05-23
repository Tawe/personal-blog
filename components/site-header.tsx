import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mountain } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Mountain className="h-6 w-6" />
          <span className="font-bold">John Doe</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/technical-writing" className="text-sm font-medium hover:text-primary">
            Technical Writing
          </Link>
          <Link href="/leadership-fantasy" className="text-sm font-medium hover:text-primary">
            Leadership Fantasy
          </Link>
          <Link href="/dnd-creations" className="text-sm font-medium hover:text-primary">
            D&D Creations
          </Link>
          <Link href="/team-building" className="text-sm font-medium hover:text-primary">
            Team Building
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild className="hidden md:flex">
            <Link href="/contact">Contact</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/technical-writing" className="text-lg font-medium hover:text-primary">
                  Technical Writing
                </Link>
                <Link href="/leadership-fantasy" className="text-lg font-medium hover:text-primary">
                  Leadership Fantasy
                </Link>
                <Link href="/dnd-creations" className="text-lg font-medium hover:text-primary">
                  D&D Creations
                </Link>
                <Link href="/team-building" className="text-lg font-medium hover:text-primary">
                  Team Building
                </Link>
                <Link href="/contact" className="text-lg font-medium hover:text-primary">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
