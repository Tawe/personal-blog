export type ShareActionResult = "shared" | "copied"

function canUseNativeShare(title: string, url: string): boolean {
  if (!navigator.share) return false
  if (!navigator.canShare) return true
  return navigator.canShare({ title, url })
}

async function copyTextWithFallback(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch (error) {
      console.warn("Clipboard API failed, falling back to execCommand:", error)
    }
  }

  const textArea = document.createElement("textarea")
  textArea.value = text
  textArea.style.position = "fixed"
  textArea.style.left = "-999999px"
  textArea.style.top = "-999999px"
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  const successful = document.execCommand("copy")
  textArea.remove()

  if (successful) {
    return
  }

  // Final fallback for restrictive browser contexts: provide the URL for manual copy.
  if (typeof window !== "undefined" && typeof window.prompt === "function") {
    window.prompt("Copy this link:", text)
    return
  }

  throw new Error("Copy command failed")
}

export async function shareOrCopyUrl(title: string, url: string): Promise<ShareActionResult> {
  if (canUseNativeShare(title, url)) {
    try {
      await navigator.share({ title, url })
      return "shared"
    } catch (error) {
      console.warn("Native share failed or was dismissed, falling back to copy:", error)
    }
  }

  await copyTextWithFallback(url)
  return "copied"
}

export function buildLinkedInShareHref(url: string, copy?: string): string {
  const safeUrl = url.trim()
  if (!safeUrl) return ""

  if (!copy?.trim()) {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(safeUrl)}`
  }

  const shareText = `${copy.trim()}\n\n${safeUrl}`
  return `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`
}
