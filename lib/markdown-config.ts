/**
 * Configure marked with syntax highlighting using highlight.js
 * This is separated to avoid bundling issues and allow dynamic imports
 */

function getCodePenEmbedHtml(codePenUrl: string): string | null {
  try {
    const parsed = new URL(codePenUrl)
    const segments = parsed.pathname.split("/").filter(Boolean)
    const penIndex = segments.findIndex((segment) => segment === "pen" || segment === "embed")

    if (penIndex <= 0 || penIndex === segments.length - 1) {
      return null
    }

    const user = segments[penIndex - 1]
    const penId = segments[penIndex + 1]
    const embedUrl = `https://codepen.io/${user}/embed/${penId}?default-tab=result`
    const canonicalUrl = `https://codepen.io/${user}/pen/${penId}`

    return `<div class="codepen-embed"><iframe src="${embedUrl}" title="CodePen demo" loading="lazy" allow="fullscreen"></iframe><p class="codepen-embed-fallback"><a href="${canonicalUrl}" target="_blank" rel="noopener noreferrer">Open this demo on CodePen</a></p></div>`
  } catch {
    return null
  }
}

const CODEPEN_TOKEN_PREFIX = "CODEPEN_EMBED::"

function tokenizeCustomEmbeds(content: string): string {
  return content.replace(/\{%\s*codepen\s+([^\s%]+)\s*%\}/g, (_match, rawUrl: string) => {
    return `${CODEPEN_TOKEN_PREFIX}${encodeURIComponent(rawUrl.trim())}`
  })
}

function transformCustomEmbedsInHtml(html: string): string {
  return html.replace(new RegExp(`<p>\\s*${CODEPEN_TOKEN_PREFIX}([^<\\s]+)\\s*<\\/p>`, "g"), (_match, encodedUrl: string) => {
    const decodedUrl = decodeURIComponent(encodedUrl)
    const embedHtml = getCodePenEmbedHtml(decodedUrl)
    return embedHtml ?? _match
  })
}

export async function getConfiguredMarked() {
  // Dynamic imports to avoid bundling at build time
  const markedModule = await import("marked")
  const hljsModule = await import("highlight.js")
  
  // Get highlight.js
  const hljs = hljsModule.default || hljsModule
  
  // Get marked - marked v16 exports parse as a named export
  const markedParse = markedModule.parse || markedModule.default?.parse || markedModule
  
  // Create a wrapper that adds syntax highlighting
  const parseWithHighlight = (content: string): string => {
    const tokenizedContent = tokenizeCustomEmbeds(content)

    // First parse with marked
    const html = typeof markedParse === 'function' ? markedParse(tokenizedContent) : tokenizedContent
    const htmlWithEmbeds = transformCustomEmbedsInHtml(html)
    
    // Then process code blocks to add syntax highlighting
    // This regex finds <pre><code> blocks (marked's default output)
    // Handles both with and without language class
    return htmlWithEmbeds.replace(/<pre><code(?:\s+class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
      // Decode HTML entities
      // Note: marked should already decode most entities, but we handle common ones
      const decodedCode = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/')
        .replace(/&#x60;/g, '`')
        .replace(/&#96;/g, '`')
      
      // Clean up the language name
      const cleanLang = lang ? lang.trim().toLowerCase() : null
      
      // Highlight the code
      let highlighted: string
      if (cleanLang && hljs.getLanguage(cleanLang)) {
        try {
          highlighted = hljs.highlight(decodedCode, { language: cleanLang }).value
        } catch (err) {
          // Fallback to auto-detect
          highlighted = hljs.highlightAuto(decodedCode).value
        }
      } else {
        try {
          highlighted = hljs.highlightAuto(decodedCode).value
        } catch (err) {
          highlighted = decodedCode
        }
      }
      
      // Return with hljs classes
      const langClass = cleanLang ? `language-${cleanLang}` : ''
      return `<pre><code class="hljs ${langClass}">${highlighted}</code></pre>`
    })
  }
  
  return parseWithHighlight
}
