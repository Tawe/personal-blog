"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faCopy, faCheck, faEnvelope, faClock, faGlobe } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">Let's Connect</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Ready to discuss leadership, mentoring, or collaboration opportunities
          </p>
        </div>

        {/* Main Content - Centered Layout */}
        <div className="max-w-4xl mx-auto">
          {/* Primary Contact Information */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-8 border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <FontAwesomeIcon icon={faEnvelope} className="text-3xl text-blue-600 dark:text-blue-400" />
                <a
                  href="mailto:john@johnmunn.tech"
                  className="text-4xl font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  john@johnmunn.tech
                </a>
                <button
                  onClick={copyEmail}
                  className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 group"
                  title="Copy email address"
                >
                  <FontAwesomeIcon
                    icon={copied ? faCheck : faCopy}
                    className={`text-lg ${copied ? "text-green-600" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"}`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 mb-6">
                <a
                  href="https://www.linkedin.com/in/john-munn-bbab434b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  <FontAwesomeIcon icon={faLinkedin} className="text-xl" />
                  Connect on LinkedIn
                </a>
              </div>

              <p className="text-slate-600 dark:text-slate-400 font-medium">I typically respond within 24-48 hours</p>
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">How to Reach Me</h2>
              <div className="space-y-3 text-slate-600 dark:text-slate-300">
                <div>
                  <strong>General Inquiries:</strong> Email is best
                </div>
                <div>
                  <strong>Professional Networking:</strong> Connect on LinkedIn
                </div>
                <div>
                  <strong>Mentoring:</strong> Email with "Mentoring" in subject line
                </div>
                <div>
                  <strong>Speaking Opportunities:</strong> Email with event details and timeline
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">When I'm Available</h2>
              <div className="space-y-3 text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong>Time Zone:</strong> Eastern Time
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faGlobe} className="text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong>Geographic Focus:</strong> North American time zones
                  </span>
                </div>
                <div>
                  <strong>Response Times:</strong> Email within 24-48 hours, LinkedIn within 24 hours
                </div>
              </div>
            </div>
          </div>

          {/* What to Include */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Make Your Message Count</h2>
            <div className="grid md:grid-cols-2 gap-6 text-slate-600 dark:text-slate-300">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Include in your message:</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Your background and current role</li>
                  <li>Specific interest (mentoring, collaboration, speaking, etc.)</li>
                  <li>Timeline if relevant</li>
                  <li>How you found my site</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">This helps me:</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Provide more relevant responses</li>
                  <li>Connect you with appropriate resources</li>
                  <li>Prioritize time-sensitive requests</li>
                  <li>Understand our potential collaboration</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Specific Interests?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/mentoring"
                className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-200 text-center group"
              >
                <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Mentoring Sessions
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Leadership & Career Growth</div>
              </Link>

              <Link
                href="/strategic-narratives"
                className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-200 text-center group"
              >
                <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Technical Leadership
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Strategic Insights</div>
              </Link>

              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg text-center">
                <div className="font-semibold text-slate-900 dark:text-slate-100">Speaking Inquiries</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Include topics & audience</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg text-center">
                <div className="font-semibold text-slate-900 dark:text-slate-100">Collaboration</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Describe your project</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
