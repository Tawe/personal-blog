import { Metadata } from "next"
import { ContentLayout } from "@/components/content-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { GraduationCap, ArrowRight, CheckCircle, Dice6, Target, Lightbulb, MessageSquare } from "lucide-react"

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
        <ContentLayout
          title="Services"
          description="Building stronger teams and accelerating leadership growth"
        >
          <div className="max-w-6xl mx-auto">
            {/* Introduction */}
            <div className="mb-16 text-center">
              <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto">
                I offer two core services designed to help technical organizations and leaders reach their full potential: 
                innovative D&D-based team building and personalized technical leadership mentoring.
              </p>
            </div>

            {/* Services Overview */}
            <div className="mb-16">
              <div className="grid gap-8 md:grid-cols-2">
              {/* Team Building Service */}
              <Card className="bg-slate-800/50 border-slate-600 hover:border-blue-500 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-blue-600/20 rounded-lg">
                      <Dice6 className="h-8 w-8 text-blue-400" />
                    </div>
                    <CardTitle className="text-slate-100 text-xl">D&D Team Building</CardTitle>
                  </div>
                  <CardDescription className="text-slate-400 leading-relaxed">
                    Transform your technical team's collaboration through strategic D&D team building sessions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    The best technical teams operate like well-coordinated adventuring parties. D&D reveals and strengthens 
                    team dynamics in ways traditional team building can't replicate.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-slate-300 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      Complex problem-solving under pressure
                    </div>
                    <div className="text-sm text-slate-300 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      Communication and collaboration patterns
                    </div>
                    <div className="text-sm text-slate-300 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      Role specialization and team dynamics
                    </div>
                    <div className="text-sm text-slate-300 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      Trust building through shared challenges
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
                    <CardTitle className="text-slate-100 text-xl">Technical Leadership Mentoring</CardTitle>
                  </div>
                  <CardDescription className="text-slate-400 leading-relaxed">
                    Accelerate your leadership journey with personalized guidance and proven frameworks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Practical, actionable guidance for technical leaders at every stage - from IC to management, 
                    from manager to executive.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-slate-300 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                      Career transition into leadership
                    </div>
                    <div className="text-sm text-slate-300 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                      Technical strategy & decision making
                    </div>
                    <div className="text-sm text-slate-300 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                      Team building & management
                    </div>
                    <div className="text-sm text-slate-300 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                      CTO/VP Engineering preparation
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

            {/* Why These Services */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-100 mb-4">Why These Services Matter</h2>
                <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto">
                  Both services are built on the same foundation: practical experience, proven frameworks, and a commitment to real results
                </p>
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

            {/* Call to Action */}
            <div className="mt-16 text-center">
              <Card className="bg-slate-900/30 border-slate-700">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-100 mb-4">Ready to Get Started?</h3>
                  <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
                    Whether you're looking to strengthen your team or accelerate your leadership journey, let's discuss how these services can help
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href="/contact">Schedule Consultation</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="border-slate-600 text-slate-300" asChild>
                      <Link href="/strategic-narratives">Explore My Work</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}

