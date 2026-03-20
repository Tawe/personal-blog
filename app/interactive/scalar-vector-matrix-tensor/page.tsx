import type { Metadata } from "next"
import Script from "next/script"
import { buildMetadata } from "@/lib/seo-metadata"
import { ScalarVectorMatrixTensorClient } from "./ScalarVectorMatrixTensorClient"

const PAGE_URL = "https://johnmunn.tech/interactive/scalar-vector-matrix-tensor"
const PAGE_TITLE = "Scalar vs Vector vs Matrix vs Tensor: Interactive Visual Guide"
const PAGE_DESCRIPTION =
  "An interactive visual guide to scalar, vector, matrix, and tensor thinking. Morph a point into a line, a grid, and stacked layers to see how dimensions add structure."
const SHARE_IMAGE = "/Scalarvectormatrixtensor.png"
const keywords = [
  "scalar vs vector vs matrix vs tensor",
  "tensor explained visually",
  "matrix explained visually",
  "vector explained simply",
  "scalar explained simply",
  "dimensional thinking",
  "interactive tensor explainer",
  "tensor shape explained",
  "what is a tensor",
  "vector intuition",
  "matrix intuition",
  "machine learning input shapes",
]

const baseMetadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/interactive/scalar-vector-matrix-tensor",
  keywords,
  image: SHARE_IMAGE,
  imageAlt: "Scalar vs Vector vs Matrix vs Tensor interactive explainer preview",
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
    publishedTime: "2026-03-19T00:00:00.000Z",
    modifiedTime: "2026-03-20T00:00:00.000Z",
    authors: ["John Munn"],
    tags: keywords,
    section: "Interactive Learning",
  },
  twitter: {
    ...baseMetadata.twitter,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    creator: "@JohnMunn5",
    site: "@JohnMunn5",
  },
}

export default function ScalarVectorMatrixTensorPage() {
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
        about: ["Scalar", "Vector", "Matrix", "Tensor", "Dimensional thinking"],
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
        datePublished: "2026-03-19",
        dateModified: "2026-03-20",
        url: PAGE_URL,
        image: `https://johnmunn.tech${SHARE_IMAGE}`,
        keywords,
        educationalUse: "reference",
        mainEntityOfPage: PAGE_URL,
        inLanguage: "en-US",
        publisher: {
          "@type": "Person",
          name: "John Munn",
          url: "https://johnmunn.tech",
        },
        learningResourceType: "interactive guide",
        abstract: PAGE_DESCRIPTION,
        articleSection: "Interactive Learning",
        about: [
          { "@id": `${PAGE_URL}#terms` },
          {
            "@type": "Thing",
            name: "Tensor shape",
          },
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
            name: "Scalar vs Vector vs Matrix vs Tensor",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${PAGE_URL}#terms`,
        name: "Scalar, vector, matrix, tensor terms",
        hasDefinedTerm: [
          {
            "@type": "DefinedTerm",
            name: "Scalar",
            description: "A single value with no internal layout.",
          },
          {
            "@type": "DefinedTerm",
            name: "Vector",
            description: "An ordered set of values where direction or position along one axis matters.",
          },
          {
            "@type": "DefinedTerm",
            name: "Matrix",
            description: "A two-dimensional grid of values organized by rows and columns.",
          },
          {
            "@type": "DefinedTerm",
            name: "Tensor",
            description: "A structure formed by adding more axes beyond a matrix.",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the difference between a scalar, vector, matrix, and tensor?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A scalar is one value. A vector adds one axis of order or direction. A matrix adds rows and columns. A tensor adds more axes beyond a matrix.",
            },
          },
          {
            "@type": "Question",
            name: "Is a tensor a completely different kind of object?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. A tensor is the same core idea as a scalar, vector, or matrix, but with more dimensions or axes of organization.",
            },
          },
          {
            "@type": "Question",
            name: "Why do tensors matter in machine learning?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Machine learning systems care about the shape of data. Tensors describe how many axes the input has, such as batch, channel, height, width, or time.",
            },
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${PAGE_URL}#takeaways`,
        name: "Dimensional thinking takeaways",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Each step adds structure instead of replacing the previous idea.",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Vectors, matrices, and tensors are best understood as values organized across more axes.",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Shape matters because model inputs succeed or fail based on their dimensions.",
          },
        ],
      },
    ],
  }

  return (
    <>
      <Script id="scalar-vector-matrix-tensor-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(schema)}
      </Script>
      <ScalarVectorMatrixTensorClient />
    </>
  )
}
