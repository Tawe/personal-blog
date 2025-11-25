"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export function GoogleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page views on route changes
    if (typeof window !== "undefined" && window.gtag) {
      const url = pathname + (window.location.search || "")
      window.gtag("config", "G-61NJPVE52G", {
        page_path: url,
        page_title: document.title,
        page_location: window.location.href,
      })
    }
  }, [pathname])

  return null
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

