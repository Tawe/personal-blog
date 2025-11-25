import { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Users, GraduationCap, ArrowRight, CheckCircle, Dice6, Target, Lightbulb, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "Services - Technical Leadership & Team Development",
  description: "D&D Team Building for technical organizations and Technical Leadership Mentoring. Transform your teams and accelerate your leadership journey.",
  openGraph: {
    title: "Services - Technical Leadership & Team Development | John Munn",
    description: "D&D Team Building for technical organizations and Technical Leadership Mentoring.",
    url: "https://johnmunn.tech/services",
    siteName: "John Munn - Technical Leader",
    images: [
      {
        url: "/me.jpeg",
        width: 1200,
        height: 630,
        alt: "John Munn - Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services - Technical Leadership & Team Development | John Munn",
    description: "D&D Team Building and Technical Leadership Mentoring.",
    images: ["/me.jpeg"],
  },
  alternates: {
    canonical: "https://johnmunn.tech/services",
  },
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
      <div className="relative">
        <SiteHeader />
        <main className="container mx-auto px-6 py-12">
          {/* Hero Section */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 mb-4">
                    Services
                  </h1>
                  <p className="text-xl text-blue-400 font-semibold">
                    Building stronger teams and accelerating leadership growth
                  </p>
                  <p className="max-w-[900px] text-slate-300 md:text-xl leading-relaxed">
                    I offer two core services designed to help technical organizations and leaders reach their full potential: 
                    innovative D&D-based team building and personalized technical leadership mentoring.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Services Overview */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="max-w-6xl mx-auto">
              <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
              {/* Team Building Service */}
              <Card className="bg-slate-800/50 border-slate-600 hover:border-blue-500 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-blue-600/20 rounded-lg">
                      <Dice6 className="h-8 w-8 text-blue-400" />
                    </div>
                    <CardTitle className="text-2xl text-slate-100">D&D Team Building</CardTitle>
                  </div>
                  <CardDescription className="text-slate-400 text-lg">
                    Transform your technical team's collaboration through strategic D&D team building sessions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    The best technical teams operate like well-coordinated adventuring parties. D&D reveals and strengthens 
                    team dynamics in ways traditional team building can't replicate.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Complex problem-solving under pressure</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Communication and collaboration patterns</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Role specialization and team dynamics</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Trust building through shared challenges</span>
                    </div>
                  </div>
                  <div className="pt-4 flex flex-col gap-2">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href="/services/team-building">
                        Learn More About Team Building
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800" asChild>
                      <Link href="/contact">Schedule Consultation</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Mentoring Service */}
              <Card className="bg-slate-800/50 border-slate-600 hover:border-blue-500 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-green-600/20 rounded-lg">
                      <GraduationCap className="h-8 w-8 text-green-400" />
                    </div>
                    <CardTitle className="text-2xl text-slate-100">Technical Leadership Mentoring</CardTitle>
                  </div>
                  <CardDescription className="text-slate-400 text-lg">
                    Accelerate your leadership journey with personalized guidance and proven frameworks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Practical, actionable guidance for technical leaders at every stage - from IC to management, 
                    from manager to executive.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Career transition into leadership</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Technical strategy & decision making</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Team building & management</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">CTO/VP Engineering preparation</span>
                    </div>
                  </div>
                  <div className="pt-4 flex flex-col gap-2">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                      <Link href="/services/mentoring">
                        Learn More About Mentoring
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800" asChild>
                      <Link href="/contact">Schedule Consultation</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

          {/* Why These Services */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-slate-100 md:text-4xl">Why These Services Matter</h2>
                  <p className="max-w-[900px] text-slate-300 md:text-xl">
                    Both services are built on the same foundation: practical experience, proven frameworks, and a commitment to real results
                  </p>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                <Card className="text-center bg-slate-800/50 border-slate-600">
                  <CardHeader>
                    <div className="flex justify-center mb-2">
                      <Target className="h-8 w-8 text-blue-400" />
                    </div>
                    <CardTitle className="text-slate-100">Practical & Actionable</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300">
                      Real-world frameworks you can apply immediately, not theoretical advice that sits on a shelf
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center bg-slate-800/50 border-slate-600">
                  <CardHeader>
                    <div className="flex justify-center mb-2">
                      <Lightbulb className="h-8 w-8 text-blue-400" />
                    </div>
                    <CardTitle className="text-slate-100">Innovative Approaches</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300">
                      Creative problem-solving that combines technical expertise with storytelling and gaming principles
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center bg-slate-800/50 border-slate-600">
                  <CardHeader>
                    <div className="flex justify-center mb-2">
                      <MessageSquare className="h-8 w-8 text-blue-400" />
                    </div>
                    <CardTitle className="text-slate-100">Results-Focused</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300">
                      Every session delivers measurable outcomes - improved communication, better decisions, stronger teams
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-slate-100 md:text-4xl">Ready to Get Started?</h2>
                  <p className="max-w-[900px] text-slate-300 md:text-xl">
                    Whether you're looking to strengthen your team or accelerate your leadership journey, let's discuss how these services can help
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/contact">Schedule Consultation</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800" asChild>
                    <Link href="/strategic-narratives">Explore My Work</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}

