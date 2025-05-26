import { ContentLayout } from "@/components/content-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dice6, Scroll, Wand2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getAllDndContent, getAllDndTags, getAllDndSystems } from "@/lib/content"
import { DndTtrpgsClient } from "./client"

export default function DndTtrpgsPage() {
  const allArticles = getAllDndContent()
  const allTags = getAllDndTags()
  const allSystems = getAllDndSystems()

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>
      <div className="relative">
        <ContentLayout>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 mb-4">D&D and TTRPGs</h1>
              <p className="text-xl text-slate-400">Creative mechanics, homebrew content, and tabletop innovations</p>
            </div>

            {/* Breadcrumb */}
            <div className="mb-8">
              <Button variant="ghost" className="text-slate-400 hover:text-red-400 p-0" asChild>
                <Link href="/strategic-narratives">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Strategic Narratives
                </Link>
              </Button>
            </div>

            {/* Introduction */}
            <div className="mb-12 text-center">
              <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto">
                Explore my collection of D&D homebrew content, game mechanics, and tabletop RPG creations. From custom
                monsters and magical items to innovative mechanics and character options, these pieces blend creative
                storytelling with balanced gameplay design. Each creation is crafted with both narrative depth and
                mechanical integrity in mind.
              </p>
            </div>

            {/* Key Focus Areas */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Dice6 className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Game Mechanics</h3>
                  <p className="text-slate-400 text-sm">
                    Innovative rules, systems, and mechanics that enhance gameplay and create new possibilities.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Wand2 className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Homebrew Content</h3>
                  <p className="text-slate-400 text-sm">
                    Custom monsters, spells, items, and character options designed for balanced and engaging play.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-6 text-center">
                  <Scroll className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Design Philosophy</h3>
                  <p className="text-slate-400 text-sm">
                    Thoughtful analysis of game design principles and the craft of creating memorable experiences.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Client Component for Interactive Features */}
            <DndTtrpgsClient articles={allArticles} tags={allTags} systems={allSystems} />
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
