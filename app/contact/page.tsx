"use client"

import { useState } from "react"
import Link from "next/link"

import { submitContactPageForm } from "@/app/actions/forms"
import { ContentLayout } from "@/components/content-layout"
import { EditorialSurface, PageSection, SectionIntro } from "@/components/design-system"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const conversationTypes = [
  "You are working through a difficult architecture or platform decision",
  "You want a clearer conversation about leadership, team structure, or engineering communication",
  "You are considering mentoring, advisory work, or team-building support",
]

const promptIdeas = [
  "Here is the situation we are in, and here is what feels unclear.",
  "We have a technical decision to make, and the tradeoffs are getting muddy.",
  "I think there is a team or leadership problem underneath the technical symptoms.",
]

export default function Contact() {
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setResult(null)
    setIsSubmitting(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    const res = await submitContactPageForm(formData)
    setResult(res)
    setIsSubmitting(false)
    if (res.success) form.reset()
  }

  return (
    <ContentLayout>
      <div className="space-y-16 md:space-y-20">
        <section className="mx-auto max-w-4xl text-center">
          <p className="ds-kicker mb-4">Contact</p>
          <h1 className="ds-heading mb-5">The best first step is a short note with context</h1>
          <p className="ds-lead mx-auto max-w-3xl">
            Reach out if you want to talk through a technical decision, a leadership challenge, a possible engagement, or a problem that is still hard to name clearly.
          </p>
        </section>

        <PageSection tone="paper" spacing="compact" containerClassName="max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <EditorialSurface className="p-8">
              <SectionIntro
                title="Good Reasons to Reach Out"
                description="If any of these sound familiar, there is probably enough context for a useful first conversation."
                className="mb-8"
              />
              <ul className="space-y-4 text-text-body">
                {conversationTypes.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 border-t border-border-subtle pt-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">Direct email</p>
                <a href="mailto:john@johnmunn.tech" className="ds-link text-lg">
                  john@johnmunn.tech
                </a>
                <p className="ds-meta mt-3">
                  I&apos;m based in Eastern Time and generally reply to serious inquiries as quickly as I can.
                </p>
                <p className="ds-copy mt-4">
                  If email is not ideal, I&apos;m also on{" "}
                  <Link
                    href="https://www.linkedin.com/in/john-munn-bbab434b/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ds-link"
                  >
                    LinkedIn
                    <span className="sr-only"> (opens in new tab)</span>
                  </Link>
                  .
                </p>
              </div>
            </EditorialSurface>

            <EditorialSurface className="p-8">
              <SectionIntro
                title="Send a Message"
                description="You do not need to over-explain. A short note with context, stakes, and what would be useful is enough."
                className="mb-8"
              />

              <div className="mb-8 rounded-xl border border-border-subtle bg-bg-soft p-5">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-text-muted">Useful prompts</p>
                <ul className="space-y-3 text-sm text-text-body">
                  {promptIdeas.map((prompt) => (
                    <li key={prompt} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent-primary" aria-hidden="true" />
                      <span>{prompt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="absolute -left-[9999px] top-0 opacity-0" aria-hidden="true">
                  <label htmlFor="website">Leave blank</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div>
                  <Label htmlFor="name" className="text-text-body font-normal">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    maxLength={200}
                    placeholder="Your name"
                    className="mt-1.5 border-border-subtle bg-bg-paper text-text-body placeholder:text-text-muted focus-visible:ring-accent-primary"
                    autoComplete="name"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-text-body font-normal">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    placeholder="you@example.com"
                    className="mt-1.5 border-border-subtle bg-bg-paper text-text-body placeholder:text-text-muted focus-visible:ring-accent-primary"
                    autoComplete="email"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-text-body font-normal">
                    Message
                  </Label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    maxLength={5000}
                    placeholder="What are you working through, and what kind of conversation would help?"
                    className="mt-1.5 flex w-full rounded-md border border-border-subtle bg-bg-paper px-3 py-2 text-base text-text-body placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    autoComplete="off"
                    disabled={isSubmitting}
                  />
                </div>

                {result ? (
                  <p
                    role="alert"
                    aria-live="assertive"
                    className={result.success ? "text-sm text-green-600 dark:text-green-400" : "text-sm text-red-600 dark:text-red-400"}
                  >
                    {result.success ? result.message : result.error}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-button bg-accent-primary px-5 py-2.5 text-white hover:bg-accent-primary-hover"
                >
                  {isSubmitting ? "Sending…" : "Send message"}
                </Button>
              </form>
            </EditorialSurface>
          </div>
        </PageSection>
      </div>
    </ContentLayout>
  )
}
