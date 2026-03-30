import type { Metadata } from "next"
import Script from "next/script"
import { ArchitecturePatternsGameClient } from "./ArchitecturePatternsGameClient"
import { buildMetadata } from "@/lib/seo-metadata"

const SHARE_IMAGE = "/architecturegame.png"
const PAGE_URL = "https://johnmunn.tech/interactive/architecture-patterns-game"
const PAGE_TITLE = "Architecture Pattern Match Game: Interactive Tradeoff Arena"
const PAGE_DESCRIPTION =
  "Interactive architecture quiz for reading dominant system pressure, matching the right software architecture pattern, and learning the tradeoffs behind each choice."
const keywords = [
  "software architecture patterns",
  "architecture quiz",
  "architecture tradeoffs",
  "software architecture game",
  "system design training",
  "strangler fig",
  "saga pattern",
  "cqrs",
  "event driven architecture",
  "cache aside",
  "circuit breaker",
  "sidecar pattern",
]

const baseMetadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/interactive/architecture-patterns-game",
  keywords,
  image: SHARE_IMAGE,
  imageAlt: "Architecture Pattern Match Game interactive preview",
  openGraphType: "article",
})

export const metadata: Metadata = {
  ...baseMetadata,
  category: "technology",
  openGraph: {
    ...baseMetadata.openGraph,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "article",
    publishedTime: "2026-03-30T00:00:00.000Z",
    modifiedTime: "2026-03-30T00:00:00.000Z",
    authors: ["John Munn"],
    tags: keywords,
    section: "Software Architecture",
  },
  twitter: {
    ...baseMetadata.twitter,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    creator: "@JohnMunn5",
    site: "@JohnMunn5",
  },
}

export default function ArchitecturePatternsGamePage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        isPartOf: {
          "@type": "WebSite",
          name: "John Munn",
          url: "https://johnmunn.tech",
        },
        breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
        about: ["Software architecture patterns", "System design tradeoffs", "Architecture decision making"],
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-page-summary]"],
        },
        mainEntity: { "@id": `${PAGE_URL}#article` },
      },
      {
        "@type": "TechArticle",
        "@id": `${PAGE_URL}#article`,
        headline: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        author: {
          "@type": "Person",
          name: "John Munn",
          url: "https://johnmunn.tech/about",
        },
        datePublished: "2026-03-30",
        dateModified: "2026-03-30",
        url: PAGE_URL,
        image: `https://johnmunn.tech${SHARE_IMAGE}`,
        keywords,
        educationalUse: "training",
        learningResourceType: "interactive quiz",
        abstract: PAGE_DESCRIPTION,
        articleSection: "Software Architecture",
        inLanguage: "en-US",
        mainEntityOfPage: PAGE_URL,
        publisher: {
          "@type": "Person",
          name: "John Munn",
          url: "https://johnmunn.tech",
        },
        about: [
          { "@id": `${PAGE_URL}#patterns` },
          {
            "@type": "Thing",
            name: "Architecture tradeoff analysis",
          },
        ],
      },
      {
        "@type": "Quiz",
        "@id": `${PAGE_URL}#quiz`,
        name: PAGE_TITLE,
        description: "Seven scenario rounds that train players to identify dominant system pressure and select the best-fit architecture pattern.",
        educationalUse: "assessment",
        learningResourceType: "interactive quiz",
        assesses: "Software architecture pattern selection under system pressure",
        about: ["Migration", "Rollback", "Read shape", "Fan-out", "Resilience", "Operational placement", "Hot reads"],
        hasPart: [
          { "@type": "Question", name: "Which pattern best fits a migration-risk dominated scenario?" },
          { "@type": "Question", name: "Which pattern best fits a distributed rollback scenario?" },
          { "@type": "Question", name: "Which pattern best fits a read-shape scenario?" },
        ],
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
            name: "Architecture Pattern Match Game",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${PAGE_URL}#patterns`,
        name: "Architecture patterns in the tradeoff arena",
        hasDefinedTerm: [
          { "@type": "DefinedTerm", name: "Strangler Fig", description: "Incrementally replace a legacy boundary while keeping the old system running." },
          { "@type": "DefinedTerm", name: "Saga", description: "Coordinate distributed work with local transactions and compensating actions." },
          { "@type": "DefinedTerm", name: "CQRS", description: "Separate write intent from read optimization when the workloads want different shapes." },
          { "@type": "DefinedTerm", name: "Event-Driven", description: "Broadcast work to many downstream consumers without tight synchronous coupling." },
          { "@type": "DefinedTerm", name: "Circuit Breaker", description: "Protect the system from cascading dependency failure by failing fast." },
          { "@type": "DefinedTerm", name: "Sidecar", description: "Attach shared operational behavior beside the app instead of inside it." },
          { "@type": "DefinedTerm", name: "Cache-Aside", description: "Keep hot data close and fetch from the source only on cache misses." },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What does this architecture pattern game teach?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "It teaches players to read dominant system pressure and choose architecture patterns based on tradeoffs rather than memorizing names.",
            },
          },
          {
            "@type": "Question",
            name: "Which architecture patterns are covered in the game?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The game covers Strangler Fig, Saga, CQRS, Event-Driven architecture, Circuit Breaker, Sidecar, and Cache-Aside.",
            },
          },
          {
            "@type": "Question",
            name: "How does the reveal help with learning?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Each reveal explains why the winning pattern fits, what the system would punish, why a tempting wrong answer almost fit, and what tradeoff the winning choice introduces.",
            },
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${PAGE_URL}#takeaways`,
        name: "Architecture tradeoff learning takeaways",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Patterns should be chosen by dominant system pressure, not by memorized definitions.",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "The most tempting wrong answer often teaches the most important tradeoff.",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Replay becomes more valuable when you study missed pressures instead of only your score.",
          },
        ],
      },
    ],
  }

  return (
    <>
      <Script id="architecture-patterns-game-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(schema)}
      </Script>
      <ArchitecturePatternsGameClient />
    </>
  )
}
