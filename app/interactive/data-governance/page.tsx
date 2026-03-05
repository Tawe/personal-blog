import type { Metadata } from 'next'
import Script from 'next/script'
import DataGovernanceClient from './DataGovernanceClient'
import { buildMetadata } from '@/lib/seo-metadata'

const SHARE_IMAGE = '/datasystemsatlas.png'
const PAGE_URL = 'https://johnmunn.tech/interactive/data-governance'
const PAGE_DESCRIPTION =
  'How data moves, breaks, and gets governed. Explore lifecycle stages, architecture tradeoffs, failure propagation, and practical controls.'

export const metadata: Metadata = buildMetadata({
  title: 'Data Systems Atlas: How Data Moves, Breaks, and Gets Governed',
  description: PAGE_DESCRIPTION,
  path: '/interactive/data-governance',
  keywords: [
    'data governance',
    'data lifecycle',
    'data quality',
    'data management techniques',
    'data architecture',
    'data observability',
    'data reliability',
  ],
  image: SHARE_IMAGE,
  imageAlt: 'Data Systems Atlas interactive preview',
  openGraphType: 'article',
})

export default function InteractiveDataGovernancePage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: 'Data Systems Atlas: How Data Moves, Breaks, and Gets Governed',
        description: PAGE_DESCRIPTION,
        isPartOf: {
          '@type': 'WebSite',
          name: 'John Munn',
          url: 'https://johnmunn.tech',
        },
        breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
        about: ['Data lifecycle', 'Data governance', 'Data quality', 'Data architecture'],
        mainEntity: { '@id': `${PAGE_URL}#techarticle` },
      },
      {
        '@type': 'TechArticle',
        '@id': `${PAGE_URL}#techarticle`,
        headline: 'Data Systems Atlas: How Data Moves, Breaks, and Gets Governed',
        description: PAGE_DESCRIPTION,
        author: {
          '@type': 'Person',
          name: 'John Munn',
        },
        datePublished: '2026-03-04',
        dateModified: '2026-03-05',
        url: PAGE_URL,
        image: `https://johnmunn.tech${SHARE_IMAGE}`,
        keywords: [
          'data governance',
          'data lifecycle',
          'data quality',
          'data architecture',
          'data observability',
          'data reliability',
        ],
        educationalUse: 'reference',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Interactive',
            item: 'https://johnmunn.tech/interactive',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Data Systems Atlas',
            item: PAGE_URL,
          },
        ],
      },
    ],
  }

  return (
    <>
      <Script id="data-systems-atlas-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(schema)}
      </Script>
      <DataGovernanceClient />
    </>
  )
}
