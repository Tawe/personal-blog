"use client"

import { useMemo } from "react"
import { usePathname } from "next/navigation"

const BASE_URL = "https://johnmunn.tech"

function pathToTopic(pathname: string): string[] {
  if (pathname.startsWith("/interactive")) return ["Interactive learning", "AI systems", "Technical architecture"]
  if (pathname.startsWith("/strategic-narratives/technical-architecture")) return ["Technical architecture", "System design", "AI reliability"]
  if (pathname.startsWith("/strategic-narratives/leadership-strategy")) return ["Engineering leadership", "Technical management", "Strategy"]
  if (pathname.startsWith("/projects") || pathname.startsWith("/workbench")) return ["Engineering projects", "Implementation tradeoffs"]
  if (pathname.startsWith("/services")) return ["Technical mentoring", "Team development"]
  if (pathname.startsWith("/writing")) return ["Technical writing", "Engineering strategy"]
  return ["Engineering leadership", "Technical architecture", "AI systems"]
}

export function PageSchema() {
  const pathname = usePathname() || "/"

  const schema = useMemo(() => {
    const url = pathname === "/" ? BASE_URL : `${BASE_URL}${pathname}`
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      isPartOf: { "@id": `${BASE_URL}#website` },
      inLanguage: "en-US",
      about: pathToTopic(pathname),
    }
  }, [pathname])

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  )
}
