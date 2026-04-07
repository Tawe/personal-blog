import type { Metadata } from "next"

import { ContentLayout } from "@/components/content-layout"
import { EditorialPill, EditorialSurface, PageSection, RuleHeading } from "@/components/design-system"
import { buildMetadata } from "@/lib/seo-metadata"

export const metadata: Metadata = buildMetadata({
  title: "Dinosaur Eats Privacy Policy",
  description: "Privacy policy for Dinosaur Eats, a lightweight Chrome extension created for a temporary visual April Fools style effect.",
  path: "/privacy/dinosaur-eats",
  keywords: [
    "Dinosaur Eats",
    "privacy policy",
    "Chrome extension privacy",
    "browser extension privacy",
  ],
})

const usagePoints = [
  "is not collected",
  "is not stored",
  "is not transmitted",
  "is not shared with any third party",
  "is not used for analytics",
  "is not used for profiling or tracking",
]

const privateDataCategories = [
  "personal information",
  "browsing history",
  "authentication data",
  "health data",
  "financial data",
  "communications",
  "location information",
]

export default function DinosaurEatsPrivacyPage() {
  return (
    <ContentLayout>
      <div className="space-y-16 md:space-y-20">
        <section className="mx-auto max-w-4xl">
          <EditorialPill tone="accent" className="mb-4 w-fit">
            Privacy
          </EditorialPill>
          <h1 className="ds-heading mb-5">Dinosaur Eats Privacy Policy</h1>
          <p className="ds-lead max-w-3xl">
            Dinosaur Eats is a lightweight Chrome extension created for a temporary visual April Fools style effect.
          </p>
          <p className="ds-meta mt-4">Effective date: April 7, 2026</p>
        </section>

        <PageSection tone="paper" spacing="compact" containerClassName="max-w-4xl">
          <EditorialSurface className="space-y-10 p-8 sm:p-10">
            <section className="space-y-4">
              <RuleHeading as="h2">What data the extension uses</RuleHeading>
              <p className="ds-copy">
                The extension temporarily accesses visible text on the currently active webpage only to create the local
                dinosaur eating animation effect.
              </p>
              <p className="ds-copy">This webpage content:</p>
              <ul className="space-y-3 text-text-body">
                {usagePoints.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent-primary" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className="ds-copy">
                All processing happens <strong>locally inside the user&apos;s browser session</strong>.
              </p>
            </section>

            <section className="space-y-4">
              <RuleHeading as="h2">Storage</RuleHeading>
              <p className="ds-copy">
                The extension may store simple local preferences, such as whether the effect is enabled or small visual
                settings. These settings are stored locally using Chrome extension storage and never leave the browser.
              </p>
            </section>

            <section className="space-y-4">
              <RuleHeading as="h2">No personal data collection</RuleHeading>
              <p className="ds-copy">Dinosaur Eats does not collect any of the following:</p>
              <ul className="space-y-3 text-text-body">
                {privateDataCategories.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-4">
              <RuleHeading as="h2">Third parties</RuleHeading>
              <p className="ds-copy">
                Dinosaur Eats does not send data to external servers, third-party APIs, analytics providers,
                advertisers, or data processors.
              </p>
            </section>

            <section className="space-y-4">
              <RuleHeading as="h2">Data sales and transfers</RuleHeading>
              <p className="ds-copy">No user data is sold, transferred, rented, or shared.</p>
            </section>

            <section className="space-y-4">
              <RuleHeading as="h2">Contact</RuleHeading>
              <p className="ds-copy">For questions about this privacy policy, contact:</p>
              <div className="rounded-2xl border border-border-subtle bg-bg-soft p-5">
                <p className="text-lg font-semibold text-text-strong">John Munn</p>
                <a href="https://johnmunn.tech" className="ds-link">
                  https://johnmunn.tech
                </a>
              </div>
            </section>
          </EditorialSurface>
        </PageSection>
      </div>
    </ContentLayout>
  )
}
