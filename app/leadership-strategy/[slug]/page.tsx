import { permanentRedirect } from "next/navigation"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function LeadershipStrategyLegacyArticlePage({ params }: PageProps) {
  const { slug } = await params
  permanentRedirect(`/strategic-narratives/leadership-strategy/${slug}`)
}
