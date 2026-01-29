"use client"

import Link from "next/link"
import { ContentLayout } from "@/components/content-layout"

export default function Contact() {
  return (
    <ContentLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-strong mb-4">Let's Connect</h1>
        <p className="text-text-body text-lg leading-relaxed mb-6">
          Open to conversation, mentoring, collaboration, or just exchanging notes.
        </p>
        <p className="text-text-body leading-relaxed mb-4">
          You can reach me by email, and I'll get back to you as soon as I can.
        </p>
        <p className="mb-6">
          <a
            href="mailto:john@johnmunn.tech"
            className="text-lg font-medium text-accent-primary hover:text-accent-primary-hover transition-colors underline underline-offset-2"
          >
            john@johnmunn.tech
          </a>
        </p>
        <p className="text-sm text-text-muted mb-8">
          I'm based in Eastern Time and generally available for conversations across North America.
        </p>
        <p className="text-text-body">
          If email isn't your thing, I'm also on{" "}
          <Link
            href="https://www.linkedin.com/in/john-munn-bbab434b/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-primary hover:text-accent-primary-hover underline underline-offset-2"
          >
            LinkedIn
          </Link>
          .
        </p>
      </div>
    </ContentLayout>
  )
}
