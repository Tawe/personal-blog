import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Temporarily disabled to fix redirect loops
// Configure www -> non-www redirect in Vercel dashboard under Domain settings
// Or use vercel.json redirects (but be careful with static assets)
export function middleware(request: NextRequest) {
  // Pass through all requests - redirects should be handled at Vercel platform level
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

