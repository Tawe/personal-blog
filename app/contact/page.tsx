"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faCopy, faCheck, faEnvelope, faClock, faGlobe, faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { ContentLayout } from "@/components/content-layout"
import { ContactForm } from "@/components/contact-form"

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("john@johnmunn.tech")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy email:", err)
    }
  }

  return (
    <ContentLayout
      title="Let's Connect"
      description="Ready to discuss leadership, mentoring, or collaboration opportunities"
    >
      <div className="max-w-7xl mx-auto">
        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-3">
                  <FontAwesomeIcon icon={faPaperPlane} className="text-blue-400" />
                  Send a Message
                </h2>
                <p className="text-slate-300">Fill out the form below and I'll get back to you within 24-48 hours.</p>
              </div>
              <ContactForm />
            </div>
          </div>

          {/* Right Column - Contact Information */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Direct Contact Options */}
            <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-400 rounded-full"></div>
                Direct Contact
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
                    <FontAwesomeIcon icon={faEnvelope} className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <a
                      href="mailto:john@johnmunn.tech"
                      className="text-lg font-medium text-slate-100 hover:text-blue-400 transition-colors"
                    >
                      john@johnmunn.tech
                    </a>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 transition-all duration-200"
                    title="Copy email address"
                  >
                    <FontAwesomeIcon
                      icon={copied ? faCheck : faCopy}
                      className={`text-sm ${copied ? "text-green-400" : "text-slate-400"}`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
                    <FontAwesomeIcon icon={faLinkedin} className="text-blue-400" />
                  </div>
                  <a
                    href="https://www.linkedin.com/in/john-munn-bbab434b/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium text-slate-100 hover:text-blue-400 transition-colors"
                  >
                    Connect on LinkedIn
                  </a>
                </div>

                <div className="pt-2 border-t border-slate-600">
                  <p className="text-slate-300 text-sm">
                    <strong className="text-slate-200">Response Time:</strong> I typically respond within 24-48 hours
                  </p>
                </div>
              </div>
            </div>

            {/* What to Expect */}
            <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-400 rounded-full"></div>
                What to Expect
              </h2>
              <div className="space-y-3 text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-slate-200">Initial Response:</strong> Quick acknowledgment within 24 hours
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-slate-200">Follow-up:</strong> Detailed response or scheduling for deeper
                    conversation
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-slate-200">Mentoring:</strong>{" "}
                    <Link href="/mentoring" className="text-blue-400 hover:text-blue-300 underline">
                      Learn more about mentoring sessions
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Hours/Availability */}
            <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-400 rounded-full"></div>
                Availability
              </h2>
              <div className="space-y-3 text-slate-300">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faClock} className="text-blue-400 w-4" />
                  <span>
                    <strong className="text-slate-200">Time Zone:</strong> Eastern Time
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faGlobe} className="text-blue-400 w-4" />
                  <span>
                    <strong className="text-slate-200">Geographic Focus:</strong> Primarily North American time zones
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-slate-200">Best Times:</strong> Available for calls weekday evenings and
                    weekends
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Guidelines */}
            <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-400 rounded-full"></div>
                Get the Best Response
              </h2>
              <div className="space-y-2 text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Be specific about your goals or challenges</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Include relevant background (role, company size, etc.)</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Mention timeline if you have specific deadlines</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Reference how you found the site (helps me understand reach)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  )
}
