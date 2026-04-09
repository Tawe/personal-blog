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

const TITLE_STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "how",
  "in",
  "into",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "so",
  "that",
  "the",
  "their",
  "they",
  "this",
  "to",
  "what",
  "why",
  "with",
  "you",
  "your",
])

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

function titleTokens(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !TITLE_STOP_WORDS.has(token))
}

function getSharedTitleTokenCount(currentTitle: string, candidateTitle: string): number {
  const current = new Set(titleTokens(currentTitle))
  return titleTokens(candidateTitle).reduce((count, token) => count + (current.has(token) ? 1 : 0), 0)
}

export function getRelatedArticles<T extends RelatedArticleLike>(
  currentArticle: RelatedArticleLike,
  allArticles: T[],
  limit = 4
): T[] {
  const currentSeries = typeof currentArticle.series === "string" ? currentArticle.series.trim().toLowerCase() : ""

  const candidates: RelatedCandidate[] = allArticles
    .filter((article) => article.slug !== currentArticle.slug)
    .map((article) => {
      const sharedTags = getSharedTagCount(currentArticle.tags || [], article.tags || [])
      const sharedTitleTokens = getSharedTitleTokenCount(currentArticle.title || "", article.title || "")
      const candidateSeries = typeof article.series === "string" ? article.series.trim().toLowerCase() : ""
      const sameSeries = currentSeries && candidateSeries && currentSeries === candidateSeries ? 1 : 0

      return {
        ...article,
        score:
          sharedTags * 10 +
          sharedTitleTokens * 4 +
          sameSeries * 25 +
          Math.min(article.reading_time || 0, 20) / 100,
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
