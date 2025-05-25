import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import {
  Shield,
  Heart,
  Zap,
  Users,
  Eye,
  Target,
  Brain,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Dice6,
} from "lucide-react"

export default function TeamBuildingPage() {
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
                    D&D Team Building for Technical Organizations
                  </h1>
                  <p className="text-xl text-primary font-semibold">
                    Your team is already an adventuring party. Let's help them level up.
                  </p>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    The best technical teams operate like well-coordinated adventuring parties—facing complex challenges
                    together, leveraging individual strengths, and making critical decisions under pressure. D&D reveals
                    and strengthens these natural dynamics in ways traditional team building simply can't replicate.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="#program">Explore the Program</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="#contact">Schedule Consultation</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=400&width=400&text=Technical+Team+Adventure"
                    width={400}
                    height={400}
                    alt="Technical Team Adventure"
                    className="rounded-xl object-cover"
                    priority
                  />
                  <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground p-3 rounded-full">
                    <Dice6 className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why D&D Works for Technical Teams</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  D&D offers unique benefits that traditional team building can't replicate, perfectly suited for
                  technical professionals
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card className="text-center">
                <CardHeader className="pb-2">
                  <div className="flex justify-center">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-2">Complex Problem-Solving</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Navigate challenges with limited information and time pressure—just like production incidents
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-2">
                  <div className="flex justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-2">Role Specialization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Understand and leverage each team member's unique strengths and working styles
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-2">
                  <div className="flex justify-center">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-2">Communication Under Stress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Practice clear information sharing when stakes are high and time is limited
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-2">
                  <div className="flex justify-center">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-2">Collaborative Decision-Making</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Make group decisions with real consequences, revealing natural leadership patterns
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-2">
                  <div className="flex justify-center">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-2">Creative Problem-Solving</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Think outside the box when standard approaches fail—essential for innovation
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-2">
                  <div className="flex justify-center">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-2">Trust Through Vulnerability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Build genuine trust through shared challenges and authentic team interactions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Parallels */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Your Team is Already an Adventuring Party
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Technical teams naturally align with classic RPG roles—understanding these dynamics improves
                  collaboration
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-6xl gap-6 py-12 lg:grid-cols-5">
              <Card className="text-center">
                <CardHeader className="pb-2">
                  <div className="flex justify-center">
                    <Shield className="h-10 w-10 text-blue-600" />
                  </div>
                  <CardTitle className="mt-2 text-lg">Tank</CardTitle>
                  <CardDescription>DevOps/Infrastructure</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Protects the team, absorbs system problems, maintains stability under pressure
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-2">
                  <div className="flex justify-center">
                    <Heart className="h-10 w-10 text-green-600" />
                  </div>
                  <CardTitle className="mt-2 text-lg">Healer</CardTitle>
                  <CardDescription>QA/Support</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Keeps the team healthy, identifies and fixes problems before they become critical
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-2">
                  <div className="flex justify-center">
                    <Zap className="h-10 w-10 text-red-600" />
                  </div>
                  <CardTitle className="mt-2 text-lg">DPS</CardTitle>
                  <CardDescription>Developers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    High output focused on core objectives, delivers the primary value creation
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-2">
                  <div className="flex justify-center">
                    <Users className="h-10 w-10 text-purple-600" />
                  </div>
                  <CardTitle className="mt-2 text-lg">Support</CardTitle>
                  <CardDescription>Product/Project Management</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Enables others, provides resources, coordinates team efforts and removes blockers
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-2">
                  <div className="flex justify-center">
                    <Eye className="h-10 w-10 text-orange-600" />
                  </div>
                  <CardTitle className="mt-2 text-lg">Scout</CardTitle>
                  <CardDescription>Architects/Lead Engineers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Sees the big picture, plans ahead, identifies risks and opportunities
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Program Structure */}
        <section id="program" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How D&D Team Building Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Structured sessions designed to reveal team dynamics and build stronger collaboration
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl gap-8 py-12 lg:grid-cols-2">
              <div>
                <h3 className="text-2xl font-bold mb-4">Session Format</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <strong>Duration:</strong> Half-day or full-day workshops
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <strong>Group size:</strong> 4-6 participants (optimal team size)
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <strong>Scenarios:</strong> Pre-built adventures designed for team building outcomes
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <strong>Debrief:</strong> Facilitated discussion connecting game events to workplace dynamics
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">Learning Objectives</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <ArrowRight className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <strong>Communication patterns:</strong> How does your team share information?
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <strong>Decision-making styles:</strong> Who leads? Who follows? When?
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <strong>Stress responses:</strong> How do team members react under pressure?
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <strong>Collaboration preferences:</strong> Natural team dynamics and friction points
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <strong>Problem-solving approaches:</strong> Creative vs. systematic thinking
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Applications */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">From Dungeon to Daily Standups</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Concrete examples of how D&D insights translate directly to workplace improvements
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Resource Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    <strong>In D&D:</strong> Managing spell slots and abilities strategically
                  </p>
                  <p className="text-muted-foreground">
                    <strong>At Work:</strong> Sprint capacity planning and technical debt management
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    <strong>In D&D:</strong> Dungeon planning and threat evaluation
                  </p>
                  <p className="text-muted-foreground">
                    <strong>At Work:</strong> Project planning and technical risk mitigation
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Role Clarity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    <strong>In D&D:</strong> Party composition and complementary abilities
                  </p>
                  <p className="text-muted-foreground">
                    <strong>At Work:</strong> Team structure and responsibility definition
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Conflict Resolution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    <strong>In D&D:</strong> Party disputes and decision deadlocks
                  </p>
                  <p className="text-muted-foreground">
                    <strong>At Work:</strong> Team disagreements and technical debates
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Teams That Leveled Up</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Real results from technical teams who embraced D&D team building
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Development Team</Badge>
                  </div>
                  <CardTitle>Sprint Planning Transformation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "After learning resource management in D&D, our team improved sprint planning accuracy by 40%. We
                    now better understand capacity limits and make more realistic commitments."
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Leadership Team</Badge>
                  </div>
                  <CardTitle>Communication Breakthrough</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "Seeing our communication patterns in-game was eye-opening. We identified why certain meetings were
                    ineffective and restructured our decision-making process."
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Cross-Functional Team</Badge>
                  </div>
                  <CardTitle>Trust and Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "The shared problem-solving experience broke down silos between departments. We now collaborate more
                    naturally and trust each other's expertise."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ROI Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why Leadership Invests in This</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Measurable business outcomes that justify the investment in innovative team building
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-4xl gap-6 py-12 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Improved Communication</h3>
                    <p className="text-muted-foreground">Reduces project delays and misunderstandings</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Better Team Cohesion</h3>
                    <p className="text-muted-foreground">Decreases turnover and increases job satisfaction</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Enhanced Problem-Solving</h3>
                    <p className="text-muted-foreground">Better capabilities for complex technical challenges</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Leadership Development</h3>
                    <p className="text-muted-foreground">Natural leaders emerge organically through gameplay</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Stress Management</h3>
                    <p className="text-muted-foreground">Improved skills for high-pressure situations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Innovation Culture</h3>
                    <p className="text-muted-foreground">Creative thinking becomes part of team DNA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                    Ready to Roll for Initiative on Team Building?
                  </h2>
                  <p className="text-muted-foreground md:text-xl">
                    Transform your technical team's collaboration with strategic D&D team building. No gaming experience
                    required—just a willingness to try something innovative.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Customized for Technical Teams</p>
                      <p className="text-sm text-muted-foreground">
                        Scenarios designed specifically for software development and engineering challenges
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Professional Facilitation</p>
                      <p className="text-sm text-muted-foreground">
                        Experienced in both D&D and business team dynamics
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Flexible Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        On-site, virtual, or hybrid sessions to fit your team's needs
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/contact">Schedule Consultation</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/strategic-narratives/game-design-systems">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Ideal Teams for D&D Team Building</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Development Teams</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Engineering Leadership</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Cross-Functional Teams</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Remote Teams</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Newly Formed Teams</Badge>
                    </div>
                    <div className="pt-4">
                      <p className="text-sm text-muted-foreground">
                        Perfect for teams of 4-6 people looking to improve collaboration, communication, and
                        problem-solving capabilities.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
