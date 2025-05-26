"use client"

import { useState } from "react"
import type { DndContentMetadata } from "@/lib/content"
import { SharedArticleTemplate } from "@/components/shared-article-template"

interface ArticleClientPageProps {
  article: DndContentMetadata
}

export function ArticleClientPage({ article }: ArticleClientPageProps) {
  const [shareStatus, setShareStatus] = useState<"idle" | "success" | "error">("idle")

  const handleShare = async () => {
    try {
      const url = window.location.href
      const title = article.title
      const text = article.excerpt || `Check out this article: ${title}`

      // Try native Web Share API first
      if (navigator.share && navigator.canShare?.({ title, text, url })) {
        await navigator.share({ title, text, url })
        setShareStatus("success")
        return
      }

      // Fallback to clipboard
      await navigator.clipboard.writeText(url)
      setShareStatus("success")

      // Reset status after 3 seconds
      setTimeout(() => setShareStatus("idle"), 3000)
    } catch (error) {
      console.error("Share failed:", error)

      // Final fallback - try to copy to clipboard manually
      try {
        const textArea = document.createElement("textarea")
        textArea.value = window.location.href
        textArea.style.position = "fixed"
        textArea.style.opacity = "0"
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        setShareStatus("success")
        setTimeout(() => setShareStatus("idle"), 3000)
      } catch (fallbackError) {
        console.error("Clipboard fallback failed:", fallbackError)
        setShareStatus("error")
        setTimeout(() => setShareStatus("idle"), 3000)
      }
    }
  }

  return (
    <SharedArticleTemplate
      article={article}
      onShare={handleShare}
      shareStatus={shareStatus}
      breadcrumbItems={[
        { label: "Strategic Narratives", href: "/strategic-narratives" },
        { label: "D&D and TTRPGs", href: "/strategic-narratives/dnd-ttrpgs" },
        { label: article.title, href: "#", current: true },
      ]}
    />
  )
}
