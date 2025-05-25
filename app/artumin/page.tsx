"use client"

import { useState } from "react"
import { ContentLayout } from "@/components/content-layout"
import { ArtumiContentCard } from "@/components/artumi-content-card"
import { ArtumiContentFilter } from "@/components/artumi-content-filter"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Map, Scroll, Users, Crown, Sparkles, Clock } from "lucide-react"
import Link from "next/link"
import type { ArtumiContentMetadata } from "@/lib/artumi-content"

// Sample Artumin content data - in production, this would come from getAllArtumiContent()
const sampleContent: ArtumiContentMetadata[] = [
  {
    slug: "crystal-spires-valdris",
    title: "The Crystal Spires of Valdris",
    date: "2024-01-15",
    type: "location",
    excerpt:
      "High in the northern mountains, the ancient Crystal Spires hold secrets of forgotten magic and lost civilizations. These towering formations pulse with ethereal light, visible from leagues away on clear nights.",
    categories: ["locations", "magic", "ancient-history"],
    region: "Northern Kingdoms",
    featured_image: "/placeholder.svg?height=300&width=500&query=crystal spires mountain fantasy",
    status: "complete",
    connections: ["archmage-theron", "the-last-crystal"],
    reading_time: 8,
  },
  {
    slug: "archmage-theron",
    title: "Archmage Theron Brightward",
    date: "2024-01-12",
    type: "character",
    excerpt:
      "The last keeper of the old ways, Theron has spent centuries studying the mysteries of the Crystal Spires. His weathered hands still crackle with power, though the weight of knowledge has bent his shoulders.",
    categories: ["characters", "magic", "ancient-history"],
    region: "Northern Kingdoms",
    featured_image: "/placeholder.svg?height=300&width=500&query=old wizard archmage fantasy portrait",
    status: "complete",
    connections: ["crystal-spires-valdris", "the-last-crystal"],
    reading_time: 6,
  },
  {
    slug: "the-last-crystal",
    title: "The Last Crystal",
    date: "2024-01-08",
    type: "story",
    excerpt:
      "When the final crystal begins to dim, Theron must choose between preserving ancient knowledge and saving the kingdom. A tale of sacrifice, wisdom, and the price of power.",
    categories: ["stories", "magic", "adventure"],
    region: "Northern Kingdoms",
    featured_image: "/placeholder.svg?height=300&width=500&query=glowing crystal fantasy magic",
    status: "complete",
    connections: ["archmage-theron", "crystal-spires-valdris"],
    reading_time: 15,
  },
  {
    slug: "shadowmere-trading-company",
    title: "The Shadowmere Trading Company",
    date: "2024-01-05",
    type: "organization",
    excerpt:
      "More than merchants, the Shadowmere Company controls trade routes across three kingdoms. Their black ships are welcome in every port, but their true cargo remains a mystery.",
    categories: ["organizations", "politics", "mystery"],
    region: "Coastal Realms",
    featured_image: "/placeholder.svg?height=300&width=500&query=merchant ships fantasy trading",
    status: "complete",
    connections: ["port-of-whispers", "captain-morwyn"],
    reading_time: 10,
  },
  {
    slug: "port-of-whispers",
    title: "Port of Whispers",
    date: "2024-01-02",
    type: "location",
    excerpt:
      "Where secrets are traded like coin and information flows like wine. This bustling port city serves as the unofficial capital of the Coastal Realms, where every conversation might change the fate of kingdoms.",
    categories: ["locations", "politics", "intrigue"],
    region: "Coastal Realms",
    featured_image: "/placeholder.svg?height=300&width=500&query=fantasy port city harbor",
    status: "complete",
    connections: ["shadowmere-trading-company", "captain-morwyn"],
    reading_time: 12,
  },
  {
    slug: "the-sundering-war",
    title: "The Sundering War",
    date: "2023-12-28",
    type: "history",
    excerpt:
      "The great conflict that shattered the unified empire and created the current kingdoms. Understanding this war is key to understanding the political tensions that still shape Artumin today.",
    categories: ["history", "politics", "war"],
    region: "All Regions",
    featured_image: "/placeholder.svg?height=300&width=500&query=fantasy battlefield war ancient",
    status: "complete",
    connections: ["northern-kingdoms", "coastal-realms", "eastern-dominion"],
    reading_time: 20,
  },
  {
    slug: "magic-system-overview",
    title: "The Weave of Magic",
    date: "2023-12-25",
    type: "lore",
    excerpt:
      "Magic in Artumin flows through ancient ley lines that connect sacred sites across the world. Understanding the Weave is essential to comprehending how power works in this realm.",
    categories: ["lore", "magic", "worldbuilding"],
    region: "All Regions",
    featured_image: "/placeholder.svg?height=300&width=500&query=magical energy ley lines fantasy",
    status: "complete",
    connections: ["crystal-spires-valdris", "archmage-theron"],
    reading_time: 14,
  },
  {
    slug: "the-eastern-dominion",
    title: "The Eastern Dominion",
    date: "2023-12-20",
    type: "location",
    excerpt:
      "A vast empire built on discipline, honor, and martial prowess. The Dominion's warrior-philosophers seek to bring order to a chaotic world through strength and wisdom.",
    categories: ["locations", "politics", "culture"],
    region: "Eastern Dominion",
    featured_image: "/placeholder.svg?height=300&width=500&query=eastern empire fantasy architecture",
    status: "in-progress",
    connections: ["the-sundering-war"],
    reading_time: 16,
  },
]

const allCategories = Array.from(new Set(sampleContent.flatMap((content) => content.categories))).sort()
const allTypes = Array.from(new Set(sampleContent.map((content) => content.type))).sort()
const allRegions = Array.from(new Set(sampleContent.map((content) => content.region))).sort()
const allStatuses = Array.from(new Set(sampleContent.map((content) => content.status))).sort()

export default function ArtumiPage() {
  const [filteredContent, setFilteredContent] = useState<ArtumiContentMetadata[]>(sampleContent)
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid")

  const timelineContent = [...filteredContent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="relative">
        <ContentLayout
          title="The World of Artumin"
          description="Epic tales, rich lore, and immersive worldbuilding from a realm where magic and politics intertwine"
        >
          <div className="max-w-7xl mx-auto">
            {/* Introduction */}
            <div className="mb-12 text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl"></div>
                <Sparkles className="relative h-12 w-12 text-purple-400 mx-auto" />
              </div>
              <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto mb-8">
                Artumin is a world where ancient magic flows through crystalline spires, where merchant princes wield
                influence across kingdoms, and where the echoes of a great war still shape the political landscape.
                These stories explore themes of power, responsibility, and the delicate balance between order and chaos.
              </p>
              <div className="flex justify-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Scroll className="h-4 w-4" />
                  <span>{sampleContent.filter((c) => c.type === "story").length} Stories</span>
                </div>
                <div className="flex items-center gap-1">
                  <Map className="h-4 w-4" />
                  <span>{sampleContent.filter((c) => c.type === "location").length} Locations</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{sampleContent.filter((c) => c.type === "character").length} Characters</span>
                </div>
              </div>
            </div>

            {/* World Regions Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-gradient-to-br from-blue-900/20 to-slate-800/30 border-slate-600 hover:border-blue-500/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Crown className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Northern Kingdoms</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Ancient magic flows through crystal spires in these mountainous realms, where old traditions clash
                    with new ambitions.
                  </p>
                  <div className="text-xs text-blue-400">
                    {sampleContent.filter((c) => c.region === "Northern Kingdoms").length} entries
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-teal-900/20 to-slate-800/30 border-slate-600 hover:border-teal-500/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Map className="h-8 w-8 text-teal-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Coastal Realms</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Trading ports and merchant cities where information is currency and every harbor holds secrets.
                  </p>
                  <div className="text-xs text-teal-400">
                    {sampleContent.filter((c) => c.region === "Coastal Realms").length} entries
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-900/20 to-slate-800/30 border-slate-600 hover:border-orange-500/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-8 w-8 text-orange-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Eastern Dominion</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    A disciplined empire where warrior-philosophers seek to bring order through strength and wisdom.
                  </p>
                  <div className="text-xs text-orange-400">
                    {sampleContent.filter((c) => c.region === "Eastern Dominion").length} entries
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* View Mode Toggle */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-100">Explore Artumin</h2>
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "timeline")}>
                <TabsList className="bg-slate-800/50 border-slate-600">
                  <TabsTrigger value="grid" className="flex items-center gap-2">
                    <Map className="h-4 w-4" />
                    Grid View
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Timeline
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Content Filter */}
            <ArtumiContentFilter
              content={sampleContent}
              allCategories={allCategories}
              allTypes={allTypes}
              allRegions={allRegions}
              allStatuses={allStatuses}
              onFilterChange={setFilteredContent}
            />

            {/* Content Display */}
            <Tabs value={viewMode} className="w-full">
              <TabsContent value="grid">
                {filteredContent.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredContent.map((content) => (
                      <ArtumiContentCard key={content.slug} content={content} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sparkles className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">No content found</h3>
                    <p className="text-slate-400">Try adjusting your filters to discover more of Artumin's secrets.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="timeline">
                <div className="space-y-8">
                  {timelineContent.map((content, index) => (
                    <div key={content.slug} className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-slate-800"></div>
                        {index < timelineContent.length - 1 && (
                          <div className="w-0.5 h-16 bg-gradient-to-b from-purple-500 to-slate-600 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="text-sm text-purple-400 mb-2">
                          {new Date(content.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <ArtumiContentCard content={content} compact />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Call to Action */}
            <div className="mt-16 text-center bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-8 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold text-slate-100 mb-4">Dive Deeper into Artumin</h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                This world continues to grow and evolve. Each story reveals new facets of the realm, new characters to
                meet, and new mysteries to uncover. Join me on this creative journey through a world where every choice
                has consequences and every legend holds truth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-purple-600 hover:bg-purple-700" asChild>
                  <Link href="/artumin/getting-started">
                    <Scroll className="mr-2 h-4 w-4" />
                    Start Reading
                  </Link>
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800" asChild>
                  <Link href="/contact">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Discuss the World
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
