import { NextRequest, NextResponse } from "next/server"

const CANONICAL_HOST = "johnmunn.tech"
const PRODUCTION_HOSTS = new Set([CANONICAL_HOST, `www.${CANONICAL_HOST}`])
const CANONICAL_QUERYLESS_PATH_PREFIXES = [
  "/leadership-strategy",
  "/strategic-narratives/leadership-strategy",
  "/strategic-narratives/technical-architecture",
  "/strategic-narratives/world-of-artumin",
  "/strategic-narratives/dnd-ttrpgs",
]

function isProductionHost(host: string) {
  return PRODUCTION_HOSTS.has(host.split(":")[0])
}

function shouldStripQuery(pathname: string) {
  return CANONICAL_QUERYLESS_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || ""
  const forwardedProto = request.headers.get("x-forwarded-proto")
  const isProduction = isProductionHost(host)
  const url = request.nextUrl.clone()
  let shouldRedirect = false

  if (host.startsWith("www.")) {
    url.hostname = CANONICAL_HOST
    shouldRedirect = true
  }

  if (isProduction && (url.protocol === "http:" || forwardedProto === "http")) {
    url.protocol = "https:"
    shouldRedirect = true
  }

  if (url.pathname === "/leadership-strategy") {
    url.pathname = "/strategic-narratives/leadership-strategy"
    shouldRedirect = true
  } else if (url.pathname.startsWith("/leadership-strategy/")) {
    url.pathname = url.pathname.replace(
      "/leadership-strategy/",
      "/strategic-narratives/leadership-strategy/"
    )
    shouldRedirect = true
  }

  if (url.search && shouldStripQuery(url.pathname)) {
    url.search = ""
    shouldRedirect = true
  }

  return shouldRedirect ? NextResponse.redirect(url, 308) : NextResponse.next()
}

export const config = {
  matcher: "/:path*",
}
