"use client"

import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useEffect, useMemo, useRef, useState } from "react"
import { buildLinkedInShareHref, shareOrCopyUrl } from "@/lib/share-client"

const AuthAtlasStageV2 = dynamic(
  () => import("./components/AuthAtlasStageV2").then((mod) => mod.AuthAtlasStageV2),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
        Loading interactive stage...
      </div>
    ),
  }
)

const SiteHeader = dynamic(() => import("@/components/site-header").then((mod) => mod.SiteHeader), {
  ssr: false,
  loading: () => <div className="h-14 w-full border-b border-border-subtle bg-bg-primary/95 sm:h-16" />,
})

const SiteFooter = dynamic(() => import("@/components/site-footer").then((mod) => mod.SiteFooter), {
  ssr: false,
  loading: () => <div className="h-24 w-full border-t border-accent-rule bg-bg-secondary" />,
})

type AuthAtlasClientProps = {
  initialMethodId?: string
}

const stageMethodIds = new Set([
  "session-cookies",
  "oidc",
  "jwt-refresh",
  "opaque-tokens",
  "oauth2",
  "saml",
  "api-keys",
  "basic-auth",
  "mtls",
  "hmac-signed",
])

const methodAliases: Record<string, string> = {
  jwt: "jwt-refresh",
  sessions: "session-cookies",
  bearer: "bearer-tokens",
  opaque: "opaque-tokens",
  hmac: "hmac-signed",
}

function resolveMethodId(methodId: string | undefined) {
  if (!methodId) return null
  const normalized = methodId.toLowerCase()
  const candidate = methodAliases[normalized] ?? normalized
  return stageMethodIds.has(candidate) ? candidate : null
}

export function AuthAtlasClient({ initialMethodId }: AuthAtlasClientProps) {
  const stageRef = useRef<HTMLElement | null>(null)

  const initialStageMethodId = useMemo(() => resolveMethodId(initialMethodId), [initialMethodId])
  const [shareUrl, setShareUrl] = useState("https://johnmunn.tech/auth-atlas")
  const [shareState, setShareState] = useState<"idle" | "copying" | "copied">("idle")
  const [stageReady, setStageReady] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.origin + "/auth-atlas")
    }
  }, [])

  useEffect(() => {
    if (stageReady) return
    const target = stageRef.current
    if (!target || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first?.isIntersecting) {
          setStageReady(true)
          observer.disconnect()
        }
      },
      { root: null, threshold: 0.01, rootMargin: "0px" }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [stageReady])

  const linkedInShareHref = useMemo(
    () => buildLinkedInShareHref(shareUrl, "Auth Atlas: Interactive authentication flows and tradeoffs"),
    [shareUrl]
  )
  const xShareHref = useMemo(
    () =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        "Auth Atlas: interactive auth flows and tradeoffs"
      )}&url=${encodeURIComponent(shareUrl)}`,
    [shareUrl]
  )

  async function handleShare() {
    if (shareState === "copying") return
    setShareState("copying")
    try {
      const result = await shareOrCopyUrl("Auth Atlas: Interactive authentication flows and tradeoffs", shareUrl)
      setShareState(result === "copied" ? "copied" : "idle")
      if (result === "copied") {
        window.setTimeout(() => setShareState("idle"), 1400)
      }
    } catch {
      setShareState("idle")
    }
  }

  function scrollToStage() {
    setStageReady(true)
    stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleStageMethodChange(methodId: string) {
    if (typeof window === "undefined") return
    window.history.replaceState(window.history.state, "", `/auth-atlas/${methodId}`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="pb-14">
        <section className="border-b border-[#D6DEE6] bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="relative grid min-h-[70vh] grid-cols-1 items-start gap-8 py-8 md:min-h-[calc(100vh-4rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center md:gap-10 md:py-12">
              <div className="space-y-6">
                <div className="space-y-3">
                  <nav aria-label="Breadcrumb">
                    <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <li>
                        <Link
                          href="/interactive"
                          className="rounded-sm transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:text-slate-100"
                        >
                          Interactive
                        </Link>
                      </li>
                      <li aria-hidden="true">/</li>
                      <li aria-current="page">Auth Atlas</li>
                    </ol>
                  </nav>
                  <h1 className="text-4xl font-bold leading-tight text-slate-900 lg:text-5xl dark:text-slate-100">Auth Atlas</h1>
                  <p className="text-2xl font-medium text-slate-700 dark:text-slate-300">
                    Pick a scenario. Pick a method. See the auth flow.
                  </p>
                  <p className="text-base text-slate-600 dark:text-slate-300">
                    Interactive diagrams showing how modern authentication actually works, step by step.
                  </p>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Diagram-first guidance for authentication choices, with trade-offs and gotchas. High-level guidance only. Validate in your environment.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={scrollToStage}
                    className="inline-flex h-10 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    Start exploring
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-400 dark:hover:text-slate-100"
                    onClick={handleShare}
                    disabled={shareState === "copying"}
                  >
                    <span aria-hidden="true">{shareState === "copied" ? "✓" : "↗"}</span>
                    <span>{shareState === "copied" ? "Copied" : "Share"}</span>
                  </button>
                  <span className="inline-flex h-9 items-center">
                    <Link
                      href={linkedInShareHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center rounded-md px-3 text-sm text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-400 dark:hover:text-slate-100"
                    >
                      <span className="mr-2 text-xs font-semibold" aria-hidden="true">
                        in
                      </span>
                      LinkedIn
                    </Link>
                  </span>
                  <span className="inline-flex h-9 items-center">
                    <Link
                      href={xShareHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center rounded-md px-3 text-sm text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-400 dark:hover:text-slate-100"
                    >
                      Share on X
                    </Link>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <time dateTime="2026-02-25">February 25, 2026</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M12 9v4l2.5 1.5M9 3h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>11 min read</span>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="relative overflow-hidden rounded-xl border border-[#D6DEE6] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)] transition duration-300 group-hover:shadow-[0_24px_60px_rgba(15,23,42,0.2)]">
                  <div className="relative aspect-[16/10] md:aspect-[16/11] w-full">
                    <Image
                      src="/authatlas.png"
                      alt="Auth Atlas interface preview"
                      fill
                      sizes="(min-width: 768px) 55vw, 100vw"
                      fetchPriority="high"
                      loading="eager"
                      className="object-cover transition duration-500"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <button
                  type="button"
                  onClick={scrollToStage}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D6DEE6] bg-white/92 px-3 py-1.5 text-xs font-medium text-[#445561] shadow-sm transition-colors hover:bg-[#F8FBFD] dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800"
                  aria-label="Scroll to stage"
                >
                  Scroll
                  <span aria-hidden="true">↓</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
          <section ref={stageRef}>
            {stageReady ? (
              <AuthAtlasStageV2
                key={initialStageMethodId ?? "session-cookies"}
                initialMethodId={initialStageMethodId}
                onMethodChange={handleStageMethodChange}
              />
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
                Scroll to load the interactive flow stage.
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
