import type { Metadata } from "next"
import Script from "next/script"
import { WhereAiSystemsDriftClient } from "./WhereAiSystemsDriftClient"
import { buildMetadata } from "@/lib/seo-metadata"

const SHARE_IMAGE = "/whereAISystemsDrift.png"
const PAGE_URL = "https://johnmunn.tech/interactive/where-ai-systems-drift"
const PAGE_DESCRIPTION =
  "Interactive guide to where AI systems drift across product, prompt, retrieval, model, output, and evaluation layers, with practical controls for bringing them back."

export const metadata: Metadata = buildMetadata({
  title: "Where AI Systems Drift, and How We Bring Them Back",
  description: PAGE_DESCRIPTION,
  path: "/interactive/where-ai-systems-drift",
  keywords: [
    "AI drift",
    "AI alignment",
    "LLM system design",
    "prompt engineering",
    "retrieval systems",
    "AI reliability",
    "AI guardrails",
    "AI evaluation",
  ],
  image: SHARE_IMAGE,
  imageAlt: "Where AI Systems Drift interactive preview",
  openGraphType: "article",
})

export default function WhereAiSystemsDriftPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: "Where AI Systems Drift, and How We Bring Them Back",
        description: PAGE_DESCRIPTION,
        isPartOf: {
          "@type": "WebSite",
          name: "John Munn",
          url: "https://johnmunn.tech",
        },
        breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
        about: ["AI alignment", "AI drift", "AI system design", "LLM reliability"],
        mainEntity: { "@id": `${PAGE_URL}#techarticle` },
      },
      {
        "@type": "TechArticle",
        "@id": `${PAGE_URL}#techarticle`,
        headline: "Where AI Systems Drift, and How We Bring Them Back",
        description: PAGE_DESCRIPTION,
        author: {
          "@type": "Person",
          name: "John Munn",
        },
        datePublished: "2026-03-14",
        dateModified: "2026-03-14",
        url: PAGE_URL,
        image: `https://johnmunn.tech${SHARE_IMAGE}`,
        keywords: ["AI drift", "AI alignment", "AI reliability", "prompt layer", "retrieval layer", "evaluation layer"],
        educationalUse: "reference",
        mainEntityOfPage: PAGE_URL,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumb`,
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
            name: "Where AI Systems Drift",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${PAGE_URL}#layers`,
        name: "AI system drift layers",
        hasDefinedTerm: [
          { "@type": "DefinedTerm", name: "User Intent Layer" },
          { "@type": "DefinedTerm", name: "Application Layer" },
          { "@type": "DefinedTerm", name: "Prompt Layer" },
          { "@type": "DefinedTerm", name: "Retrieval Layer" },
          { "@type": "DefinedTerm", name: "Model Layer" },
          { "@type": "DefinedTerm", name: "Output Layer" },
          { "@type": "DefinedTerm", name: "Evaluation Layer" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Where do AI systems usually drift?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "AI systems usually drift across multiple layers, including user intent framing, application logic, prompts, retrieval, model behavior, output handling, and evaluation.",
            },
          },
          {
            "@type": "Question",
            name: "Why is AI alignment a systems problem?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "AI alignment is a systems problem because failures rarely come from the model alone. Upstream ambiguity and downstream validation gaps compound into incorrect outputs.",
            },
          },
          {
            "@type": "Question",
            name: "How do teams reduce AI drift?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Teams reduce AI drift by improving task framing, tightening prompts, strengthening retrieval quality, validating outputs, and continuously evaluating production behavior.",
            },
          },
        ],
      },
    ],
  }

  return (
    <>
      <Script id="where-ai-systems-drift-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(schema)}
      </Script>
      <WhereAiSystemsDriftClient />
    </>
  )
}
