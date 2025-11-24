import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname
  
  // Skip redirect for static assets and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon.ico') ||
    /\.(js|css|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|map)$/.test(pathname)
  ) {
    return NextResponse.next()
  }
  
  // Redirect www to non-www (Vercel handles HTTPS redirects automatically)
  if (hostname && hostname.startsWith('www.')) {
    const nonWwwHost = hostname.replace(/^www\./, '')
    const url = request.nextUrl.clone()
    url.hostname = nonWwwHost
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301)
  }
  
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

