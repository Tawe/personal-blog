import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"

import { CollectionPageSchema } from "@/components/collection-page-schema"
import { ContentLayout } from "@/components/content-layout"
import { EditorialSurface, PageSection, SectionIntro } from "@/components/design-system"
import { DateText } from "@/components/date-text"
import { Button } from "@/components/ui/button"

interface HubArticleItem {
  slug: string
  title: string
  date: string
  excerpt: string
  reading_time: number
  href: string
  theme: string
}

interface TopicCard {
  title: string
  body: string
}

interface ArticleHubPageProps {
  kicker: string
  title: string
  lead: string
  description: string
  schemaName: string
  schemaDescription: string
  schemaUrl: string
  schemaAbout: string[]
  backHref: string
  backLabel: string
  introTitle: string
  introDescription: string
  topics: TopicCard[]
  articlesTitle: string
  articlesDescription: string
  articles: HubArticleItem[]
}

export function ArticleHubPage({
  kicker,
  title,
  lead,
  description,
  schemaName,
  schemaDescription,
  schemaUrl,
  schemaAbout,
  backHref,
  backLabel,
  introTitle,
  introDescription,
  topics,
  articlesTitle,
  articlesDescription,
  articles,
}: ArticleHubPageProps) {
  const schemaItems = articles.map((article) => ({
    title: article.title,
    url: `https://johnmunn.tech${article.href}`,
    date: article.date,
    excerpt: article.excerpt,
  }))

  return (
    <ContentLayout>
      <CollectionPageSchema
        name={schemaName}
        description={schemaDescription}
        url={schemaUrl}
        about={schemaAbout}
        items={schemaItems}
      />

      <div className="space-y-16 md:space-y-20">
        <section className="mx-auto max-w-5xl">
          <div className="mb-8">
            <Button variant="ghost" className="w-fit px-0 text-text-body hover:text-accent-primary" asChild>
              <Link href={backHref}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {backLabel}
              </Link>
            </Button>
          </div>

          <div className="space-y-6 text-center">
            <p className="ds-kicker">{kicker}</p>
            <h1 className="ds-heading">{title}</h1>
            <p className="ds-lead mx-auto max-w-3xl">{lead}</p>
            <p className="ds-copy mx-auto max-w-3xl">{description}</p>
          </div>
        </section>

        <PageSection tone="paper" spacing="compact" containerClassName="max-w-6xl">
          <SectionIntro title={introTitle} description={introDescription} className="mb-10" />
          <div className="grid gap-6 md:grid-cols-3">
            {topics.map((topic) => (
              <EditorialSurface key={topic.title} className="h-full p-6">
                <h2 className="mb-3 text-xl font-semibold text-text-strong">{topic.title}</h2>
                <p className="ds-copy">{topic.body}</p>
              </EditorialSurface>
            ))}
          </div>
        </PageSection>

        <PageSection tone="soft" spacing="compact" containerClassName="max-w-6xl">
          <SectionIntro title={articlesTitle} description={articlesDescription} className="mb-10" />
          <div className="grid gap-4 md:grid-cols-2">
            {articles.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="group block rounded-xl border border-border-subtle bg-bg-paper p-5 shadow-[var(--shadow-soft)] transition-colors hover:border-accent-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <p className="mb-2 text-xs uppercase tracking-wide text-text-muted">{article.theme}</p>
                <h2 className="mb-3 text-xl font-semibold text-text-strong transition-colors group-hover:text-accent-primary">
                  {article.title}
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-text-body">{article.excerpt}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                  <DateText value={article.date} />
                  <span>{article.reading_time} min read</span>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-primary group-hover:text-accent-primary-hover">
                  Read article
                  <ChevronRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </PageSection>
      </div>
    </ContentLayout>
  )
}
