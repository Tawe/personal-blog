"use client"

import { useEffect } from "react"

export function CodeBlockCopy() {
  useEffect(() => {
    // Find all code blocks
    const codeBlocks = document.querySelectorAll(".prose pre code.hljs")
    
    codeBlocks.forEach((codeElement) => {
      const preElement = codeElement.parentElement
      if (!preElement || preElement.hasAttribute("data-copy-button")) {
        return // Already processed
      }

      // Mark as processed
      preElement.setAttribute("data-copy-button", "true")
      
      // Ensure pre has relative positioning
      if (getComputedStyle(preElement).position === "static") {
        preElement.style.position = "relative"
      }

      // Create copy button
      const button = document.createElement("button")
      button.className = "absolute top-2 right-2 p-2 rounded-md bg-slate-700/90 hover:bg-slate-600 text-slate-300 hover:text-slate-100 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 z-10"
      button.setAttribute("aria-label", "Copy code")
      button.setAttribute("title", "Copy code")
      button.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      `

      // Add group class to pre for hover effect
      preElement.classList.add("group")

      // Extract text content (decoding HTML entities)
      const getTextContent = (element: Element): string => {
        const temp = document.createElement("div")
        temp.innerHTML = element.innerHTML
        // Remove highlight.js spans but keep text
        return temp.textContent || temp.innerText || ""
      }

      // Copy functionality
      button.addEventListener("click", async (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        const text = getTextContent(codeElement)
        
        try {
          await navigator.clipboard.writeText(text)
          
          // Show success state
          const originalHTML = button.innerHTML
          button.innerHTML = `
            <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          `
          button.classList.remove("bg-slate-700/90", "hover:bg-slate-600")
          button.classList.add("bg-green-600/90")
          button.setAttribute("aria-label", "Copied!")
          
          setTimeout(() => {
            button.innerHTML = originalHTML
            button.classList.remove("bg-green-600/90")
            button.classList.add("bg-slate-700/90", "hover:bg-slate-600")
            button.setAttribute("aria-label", "Copy code")
          }, 2000)
        } catch (err) {
          console.error("Failed to copy:", err)
          // Fallback for older browsers
          const textArea = document.createElement("textarea")
          textArea.value = text
          textArea.style.position = "fixed"
          textArea.style.opacity = "0"
          textArea.style.pointerEvents = "none"
          document.body.appendChild(textArea)
          textArea.select()
          try {
            document.execCommand("copy")
            button.innerHTML = `
              <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            `
            setTimeout(() => {
              button.innerHTML = originalHTML
            }, 2000)
          } catch (fallbackErr) {
            console.error("Fallback copy failed:", fallbackErr)
          }
          document.body.removeChild(textArea)
        }
      })

      // Add button to pre element
      preElement.appendChild(button)
    })
  }, [])

  return null
}

