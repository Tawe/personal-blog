import { ContentLayout } from "@/components/content-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Lightbulb, TrendingUp, MessageSquare, Clock, MapPin, CheckCircle, Star } from "lucide-react"

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
  ]

  const successStories = [
    {
      title: "Senior Dev → Engineering Manager",
      description: "Guided transition from individual contributor to leading a team of 8 developers",
      outcome: "Successful promotion within 6 months",
    },
    {
      title: "CTO Promotion Success",
      description: "Prepared VP Engineering for CTO role at growing startup",
      outcome: "Promoted to CTO within 18 months",
    },
    {
      title: "Team Communication Breakthrough",
      description: "Improved team dynamics and reduced turnover from 40% to 10%",
      outcome: "Sustained high-performance culture",
    },
  ]

  return (
    <ContentLayout
      title="Technical Leadership Mentoring"
      description="Accelerating careers in technology leadership through practical guidance and proven frameworks"
    >
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
              results—not theoretical advice that sits on a shelf.
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
      <section className="mb-16">
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

      {/* Success Stories */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-slate-100 mb-8 text-center">Success Stories</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-lg text-slate-100">{story.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                <p className="mb-4">{story.description}</p>
                <Badge className="bg-green-600/20 text-green-300">{story.outcome}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
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
                We'll set clear, measurable goals at the start—whether that's a promotion, improved team performance, or
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
    </ContentLayout>
  )
}
