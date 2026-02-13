export type ShareActionResult = "shared" | "copied" | "aborted"

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

  if (!successful) {
    throw new Error("Copy command failed")
  }
}

export async function shareOrCopyUrl(title: string, url: string): Promise<ShareActionResult> {
  if (canUseNativeShare(title, url)) {
    try {
      await navigator.share({ title, url })
      return "shared"
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "aborted"
      }
    }
  }

  await copyTextWithFallback(url)
  return "copied"
}
