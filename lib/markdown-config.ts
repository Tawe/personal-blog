/**
 * Configure marked with syntax highlighting using highlight.js
 * This is separated to avoid bundling issues and allow dynamic imports
 */

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
    // First parse with marked
    const html = typeof markedParse === 'function' ? markedParse(content) : content
    
    // Then process code blocks to add syntax highlighting
    // This regex finds <pre><code> blocks (marked's default output)
    // Handles both with and without language class
    return html.replace(/<pre><code(?:\s+class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
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

