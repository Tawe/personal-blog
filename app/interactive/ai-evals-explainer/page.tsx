import type { Metadata } from "next"
import Script from "next/script"
import { AiEvalsExplainerClient } from "./AiEvalsExplainerClient"
import { buildMetadata } from "@/lib/seo-metadata"

const SHARE_IMAGE = "/evalforrealsystems.png"

export const metadata: Metadata = buildMetadata({
  title: "AI Evals for Real Systems: Interactive Framework",
  description: "Interactive guide to AI evals for RAG, agents, and copilots. Compare eval types, blind spots, tradeoffs, and production strategy choices.",
  path: "/interactive/ai-evals-explainer",
  keywords: [
    "AI evals",
    "AI eval framework",
    "LLM evaluation",
    "RAG evaluation",
    "AI evaluation framework",
    "evaluating AI systems in production",
    "LLM evaluation framework",
    "RAG evaluation in production",
    "agent evaluation",
    "copilot evaluation",
    "AI evals for production systems",
    "LLM regression evals",
    "grounding evaluation",
    "hallucination evaluation",
    "model monitoring",
    "AI quality assurance",
  ],
  image: SHARE_IMAGE,
  imageAlt: "AI evals for real systems interactive explainer preview",
  openGraphType: "article",
})

export default function InteractiveAiEvalsExplainerPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://johnmunn.tech/interactive/ai-evals-explainer#webpage`,
        url: "https://johnmunn.tech/interactive/ai-evals-explainer",
        name: "Interactive AI Evals Explainer - AI evals for real systems",
        description: metadata.description,
        isPartOf: {
          "@type": "WebSite",
          name: "John Munn",
          url: "https://johnmunn.tech",
        },
        breadcrumb: { "@id": "https://johnmunn.tech/interactive/ai-evals-explainer#breadcrumb" },
        about: [
          "AI evaluation",
          "LLM evaluation",
          "RAG evaluation",
          "Agent evaluation",
          "AI monitoring",
        ],
        mainEntity: { "@id": "https://johnmunn.tech/interactive/ai-evals-explainer#techarticle" },
      },
      {
        "@type": "TechArticle",
        "@id": "https://johnmunn.tech/interactive/ai-evals-explainer#techarticle",
        headline: "Interactive AI Evals Explainer - AI evals for real systems",
        description: metadata.description,
        author: {
          "@type": "Person",
          name: "John Munn",
        },
        datePublished: "2026-02-22",
        dateModified: "2026-02-22",
        url: "https://johnmunn.tech/interactive/ai-evals-explainer",
        image: `https://johnmunn.tech${SHARE_IMAGE}`,
        keywords: [
          "AI evals",
          "LLM evaluation",
          "RAG evaluation",
          "AI evaluation framework",
          "evaluating AI systems in production",
        ],
        educationalUse: "reference",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://johnmunn.tech/interactive/ai-evals-explainer#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Interactive",
            item: "https://johnmunn.tech/interactive",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "AI Evals Explainer",
            item: "https://johnmunn.tech/interactive/ai-evals-explainer",
          },
        ],
      },
      {
        "@type": "DefinedTermSet",
        "@id": "https://johnmunn.tech/interactive/ai-evals-explainer#terms",
        name: "AI evaluation types",
        hasDefinedTerm: [
          { "@type": "DefinedTerm", name: "Correctness evals" },
          { "@type": "DefinedTerm", name: "Grounding / hallucination evals" },
          { "@type": "DefinedTerm", name: "Safety & compliance evals" },
          { "@type": "DefinedTerm", name: "Instruction-following evals" },
          { "@type": "DefinedTerm", name: "Quality / helpfulness evals" },
          { "@type": "DefinedTerm", name: "Retrieval evals" },
          { "@type": "DefinedTerm", name: "Regression evals" },
        ],
      },
    ],
  }

  return (
    <>
      <Script id="ai-evals-explainer-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(schema)}
      </Script>
      <AiEvalsExplainerClient />
    </>
  )
}
