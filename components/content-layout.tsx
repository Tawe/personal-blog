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
    <div className="min-h-screen bg-bg-primary">
      <div className="absolute inset-0 bg-tech-pattern opacity-[0.06]"></div>
      <div className="relative">
        <SiteHeader />

        <main className={isArticle ? "w-full" : "container mx-auto px-4 sm:px-6 py-10 sm:py-12"}>
          {isArticle && article && config ? (
            <SharedArticleTemplate article={article} config={config} />
          ) : (
            <div className="space-y-8">
              {!isArticle && title && (
                <div className="max-w-4xl mx-auto">
                  <header className="mb-12 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">{title}</h1>
                    {description && <p className="text-xl text-text-secondary max-w-3xl mx-auto">{description}</p>}
                  </header>
                </div>
              )}
              <div className="max-w-7xl mx-auto">{children}</div>
            </div>
          )}
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}
