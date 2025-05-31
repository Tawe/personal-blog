"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope, faClock, faGlobe } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { ContentLayout } from "@/components/content-layout"

export default function Contact() {
  return (
    <ContentLayout
      title="Let's Connect"
      description="Ready to discuss leadership, mentoring, or collaboration opportunities"
    >
      <div className="max-w-4xl mx-auto">
        {/* Main Contact Section */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Get in Touch</h2>
            <p className="text-slate-300 text-lg">
              I'd love to hear from you. Send me an email and I'll get back to you within 24-48 hours.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-xl border border-slate-700 mb-8">
            <a
              href="mailto:john@johnmunn.tech"
              className="text-2xl font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-3 mb-4"
            >
              <FontAwesomeIcon icon={faEnvelope} />
              john@johnmunn.tech
            </a>
            <p className="text-slate-300 text-center max-w-md">
              Click above to send me an email, or reach out via LinkedIn below.
            </p>
          </div>

          <div className="flex justify-center">
            <a
              href="https://www.linkedin.com/in/john-munn-bbab434b/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faLinkedin} />
              Connect on LinkedIn
            </a>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* What to Include */}
          <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-3">
              <div className="w-2 h-6 bg-blue-400 rounded-full"></div>
              What to Include
            </h3>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Your name, role, and company</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Specific goals or challenges</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Timeline or deadlines</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>How you found my site</span>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-3">
              <div className="w-2 h-6 bg-blue-400 rounded-full"></div>
              Availability
            </h3>
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
                  <strong className="text-slate-200">Focus:</strong> North American time zones
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong className="text-slate-200">Best Times:</strong> Weekday evenings and weekends
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* What to Expect */}
        <div className="bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6 mt-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-3">
            <div className="w-2 h-6 bg-blue-400 rounded-full"></div>
            What to Expect
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-slate-300">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong className="text-slate-200">Initial Response:</strong> Quick acknowledgment within 24 hours
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong className="text-slate-200">Follow-up:</strong> Detailed response or scheduling
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong className="text-slate-200">Mentoring:</strong>{" "}
                <Link href="/mentoring" className="text-blue-400 hover:text-blue-300 underline">
                  Learn more here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  )
}
