import type { ReactNode } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SharedArticleTemplate } from "@/components/shared-article-template"
import type { Article, HubConfig } from "@/lib/types"

interface ContentLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  isArticle?: boolean
  article?: Article
  config?: HubConfig
}

export function ContentLayout({
  children,
  title,
  description,
  isArticle = false,
  article,
  config,
}: ContentLayoutProps) {
  return (
    <div className="ds-page">
      <div className="absolute inset-0 bg-tech-pattern opacity-[0.04]"></div>
      <div className="relative">
        <SiteHeader />

        <main className={isArticle ? "w-full" : "ds-container py-10 sm:py-12"}>
          {isArticle && article && config ? (
            <SharedArticleTemplate article={article} config={config} />
          ) : (
            <div className="space-y-8">
              {!isArticle && title && (
                <div className="mx-auto max-w-4xl">
                  <header className="mb-12 text-center">
                    <h1 className="ds-heading mb-4">{title}</h1>
                    {description && <p className="ds-lead mx-auto max-w-3xl">{description}</p>}
                  </header>
                </div>
              )}
              <div className="mx-auto max-w-7xl">{children}</div>
            </div>
          )}
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}
