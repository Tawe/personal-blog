"use client"

import { useState } from "react"
import Link from "next/link"
import { ContentLayout } from "@/components/content-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitContactPageForm } from "@/app/actions/forms"

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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-strong mb-4">Let's Connect</h1>
        <p className="text-text-body text-lg leading-relaxed mb-6">
          Open to conversation, mentoring, collaboration, or just exchanging notes.
        </p>
        <p className="text-text-body leading-relaxed mb-6">
          You can reach me by email, and I'll get back to you as soon as I can.
        </p>
        <p className="mb-8">
          <a
            href="mailto:john@johnmunn.tech"
            className="text-lg font-medium text-accent-primary hover:text-accent-primary-hover transition-colors underline underline-offset-2"
          >
            john@johnmunn.tech
          </a>
        </p>

        <div className="border-t border-border-subtle pt-8 mt-8">
          <h2 className="text-lg font-semibold text-text-strong mb-4">Send a message</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot: hidden from users; bots that fill it are rejected */}
            <div className="absolute -left-[9999px] top-0 opacity-0" aria-hidden="true">
              <label htmlFor="website">Leave blank</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
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
                rows={4}
                maxLength={5000}
                placeholder="What's on your mind?"
                className="mt-1.5 flex w-full rounded-md border border-border-subtle bg-bg-paper px-3 py-2 text-base text-text-body placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                autoComplete="off"
                disabled={isSubmitting}
              />
            </div>
            {result && (
              <p
                role="alert"
                aria-live="assertive"
                className={
                  result.success
                    ? "text-sm text-green-600 dark:text-green-400"
                    : "text-sm text-red-600 dark:text-red-400"
                }
              >
                {result.success ? result.message : result.error}
              </p>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-button bg-accent-primary hover:bg-accent-primary-hover text-white py-2.5 px-5"
            >
              {isSubmitting ? "Sending…" : "Send message"}
            </Button>
          </form>
        </div>

        <p className="text-sm text-text-muted mt-8">
          I'm based in Eastern Time and generally available for conversations across North America.
        </p>
        <p className="text-text-body mt-4">
          If email isn't your thing, I'm also on{" "}
          <Link
            href="https://www.linkedin.com/in/john-munn-bbab434b/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-primary hover:text-accent-primary-hover underline underline-offset-2"
          >
            LinkedIn<span className="sr-only"> (opens in new tab)</span>
          </Link>
          .
        </p>
      </div>
    </ContentLayout>
  )
}
