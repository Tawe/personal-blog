"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faCopy, faCheck, faEnvelope, faClock, faGlobe } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { ContentLayout } from "@/components/content-layout"

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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Primary Contact Information */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-blue-500/20 border border-blue-400/30">
              <FontAwesomeIcon icon={faEnvelope} className="text-2xl text-blue-400" />
            </div>
            <a
              href="mailto:john@johnmunn.tech"
              className="text-3xl lg:text-4xl font-semibold text-slate-100 hover:text-blue-400 transition-colors duration-200"
            >
              john@johnmunn.tech
            </a>
            <button
              onClick={copyEmail}
              className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 transition-all duration-200 group"
              title="Copy email address"
            >
              <FontAwesomeIcon
                icon={copied ? faCheck : faCopy}
                className={`text-lg ${copied ? "text-green-400" : "text-slate-400 group-hover:text-slate-200"}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 mb-6">
            <a
              href="https://www.linkedin.com/in/john-munn-bbab434b/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors duration-200 font-medium border border-blue-500"
            >
              <FontAwesomeIcon icon={faLinkedin} className="text-xl" />
              Connect on LinkedIn
            </a>
          </div>

          <p className="text-slate-300 font-medium">I typically respond within 24-48 hours</p>
        </div>

        {/* Communication Preferences */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
            <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-400 rounded-full"></div>
              How to Reach Me
            </h2>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong className="text-slate-200">General Inquiries:</strong> Email is best
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong className="text-slate-200">Professional Networking:</strong> Connect on LinkedIn
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong className="text-slate-200">Mentoring:</strong> Email with "Mentoring" in subject line
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong className="text-slate-200">Speaking Opportunities:</strong> Email with event details and
                  timeline
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
            <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-400 rounded-full"></div>
              When I'm Available
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
                  <strong className="text-slate-200">Geographic Focus:</strong> North American time zones
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong className="text-slate-200">Response Times:</strong> Email within 24-48 hours, LinkedIn within
                  24 hours
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What to Include */}
        <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-400 rounded-full"></div>
            Make Your Message Count
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-slate-300">
            <div>
              <h3 className="font-semibold text-slate-200 mb-3">Include in your message:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  Your background and current role
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  Specific interest (mentoring, collaboration, speaking, etc.)
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  Timeline if relevant
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  How you found my site
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-200 mb-3">This helps me:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  Provide more relevant responses
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  Connect you with appropriate resources
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  Prioritize time-sensitive requests
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  Understand our potential collaboration
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-400 rounded-full"></div>
            Specific Interests?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/mentoring"
              className="p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 rounded-lg transition-all duration-200 text-center group"
            >
              <div className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                Mentoring Sessions
              </div>
              <div className="text-sm text-slate-400 mt-1">Leadership & Career Growth</div>
            </Link>

            <Link
              href="/strategic-narratives"
              className="p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 rounded-lg transition-all duration-200 text-center group"
            >
              <div className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                Technical Leadership
              </div>
              <div className="text-sm text-slate-400 mt-1">Strategic Insights</div>
            </Link>

            <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg text-center">
              <div className="font-semibold text-slate-100">Speaking Inquiries</div>
              <div className="text-sm text-slate-400 mt-1">Include topics & audience</div>
            </div>

            <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg text-center">
              <div className="font-semibold text-slate-100">Collaboration</div>
              <div className="text-sm text-slate-400 mt-1">Describe your project</div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  )
}
