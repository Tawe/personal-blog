import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Code, Users, Lightbulb, Target, BookOpen, Dice6 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-tech-pattern opacity-30"></div>
      <div className="relative">
        <SiteHeader />

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold text-slate-100 leading-tight">John Munn</h1>
                <p className="text-xl lg:text-2xl text-blue-400 font-medium">
                  Technical Leader | Engineering Strategist | Team Builder | Dungeon Master
                </p>
                <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                  I architect scalable solutions and lead high-performing teams, applying the same strategic
                  storytelling I use as a Dungeon Master. Ready to guide organizations through complex challenges with
                  analytical precision and creative problem-solving.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link href="#featured-content">
                    Explore My Work
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  asChild
                >
                  <Link href="/mentoring">Schedule Mentoring</Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end animate-slide-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-20 scale-110"></div>
                <Image
                  src="/me.jpeg"
                  width={400}
                  height={400}
                  alt="John Munn - Professional Headshot"
                  className="relative rounded-full border-4 border-slate-700 shadow-2xl object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Content Overview */}
        <section id="featured-content" className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-100 mb-4">Areas of Expertise</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Explore my insights across technical leadership, strategic thinking, and innovative problem-solving
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-6 w-6 text-blue-400" />
                  <CardTitle className="text-slate-100 group-hover:text-blue-400 transition-colors">Vision</CardTitle>
                </div>
                <CardDescription className="text-slate-400">
                  Strategic technology roadmaps and organizational transformation insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                  <Link href="/vision">
                    Explore Vision <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Code className="h-6 w-6 text-blue-400" />
                  <CardTitle className="text-slate-100 group-hover:text-blue-400 transition-colors">
                    Technical Strategy
                  </CardTitle>
                </div>
                <CardDescription className="text-slate-400">
                  Architecture decisions, technology choices, and engineering excellence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                  <Link href="/technical-strategy">
                    View Strategy <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-6 w-6 text-blue-400" />
                  <CardTitle className="text-slate-100 group-hover:text-blue-400 transition-colors">
                    Leadership & Strategy
                  </CardTitle>
                </div>
                <CardDescription className="text-slate-400">
                  Team building, culture development, and leadership philosophy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                  <Link href="/strategic-narratives/leadership-strategy">
                    Read Insights <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                  <CardTitle className="text-slate-100 group-hover:text-blue-400 transition-colors">
                    Technical Architecture
                  </CardTitle>
                </div>
                <CardDescription className="text-slate-400">
                  Deep dives into technology, architecture patterns, and best practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                  <Link href="/strategic-narratives/technical-architecture">
                    Read Articles <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb className="h-6 w-6 text-blue-400" />
                  <CardTitle className="text-slate-100 group-hover:text-blue-400 transition-colors">
                    Team Building
                  </CardTitle>
                </div>
                <CardDescription className="text-slate-400">
                  Innovative approaches to team development and collaboration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                  <Link href="/team-building">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Dice6 className="h-6 w-6 text-blue-400" />
                  <CardTitle className="text-slate-100 group-hover:text-blue-400 transition-colors">
                    Strategic Narratives
                  </CardTitle>
                </div>
                <CardDescription className="text-slate-400">
                  Creative storytelling and strategic thinking insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0" asChild>
                  <Link href="/strategic-narratives">
                    Explore Worlds <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent Content Preview */}
        <section className="container mx-auto px-6 py-20 bg-slate-900/30">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-100 mb-4">Latest Insights</h2>
            <p className="text-xl text-slate-400">Recent thoughts on technology, leadership, and innovation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample recent articles - these would be dynamically loaded from markdown */}
            <Card className="bg-slate-800/50 border-slate-600 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader>
                <div className="text-sm text-blue-400 mb-2">Technical Strategy • 5 min read</div>
                <CardTitle className="text-slate-100 text-xl leading-tight">
                  Building Resilient Microservices Architecture
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Key principles for designing fault-tolerant distributed systems that scale with your organization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">March 15, 2024</span>
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300" asChild>
                    <Link href="/strategic-narratives/technical-architecture/resilient-microservices">Read More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-600 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader>
                <div className="text-sm text-blue-400 mb-2">Leadership • 7 min read</div>
                <CardTitle className="text-slate-100 text-xl leading-tight">
                  The Art of Technical Decision Making
                </CardTitle>
                <CardDescription className="text-slate-400">
                  How to balance technical debt, innovation, and business objectives in complex engineering decisions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">March 10, 2024</span>
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300" asChild>
                    <Link href="/strategic-narratives/leadership-strategy/technical-decision-making">Read More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-600 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader>
                <div className="text-sm text-blue-400 mb-2">D&D Musings • 4 min read</div>
                <CardTitle className="text-slate-100 text-xl leading-tight">
                  Lessons from the Dungeon Master's Chair
                </CardTitle>
                <CardDescription className="text-slate-400">
                  How running D&D campaigns has made me a better technical leader and strategic thinker.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">March 5, 2024</span>
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300" asChild>
                    <Link href="/strategic-narratives">Read More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  )
}
