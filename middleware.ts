import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const canonicalHost = "johnmunn.tech"

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? ""
  const url = request.nextUrl.clone()

  // Redirect www to non-www so there is a single canonical origin (avoids CORS and duplicate indexing).
  if (host === "www.johnmunn.tech") {
    url.host = canonicalHost
    url.protocol = "https:"
    return NextResponse.redirect(url.toString(), 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all pathnames except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
