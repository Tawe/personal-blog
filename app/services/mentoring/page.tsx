import { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Users, Target, Lightbulb, TrendingUp, MessageSquare, Clock, MapPin, CheckCircle, Star, GraduationCap, Building2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Technical Leadership Mentoring",
  description: "Accelerating careers in technology leadership through practical guidance and proven frameworks. Mentoring for career transitions, strategic thinking, and organizational culture.",
  openGraph: {
    title: "Technical Leadership Mentoring | John Munn",
    description: "Accelerating careers in technology leadership through practical guidance and proven frameworks.",
    url: "https://johnmunn.tech/services/mentoring",
    siteName: "John Munn - Technical Leader",
    images: [
      {
        url: "/me.jpeg",
        width: 1200,
        height: 630,
        alt: "John Munn - Technical Leadership Mentor",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Leadership Mentoring | John Munn",
    description: "Accelerating careers in technology leadership through practical guidance and proven frameworks.",
    images: ["/me.jpeg"],
  },
  alternates: {
    canonical: "https://johnmunn.tech/services/mentoring",
  },
}

export default function MentoringPage() {
  const mentoringAreas = [
    {
      title: "Career Transition into Leadership",
      description: "Moving from IC to management roles, building credibility as a new leader",
      icon: TrendingUp,
      topics: ["IC to Management", "Technical Leadership", "Building Credibility"],
    },
    {
      title: "Technical Strategy & Decision Making",
      description: "Architecture choices, balancing innovation with stability",
      icon: Target,
      topics: ["Architecture Decisions", "Innovation Balance", "Stakeholder Communication"],
    },
    {
      title: "Team Building & Management",
      description: "Hiring, managing diverse teams, performance management",
      icon: Users,
      topics: ["Team Hiring", "Performance Management", "Difficult Conversations"],
    },
    {
      title: "CTO/VP Engineering Path",
      description: "Preparing for executive roles, board communication, strategic thinking",
      icon: Star,
      topics: ["Executive Preparation", "Board Communication", "Strategic Alignment"],
    },
    {
      title: "Creative Problem-Solving",
      description: "Storytelling, gaming principles, innovative leadership approaches",
      icon: Lightbulb,
      topics: ["Narrative Thinking", "Team Dynamics", "Creative Solutions"],
    },
    {
      title: "Organizational Culture & Change",
      description: "Building engineering culture, driving technical transformation, managing change",
      icon: Building2,
      topics: ["Culture Building", "Change Management", "Technical Transformation"],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Technical Leadership Mentoring
                  </h1>
                  <p className="text-xl text-primary font-semibold">
                    Accelerating careers in technology leadership through practical guidance and proven frameworks
                  </p>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Early in my career, a mentor helped me see that technical excellence alone wasn't enough for leadership
                    success. That guidance transformed my trajectory from a skilled developer to a strategic technical leader.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="#mentoring-areas">Explore Mentoring Areas</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/contact">Schedule Consultation</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Image
                    src="/mentoring.png"
                    width={400}
                    height={400}
                    alt="John Munn - Technical Leadership Mentor"
                    className="rounded-xl object-cover"
                    priority
                  />
                  <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground p-3 rounded-full">
                    <GraduationCap className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-7xl mx-auto space-y-16">
      {/* Value Proposition Section */}
      <section className="mb-16">
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-100">Why Mentoring Matters</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-4">
            <p>
              Early in my career, a mentor helped me see that technical excellence alone wasn't enough for leadership
              success. That guidance transformed my trajectory from a skilled developer to a strategic technical leader.
            </p>
            <p>
              I bring a unique perspective combining deep technical expertise, proven leadership experience, and
              creative problem-solving approaches. My focus is on practical, actionable guidance that delivers real
              results - not theoretical advice that sits on a shelf.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                Technical Depth
              </Badge>
              <Badge variant="secondary" className="bg-green-600/20 text-green-300">
                Leadership Experience
              </Badge>
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                Creative Problem-Solving
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Geographic Requirements - Prominent */}
      <section className="mb-16">
        <Card className="bg-amber-900/20 border-amber-600">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-100 flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              Availability & Scheduling
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-100">
            <div className="bg-amber-800/30 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">
                I work with mentees in North American time zones (EST, CST, MST, PST) to ensure optimal scheduling
                flexibility and real-time communication.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Available Times</h4>
                <ul className="space-y-1">
                  <li>• Weekday evenings</li>
                  <li>• Weekend mornings</li>
                  <li>• Flexible scheduling</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Session Frequency</h4>
                <ul className="space-y-1">
                  <li>• Bi-weekly sessions</li>
                  <li>• Monthly check-ins</li>
                  <li>• Based on your needs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Communication</h4>
                <ul className="space-y-1">
                  <li>• Video call sessions</li>
                  <li>• Email support</li>
                  <li>• Slack async help</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Mentoring Areas */}
      <section id="mentoring-areas" className="mb-16">
        <h2 className="text-3xl font-bold text-slate-100 mb-8 text-center">Mentoring Areas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentoringAreas.map((area, index) => {
            const IconComponent = area.icon
            return (
              <Card key={index} className="bg-slate-800/50 border-slate-600 hover:border-blue-500 transition-colors">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-blue-400" />
                    {area.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400">{area.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {area.topics.map((topic, topicIndex) => (
                      <Badge key={topicIndex} variant="outline" className="border-slate-600 text-slate-300">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* How We Work Together */}
      <section className="mb-16">
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-100 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-400" />
              How We Work Together
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-100 mb-3">Session Format</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    45-60 minute video calls
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Goal-oriented with clear outcomes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Practical frameworks & strategies
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Follow-up support between sessions
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 mb-3">Environment</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Confidential and judgment-free
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Actionable advice over theory
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Real-world experience sharing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Customized to your situation
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Ideal Mentee Profile */}
      <section className="mb-16">
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-100">Who I Work Best With</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-100 mb-3">Career Stage</h4>
                <ul className="space-y-2">
                  <li>• Mid-level to senior developers moving into leadership</li>
                  <li>• New technical managers (0-2 years in leadership)</li>
                  <li>• Aspiring CTOs/VP Engineering preparing for executive roles</li>
                  <li>• Career changers transitioning into tech leadership</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 mb-3">Requirements</h4>
                <ul className="space-y-2">
                  <li>• Located in North American time zones</li>
                  <li>• Committed to growth and change</li>
                  <li>• Open to feedback and new approaches</li>
                  <li>• Ready to invest time in development</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Investment */}
      <section className="mb-16">
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-100 flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-400" />
              Mentoring Investment
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-100 mb-3">Getting Started</h4>
                <ul className="space-y-2">
                  <li>• Free 30-minute initial consultation</li>
                  <li>• Assess mutual fit and goals</li>
                  <li>• Discuss your specific challenges</li>
                  <li>• Outline potential mentoring plan</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 mb-3">Ongoing Support</h4>
                <ul className="space-y-2">
                  <li>• Monthly packages with flexible frequency</li>
                  <li>• Email support between sessions included</li>
                  <li>• Scheduling within North American hours</li>
                  <li>• Resources and frameworks provided</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-100">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-6">
            <div>
              <h4 className="font-semibold text-slate-100 mb-2">How long does mentoring typically last?</h4>
              <p>
                Most mentoring relationships span 6-12 months, depending on your goals and progress. We'll assess and
                adjust as needed.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 mb-2">What if I'm not in North America?</h4>
              <p>
                I focus on North American time zones for optimal scheduling. For international mentoring, I recommend
                checking out platforms like MentorCruise or ADPList.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 mb-2">How do you measure success?</h4>
              <p>
                We'll set clear, measurable goals at the start - whether that's a promotion, improved team performance, or
                specific leadership skills development.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 mb-2">What's your mentoring philosophy?</h4>
              <p>
                I believe in practical, actionable guidance over theoretical advice. Every session should leave you with
                concrete next steps and frameworks you can immediately apply.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Resources */}
      <section>
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-100">Recommended Resources</CardTitle>
            <CardDescription className="text-slate-400">
              Books and frameworks I frequently reference in mentoring sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="text-slate-300">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-100 mb-3">Essential Reading</h4>
                <ul className="space-y-1">
                  <li>• "The Manager's Path" by Camille Fournier</li>
                  <li>• "Radical Candor" by Kim Scott</li>
                  <li>• "The First 90 Days" by Michael Watkins</li>
                  <li>• "Staff Engineer" by Will Larson</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 mb-3">Frameworks & Tools</h4>
                <ul className="space-y-1">
                  <li>• RACI matrices for decision clarity</li>
                  <li>• OKRs for goal setting</li>
                  <li>• 1:1 meeting structures</li>
                  <li>• Technical decision records</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
