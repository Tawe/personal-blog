"use client"

import { ContentLayout } from "@/components/content-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, Target, TrendingUp, Lightbulb, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LeadershipStrategyPage() {
  const strategicPrinciples = [
    {
      title: "Vision-Driven Leadership",
      description: "Establishing clear, compelling visions that align teams and drive organizational success.",
      icon: Target,
      keyPoints: [
        "Articulating inspiring future states",
        "Connecting daily work to larger purpose",
        "Building consensus around strategic direction",
        "Communicating vision across all levels",
      ],
    },
    {
      title: "Adaptive Strategy Formation",
      description:
        "Developing flexible strategies that can evolve with changing market conditions and organizational needs.",
      icon: TrendingUp,
      keyPoints: [
        "Continuous environmental scanning",
        "Scenario planning and contingency strategies",
        "Rapid iteration and learning cycles",
        "Balancing stability with agility",
      ],
    },
    {
      title: "People-Centric Execution",
      description:
        "Ensuring that strategic initiatives are grounded in understanding and developing human capabilities.",
      icon: Users,
      keyPoints: [
        "Capability assessment and development",
        "Change management and adoption",
        "Cultural alignment with strategy",
        "Leadership development at all levels",
      ],
    },
    {
      title: "Innovation Integration",
      description: "Embedding innovation thinking into strategic planning and execution processes.",
      icon: Lightbulb,
      keyPoints: [
        "Creating space for experimentation",
        "Balancing core business with innovation",
        "Building innovation capabilities",
        "Managing innovation portfolios",
      ],
    },
  ]

  const implementationFramework = [
    {
      phase: "Assessment & Alignment",
      description: "Understanding current state and aligning leadership on strategic direction",
      activities: [
        "Leadership alignment sessions",
        "Organizational capability assessment",
        "Market and competitive analysis",
        "Stakeholder mapping and engagement",
      ],
    },
    {
      phase: "Strategy Development",
      description: "Collaborative development of strategic direction and key initiatives",
      activities: [
        "Vision and mission refinement",
        "Strategic objective setting",
        "Initiative prioritization",
        "Resource allocation planning",
      ],
    },
    {
      phase: "Execution Planning",
      description: "Detailed planning for strategy implementation and change management",
      activities: [
        "Implementation roadmap creation",
        "Change management strategy",
        "Communication planning",
        "Success metrics definition",
      ],
    },
    {
      phase: "Implementation & Iteration",
      description: "Executing strategy while maintaining flexibility for adaptation",
      activities: [
        "Regular progress reviews",
        "Adaptive planning cycles",
        "Continuous stakeholder engagement",
        "Learning integration and strategy refinement",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="relative">
        <ContentLayout
          title="Leadership Strategy"
          description="Strategic approaches to leadership development and organizational transformation"
        >
          <div className="max-w-6xl mx-auto">
            {/* Navigation */}
            <div className="mb-8">
              <Button variant="ghost" className="text-slate-400 hover:text-slate-200" asChild>
                <Link href="/strategic-narratives">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Strategic Narratives
                </Link>
              </Button>
            </div>

            {/* Introduction */}
            <div className="mb-12 text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-xl"></div>
                <Target className="relative h-12 w-12 text-blue-400 mx-auto" />
              </div>
              <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto mb-8">
                Leadership strategy bridges the gap between visionary thinking and practical execution. It encompasses
                the frameworks, approaches, and methodologies that enable leaders to guide organizations through
                complexity while building sustainable competitive advantages.
              </p>
              <div className="flex justify-center gap-4 text-sm text-slate-400">
                <Badge variant="secondary" className="bg-blue-900/30 text-blue-300">
                  Strategic Planning
                </Badge>
                <Badge variant="secondary" className="bg-purple-900/30 text-purple-300">
                  Leadership Development
                </Badge>
                <Badge variant="secondary" className="bg-green-900/30 text-green-300">
                  Organizational Change
                </Badge>
              </div>
            </div>

            {/* Strategic Principles */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-100 mb-8 text-center">Core Strategic Principles</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {strategicPrinciples.map((principle, index) => (
                  <Card
                    key={index}
                    className="bg-gradient-to-br from-slate-800/50 to-blue-900/20 border-slate-600 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-3">
                        <principle.icon className="h-8 w-8 text-blue-400" />
                        <CardTitle className="text-xl text-slate-100">{principle.title}</CardTitle>
                      </div>
                      <p className="text-slate-300">{principle.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {principle.keyPoints.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start gap-2 text-slate-400">
                            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Implementation Framework */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-100 mb-8 text-center">Implementation Framework</h2>
              <div className="space-y-6">
                {implementationFramework.map((phase, index) => (
                  <Card
                    key={index}
                    className="bg-gradient-to-r from-slate-800/30 to-blue-900/20 border-slate-600 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-slate-100 mb-2">{phase.phase}</h3>
                          <p className="text-slate-300 mb-4">{phase.description}</p>
                          <div className="grid md:grid-cols-2 gap-2">
                            {phase.activities.map((activity, activityIndex) => (
                              <div key={activityIndex} className="flex items-center gap-2 text-slate-400">
                                <ArrowRight className="h-3 w-3 text-blue-400" />
                                <span className="text-sm">{activity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Key Outcomes */}
            <div className="mb-16">
              <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-slate-600">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-slate-100 mb-4">Expected Outcomes</h3>
                  <p className="text-slate-300 mb-6 max-w-3xl mx-auto">
                    Effective leadership strategy implementation typically results in improved organizational alignment,
                    enhanced decision-making capabilities, increased adaptability to change, and stronger competitive
                    positioning in the market.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">85%</div>
                      <div className="text-slate-300 text-sm">Improved Strategic Alignment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">70%</div>
                      <div className="text-slate-300 text-sm">Faster Decision Making</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">60%</div>
                      <div className="text-slate-300 text-sm">Enhanced Adaptability</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-8 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold text-slate-100 mb-4">Ready to Develop Your Leadership Strategy?</h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Let's work together to create a comprehensive leadership strategy that aligns with your organizational
                goals and drives sustainable growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/contact">
                    <Target className="mr-2 h-4 w-4" />
                    Discuss Your Strategy
                  </Link>
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800" asChild>
                  <Link href="/leadership-insights">
                    <Users className="mr-2 h-4 w-4" />
                    Explore Leadership Insights
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
