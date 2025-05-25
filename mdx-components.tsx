import type { MDXComponents } from "mdx/types"
import Image from "next/image"
import Link from "next/link"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-slate-100 mb-6 border-b border-slate-700 pb-4">{children}</h1>
    ),
    h2: ({ children }) => <h2 className="text-3xl font-semibold text-slate-200 mb-4 mt-8">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-semibold text-slate-300 mb-3 mt-6">{children}</h3>,
    p: ({ children }) => <p className="text-slate-300 leading-relaxed mb-4">{children}</p>,
    a: ({ href, children }) => (
      <Link
        href={href || "#"}
        className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
      >
        {children}
      </Link>
    ),
    ul: ({ children }) => <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-2">{children}</ol>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-400 my-6">{children}</blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-slate-800 text-blue-300 px-2 py-1 rounded text-sm font-mono">{children}</code>
    ),
    pre: ({ children }) => (
      <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto mb-6">{children}</pre>
    ),
    img: ({ src, alt }) => (
      <Image src={src || "/placeholder.svg"} alt={alt || ""} width={800} height={400} className="rounded-lg my-6" />
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-slate-700 rounded-lg">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-slate-700 bg-slate-800 px-4 py-2 text-left text-slate-200 font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => <td className="border border-slate-700 px-4 py-2 text-slate-300">{children}</td>,
    ...components,
  }
}
