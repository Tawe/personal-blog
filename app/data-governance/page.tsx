import type { Metadata } from 'next'
import DataGovernanceClient from '@/app/interactive/data-governance/DataGovernanceClient'
import { buildMetadata } from '@/lib/seo-metadata'

const SHARE_IMAGE = '/datasystemsatlas.png'

export const metadata: Metadata = buildMetadata({
  title: 'Data Systems Atlas: How Data Moves, Breaks, and Gets Governed',
  description:
    'How data moves, breaks, and gets governed. Explore lifecycle stages, architecture tradeoffs, failure propagation, and practical controls.',
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
  noindex: true,
})

export default function DataGovernanceAliasPage() {
  return <DataGovernanceClient />
}
