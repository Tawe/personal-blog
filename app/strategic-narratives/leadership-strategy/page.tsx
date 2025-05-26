import { ContentLayout } from "@/components/content-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Target, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getAllArticles, getAllTags } from "@/lib/content"
import { LeadershipStrategyClient } from "./client"

export default function LeadershipStrategyPage() {
  const allArticles = getAllArticles()
  const allTags = getAllTags("leadership")

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
      <div className="relative">
        <ContentLayout
          title="Leadership & Strategy"
          description="Insights on building teams, driving innovation, and leading through complexity"
        >
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Button variant="ghost" className="text-slate-400 hover:text-blue-400 p-0" asChild>
                <Link href="/strategic-narratives">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Strategic Narratives
                </Link>
              </Button>
            </div>

            {/* Introduction */}
            <div className="mb-12 text-center">
              <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto">
                Technical leadership is about more than just code and architecture—it's about building teams that can
                tackle complex challenges, fostering innovation while maintaining operational excellence, and
                translating technical possibilities into business outcomes. These insights explore the intersection of
                technology and leadership, drawing from real-world experience building and scaling engineering
                organizations.
              </p>
            </div>

            {/* Key Focus Areas */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Team Building</h3>
                  <p className="text-slate-400 text-sm">
                    Creating high-performing teams through clear communication, psychological safety, and shared vision.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Strategic Thinking</h3>
                  <p className="text-slate-400 text-sm">
                    Aligning technical decisions with business objectives and long-term organizational goals.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-8 w-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Continuous Learning</h3>
                  <p className="text-slate-400 text-sm">
                    Fostering growth mindsets and building learning organizations that adapt to change.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Client Component for Interactive Features */}
            <LeadershipStrategyClient articles={allArticles} tags={allTags} />
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
