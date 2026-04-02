interface RelatedArticleLike {
  slug: string
  title: string
  date: string
  tags: string[]
  reading_time: number
  series?: string
  updated?: string
}

interface RelatedCandidate extends RelatedArticleLike {
  score: number
}

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase()
}

function getSharedTagCount(currentTags: string[], candidateTags: string[]): number {
  const current = new Set(currentTags.map(normalizeTag))
  return candidateTags.reduce((count, tag) => count + (current.has(normalizeTag(tag)) ? 1 : 0), 0)
}

function toTimestamp(value: string | undefined): number {
  if (!value) return 0
  const timestamp = new Date(value).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

export function getRelatedArticles<T extends RelatedArticleLike>(
  currentArticle: RelatedArticleLike,
  allArticles: T[],
  limit = 2
): T[] {
  const currentSeries = typeof currentArticle.series === "string" ? currentArticle.series.trim().toLowerCase() : ""

  const candidates: RelatedCandidate[] = allArticles
    .filter((article) => article.slug !== currentArticle.slug)
    .map((article) => {
      const sharedTags = getSharedTagCount(currentArticle.tags || [], article.tags || [])
      const candidateSeries = typeof article.series === "string" ? article.series.trim().toLowerCase() : ""
      const sameSeries = currentSeries && candidateSeries && currentSeries === candidateSeries ? 1 : 0

      return {
        ...article,
        score: sharedTags * 10 + sameSeries * 25 + Math.min(article.reading_time || 0, 20) / 100,
      }
    })
    .filter((article) => article.score > 0)

  const sortedCandidates = [...candidates].sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score

    const rightTimestamp = toTimestamp(right.updated || right.date)
    const leftTimestamp = toTimestamp(left.updated || left.date)
    if (rightTimestamp !== leftTimestamp) return rightTimestamp - leftTimestamp

    return left.title.localeCompare(right.title)
  })

  const fallbackCandidates = allArticles
    .filter((article) => article.slug !== currentArticle.slug)
    .sort((left, right) => {
      const rightTimestamp = toTimestamp(right.updated || right.date)
      const leftTimestamp = toTimestamp(left.updated || left.date)
      if (rightTimestamp !== leftTimestamp) return rightTimestamp - leftTimestamp
      return left.title.localeCompare(right.title)
    })

  const results: T[] = []
  const seen = new Set<string>()

  for (const article of [...sortedCandidates, ...fallbackCandidates]) {
    if (seen.has(article.slug)) continue
    seen.add(article.slug)
    results.push(article as T)
    if (results.length >= limit) break
  }

  return results
}
