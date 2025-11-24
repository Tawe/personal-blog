import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware is now minimal - www redirect is handled by vercel.json
// This middleware can be used for other purposes if needed in the future
export function middleware(request: NextRequest) {
  // Vercel handles HTTPS redirects automatically
  // www to non-www redirect is handled in vercel.json to avoid conflicts
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

