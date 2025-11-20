import { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MessageSquare, Calendar, Eye } from "lucide-react"

export const metadata: Metadata = {
  title: "Vision - Technology Leadership Philosophy",
  description: "My philosophy on technology leadership and the future of engineering organizations. The future belongs to technology leaders who tell better stories.",
  openGraph: {
    title: "Vision - Technology Leadership Philosophy | John Munn",
    description: "My philosophy on technology leadership and the future of engineering organizations.",
    url: "https://johnmunn.tech/vision",
    siteName: "John Munn - Technical Leader",
    images: [
      {
        url: "/me.jpeg",
        width: 1200,
        height: 630,
        alt: "John Munn - Technical Leader",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vision - Technology Leadership Philosophy | John Munn",
    description: "My philosophy on technology leadership and the future of engineering organizations.",
    images: ["/me.jpeg"],
  },
  alternates: {
    canonical: "https://johnmunn.tech/vision",
  },
}

export default function VisionPage() {
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
                    Vision
                  </h1>
                  <p className="text-xl text-primary font-semibold">
                    My philosophy on technology leadership and the future of engineering organizations
                  </p>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    The future belongs to technology leaders who tell better stories. The best leaders don't just architect systems - they architect narratives that align teams, inspire innovation, and transform business possibilities.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="#philosophy">Explore Philosophy</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/contact">Start Conversation</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Image
                    src="/vision.png"
                    width={400}
                    height={400}
                    alt="John Munn - Technology Leadership Vision"
                    className="rounded-xl object-cover"
                    priority
                  />
                  <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground p-3 rounded-full">
                    <Eye className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
        {/* Opening Hook */}
        <div className="mb-12 p-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-slate-700">
          <h2 className="text-3xl font-bold text-slate-100 mb-4 leading-tight">
            The Future Belongs to Technology Leaders Who Tell Better Stories
          </h2>
          <p className="text-xl text-slate-300 leading-relaxed">
            The best Leaders don't just architect systems - they architect narratives that align teams, inspire innovation,
            and transform business possibilities. In an era where technology drives every competitive advantage, the
            most successful organizations will be led by technical leaders who can weave together complex technical
            realities with compelling business visions.
          </p>
        </div>

        {/* Technology Philosophy */}
        <section id="philosophy" className="mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-slate-700 pb-4">
            Technology Philosophy: Building for Tomorrow, Delivering Today
          </h2>
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>
              Technology should be an enabler, not an obstacle. My approach centers on{" "}
              <strong className="text-blue-400">pragmatic innovation</strong> - making bold architectural decisions that
              serve long-term vision while delivering immediate business value.
            </p>
            <p>
              I believe in <strong className="text-blue-400">systems thinking at every level</strong>: from code
              architecture to team structure to organizational design. Great technology organizations mirror great
              software systems - they're modular, resilient, and designed for change. Technical debt isn't just a code
              problem; it's an organizational challenge that requires strategic thinking and clear communication to
              address effectively.
            </p>
            <p>
              <strong className="text-blue-400">Scaling isn't just about infrastructure</strong> - it's about building
              systems and teams that can evolve. The architectures I champion are designed for adaptability, with clear
              boundaries that allow teams to innovate independently while maintaining system coherence. Like a
              well-designed D&D campaign, the best technical systems provide structure that enables creativity rather
              than constraining it.
            </p>
          </div>
        </section>

        {/* Leadership Approach */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-slate-700 pb-4">
            Leadership Approach: Empowering Through Clarity
          </h2>
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>
              The most powerful teams are those where every member understands not just what they're building, but why
              it matters. I lead through <strong className="text-blue-400">narrative clarity</strong> - helping teams see
              how their technical work connects to larger business objectives and user outcomes.
            </p>
            <p>My leadership philosophy draws from both engineering principles and storytelling craft:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-blue-400">Psychological safety through structured exploration</strong>: Like a
                good DM, I create environments where teams can take calculated risks and learn from failures
              </li>
              <li>
                <strong className="text-blue-400">Mentorship as force multiplication</strong>: Developing technical
                talent isn't just about code reviews - it's about helping engineers see the strategic implications of
                their decisions
              </li>
              <li>
                <strong className="text-blue-400">Cross-functional translation</strong>: I bridge the gap between
                technical complexity and business value, ensuring stakeholders understand both possibilities and
                constraints
              </li>
            </ul>
            <p>
              I believe in <strong className="text-blue-400">distributed leadership</strong> - building teams where
              technical expertise and decision-making authority align. The best technical organizations are those where
              senior engineers feel empowered to make architectural decisions within clear strategic boundaries.
            </p>
          </div>
        </section>

        {/* Strategic Perspective */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-slate-700 pb-4">
            Strategic Perspective: Technology as Business Accelerator
          </h2>
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>
              Every technical decision is a business decision. My approach to technology strategy starts with deep
              understanding of business objectives, market dynamics, and user needs. I don't just evaluate technologies
              based on technical merit - I assess them based on their ability to accelerate business outcomes.
            </p>
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">My Decision-Making Framework:</h3>
              <ul className="space-y-3">
                <li>
                  <strong className="text-blue-400">Business impact</strong>: How does this technical choice advance our
                  strategic objectives?
                </li>
                <li>
                  <strong className="text-blue-400">Team capability</strong>: Do we have the expertise to execute
                  successfully, or can we develop it?
                </li>
                <li>
                  <strong className="text-blue-400">Market timing</strong>: Are we early enough to gain advantage but
                  not so early that we're building infrastructure the market isn't ready for?
                </li>
                <li>
                  <strong className="text-blue-400">Risk management</strong>: What are the failure modes, and how do we
                  mitigate them?
                </li>
              </ul>
            </div>
            <p>
              I'm particularly excited about the convergence of AI, cloud-native architectures, and developer experience
              tools. These aren't just technical trends - they represent fundamental shifts in how we build and scale
              technology organizations.
            </p>
          </div>
        </section>

        {/* Unique Value Proposition */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-slate-700 pb-4">
            What Makes My Leadership Distinctive
          </h2>
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>
              My background as a Dungeon Master has taught me that the best leaders are those who can{" "}
              <strong className="text-blue-400">hold multiple complex narratives simultaneously</strong> while adapting
              to unexpected developments. Running D&D campaigns requires the same skills that make great Technical Leaders: strategic
              planning, real-time problem-solving, stakeholder management, and the ability to maintain team engagement
              through uncertainty.
            </p>
            <p>This storytelling foundation gives me a unique approach to technical leadership:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-blue-400">Systems thinking through narrative</strong>: I help teams understand
                complex architectures by framing them as interconnected stories
              </li>
              <li>
                <strong className="text-blue-400">Stakeholder alignment through shared vision</strong>: Like creating a
                compelling campaign setting, I build technical strategies that stakeholders can visualize and rally
                behind
              </li>
              <li>
                <strong className="text-blue-400">Adaptive planning</strong>: The best technical roadmaps, like the best
                campaigns, have clear objectives but flexible execution paths
              </li>
            </ul>
            <p>
              I bring <strong className="text-blue-400">analytical precision to creative problem-solving</strong>.
              Whether I'm designing a microservices architecture or crafting a fantasy world, I apply the same rigorous
              thinking to ensure internal consistency, scalability, and user experience.
            </p>
          </div>
        </section>

        {/* Vision for the Future */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-slate-700 pb-4">
            The Organization I Want to Build
          </h2>
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>I envision leading a technology organization that's known for three things:</p>
            <div className="grid md:grid-cols-3 gap-6 my-8">
              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Technical Excellence</h3>
                  <p className="text-slate-300 text-sm">
                    We build systems that are both architecturally sound and strategically valuable
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Innovation Culture</h3>
                  <p className="text-slate-300 text-sm">
                    We explore emerging technologies while maintaining operational excellence
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Team Empowerment</h3>
                  <p className="text-slate-300 text-sm">
                    We develop technical talent that can lead the next generation of technology organizations
                  </p>
                </CardContent>
              </Card>
            </div>
            <p>
              Success, for me, means building teams that can tackle increasingly complex challenges while maintaining
              the agility to adapt to market changes. It means creating technical architectures that become competitive
              advantages, not just operational necessities.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-8 rounded-xl border border-slate-700">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">Let's Build the Future Together</h2>
          <p className="text-slate-300 leading-relaxed mb-6">
            If you're excited about the intersection of technical excellence and strategic thinking - or if you're curious
            about how storytelling principles can enhance technology leadership - I'd love to connect. Whether you're an
            aspiring technical leader looking for mentorship, a business leader seeking to understand how technology can
            accelerate your objectives, or a fellow technologist interested in exploring new approaches to engineering
            leadership, let's start a conversation.
          </p>
          <p className="text-slate-300 leading-relaxed mb-8">
            The future belongs to organizations that can move fast without breaking things, innovate without losing
            focus, and scale without losing their soul. Let's build that future together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/services">
                <Calendar className="mr-2 h-5 w-5" />
                Explore Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800" asChild>
              <Link href="/contact">
                <MessageSquare className="mr-2 h-5 w-5" />
                Start a Conversation
              </Link>
            </Button>
          </div>
        </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
