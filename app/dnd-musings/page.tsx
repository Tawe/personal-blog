"use client"

import { useState } from "react"
import { ContentLayout } from "@/components/content-layout"
import { DndContentCard } from "@/components/dnd-content-card"
import { DndContentFilter } from "@/components/dnd-content-filter"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dice6, Scroll, Sword, Sparkles, Users, Map, ShoppingCart, Download } from "lucide-react"
import Link from "next/link"
import type { DndContentMetadata } from "@/lib/dnd-content"

// Sample D&D content data - in production, this would come from getAllDndContent()
const sampleContent: DndContentMetadata[] = [
  {
    slug: "shadowmancer-wizard-subclass",
    title: "The Shadowmancer - New Wizard Subclass",
    date: "2024-01-15",
    type: "mechanic",
    excerpt:
      "A wizard subclass focused on shadow manipulation and stealth magic. Harness the power of darkness to confound enemies and protect allies through cunning rather than raw force.",
    system: "5e",
    level_range: "any",
    tags: ["homebrew", "wizard", "shadow", "stealth"],
    featured_image: "/placeholder.svg?height=300&width=500&query=shadow wizard fantasy art",
    availability: "free",
    duration: "10 min read",
    playtested: true,
  },
  {
    slug: "curse-crimson-keep",
    title: "Curse of the Crimson Keep - Adventure Module",
    date: "2024-01-12",
    type: "adventure",
    excerpt:
      "A horror-themed adventure for 4-6 characters of 3rd-5th level. Investigate a mysterious keep where the walls bleed and the dead refuse to stay buried.",
    system: "5e",
    level_range: "3-5",
    tags: ["horror", "dungeon", "mystery", "undead"],
    featured_image: "/placeholder.svg?height=300&width=500&query=gothic castle horror fantasy",
    availability: "commercial",
    price: "$4.99",
    platform: "dmsguild",
    external_url: "https://www.dmsguild.com/product/example",
    rating: "4.8",
    duration: "4-6 hours",
    playtested: true,
  },
  {
    slug: "aberrant-horrors-bestiary",
    title: "Aberrant Horrors - Monster Collection",
    date: "2024-01-08",
    type: "monster",
    excerpt:
      "A collection of 12 unique aberrations designed to challenge and terrify players. Each creature includes tactics, lore, and plot hooks for integration into your campaign.",
    system: "5e",
    level_range: "1-20",
    tags: ["monsters", "aberrations", "horror", "bestiary"],
    featured_image: "/placeholder.svg?height=300&width=500&query=aberrant monster tentacles",
    availability: "free",
    duration: "15 min read",
    playtested: true,
  },
  {
    slug: "resonant-crystals-magic-items",
    title: "Resonant Crystals - Magical Item Set",
    date: "2024-01-05",
    type: "magic-item",
    excerpt:
      "A set of interconnected magical crystals that grow more powerful when used together. Perfect for encouraging teamwork and strategic thinking among players.",
    system: "5e",
    level_range: "5-15",
    tags: ["magic-items", "teamwork", "crystals", "scaling"],
    featured_image: "/placeholder.svg?height=300&width=500&query=magical crystals glowing",
    availability: "free",
    duration: "8 min read",
    playtested: true,
  },
  {
    slug: "captain-blackwater-npc",
    title: "Captain Elara Blackwater - Pirate NPC",
    date: "2024-01-02",
    type: "npc",
    excerpt:
      "A complex pirate captain who can serve as ally, enemy, or morally ambiguous quest-giver. Includes full stat block, personality traits, and adventure hooks.",
    system: "5e",
    level_range: "any",
    tags: ["npc", "pirate", "naval", "morally-gray"],
    featured_image: "/placeholder.svg?height=300&width=500&query=female pirate captain fantasy",
    availability: "free",
    duration: "5 min read",
    playtested: false,
  },
  {
    slug: "social-encounter-mechanics",
    title: "Advanced Social Encounter Mechanics",
    date: "2023-12-28",
    type: "mechanic",
    excerpt:
      "A comprehensive system for running engaging social encounters with clear stakes, meaningful choices, and mechanical weight equal to combat encounters.",
    system: "system-agnostic",
    level_range: "any",
    tags: ["social", "mechanics", "roleplay", "system-agnostic"],
    featured_image: "/placeholder.svg?height=300&width=500&query=medieval court intrigue",
    availability: "premium",
    price: "$2.99",
    platform: "drivethrurpg",
    external_url: "https://www.drivethrurpg.com/product/example",
    rating: "4.6",
    duration: "20 min read",
    playtested: true,
  },
  {
    slug: "dm-burnout-prevention",
    title: "Preventing DM Burnout: A Practical Guide",
    date: "2023-12-25",
    type: "thought-piece",
    excerpt:
      "Strategies for maintaining enthusiasm and creativity as a DM over long campaigns. Based on years of experience running games and talking with other DMs.",
    system: "system-agnostic",
    level_range: "any",
    tags: ["dm-advice", "burnout", "campaign-management"],
    featured_image: "/placeholder.svg?height=300&width=500&query=tired dungeon master books",
    availability: "free",
    duration: "12 min read",
    playtested: false,
  },
  {
    slug: "urban-shadows-campaign-guide",
    title: "Urban Shadows - Campaign Setting Guide",
    date: "2023-12-20",
    type: "adventure",
    excerpt:
      "A complete campaign setting for urban fantasy adventures. Includes districts, NPCs, factions, and a full adventure arc for levels 1-10.",
    system: "5e",
    level_range: "1-10",
    tags: ["campaign-setting", "urban-fantasy", "factions"],
    featured_image: "/placeholder.svg?height=300&width=500&query=dark urban fantasy city",
    availability: "commercial",
    price: "$12.99",
    platform: "dmsguild",
    external_url: "https://www.dmsguild.com/product/example2",
    rating: "4.9",
    duration: "8-12 sessions",
    playtested: true,
  },
]

const allTypes = Array.from(new Set(sampleContent.map((content) => content.type))).sort()
const allSystems = Array.from(new Set(sampleContent.map((content) => content.system))).sort()
const allTags = Array.from(new Set(sampleContent.flatMap((content) => content.tags))).sort()
const allAvailability = Array.from(new Set(sampleContent.map((content) => content.availability))).sort()

export default function DndMusingsPage() {
  const [filteredContent, setFilteredContent] = useState<DndContentMetadata[]>(sampleContent)
  const [viewMode, setViewMode] = useState<"all" | "free" | "commercial">("all")

  const freeContent = filteredContent.filter((content) => content.availability === "free")
  const commercialContent = filteredContent.filter((content) => content.availability !== "free")

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-red-950/20 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.1),transparent_50%)]"></div>
      <div className="relative">
        <ContentLayout title="RPG Musings" description="Custom creations, mechanics, and insights for the tabletop">
          <div className="max-w-7xl mx-auto">
            {/* Introduction */}
            <div className="mb-12 text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-full blur-xl"></div>
                <Dice6 className="relative h-12 w-12 text-red-400 mx-auto" />
              </div>
              <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto mb-8">
                These creations blend mechanical innovation with narrative depth, designed to enhance your tabletop
                experience. From homebrew subclasses to complete campaign settings, each piece is crafted with both game
                balance and storytelling potential in mind. Many have been playtested extensively to ensure they work at
                real tables with real players.
              </p>
              <div className="flex justify-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{sampleContent.filter((c) => c.availability === "free").length} Free Resources</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShoppingCart className="h-4 w-4" />
                  <span>{sampleContent.filter((c) => c.availability !== "free").length} Premium Products</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  <span>{sampleContent.filter((c) => c.playtested).length} Playtested</span>
                </div>
              </div>
            </div>

            {/* Content Categories Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="bg-gradient-to-br from-blue-900/20 to-slate-800/30 border-slate-600 hover:border-blue-500/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Scroll className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Mechanics & Rules</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    New subclasses, spells, and game mechanics designed to expand player options and enhance gameplay.
                  </p>
                  <div className="text-xs text-blue-400">
                    {sampleContent.filter((c) => c.type === "mechanic").length} items
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-900/20 to-slate-800/30 border-slate-600 hover:border-red-500/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Sword className="h-8 w-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Monsters & Items</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Unique creatures and magical items to challenge players and reward creative thinking.
                  </p>
                  <div className="text-xs text-red-400">
                    {sampleContent.filter((c) => c.type === "monster" || c.type === "magic-item").length} items
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/20 to-slate-800/30 border-slate-600 hover:border-green-500/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">NPCs & Characters</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Memorable characters with rich backstories and clear motivations for your campaigns.
                  </p>
                  <div className="text-xs text-green-400">
                    {sampleContent.filter((c) => c.type === "npc").length} characters
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/20 to-slate-800/30 border-slate-600 hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Map className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Adventures & Campaigns</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Complete adventures and campaign settings ready to run at your table.
                  </p>
                  <div className="text-xs text-purple-400">
                    {sampleContent.filter((c) => c.type === "adventure").length} adventures
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* View Mode Toggle */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-100">Browse Content</h2>
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "all" | "free" | "commercial")}>
                <TabsList className="bg-slate-800/50 border-slate-600">
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <Dice6 className="h-4 w-4" />
                    All Content
                  </TabsTrigger>
                  <TabsTrigger value="free" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Free Resources
                  </TabsTrigger>
                  <TabsTrigger value="commercial" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Premium Products
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Content Filter */}
            <DndContentFilter
              content={sampleContent}
              allTypes={allTypes}
              allSystems={allSystems}
              allTags={allTags}
              allAvailability={allAvailability}
              onFilterChange={setFilteredContent}
            />

            {/* Content Display */}
            <Tabs value={viewMode} className="w-full">
              <TabsContent value="all">
                {filteredContent.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredContent.map((content) => (
                      <DndContentCard key={content.slug} content={content} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Dice6 className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">No content found</h3>
                    <p className="text-slate-400">Try adjusting your filters to discover more RPG content.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="free">
                <div className="mb-6 p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Free Resources</h3>
                  <p className="text-slate-300 text-sm">
                    All free content is available for personal use. Please respect the creative commons licensing and
                    give credit when sharing or adapting these materials.
                  </p>
                </div>
                {freeContent.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {freeContent.map((content) => (
                      <DndContentCard key={content.slug} content={content} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Download className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">No free content matches your filters</h3>
                    <p className="text-slate-400">Try adjusting your search criteria.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="commercial">
                <div className="mb-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Premium Products</h3>
                  <p className="text-slate-300 text-sm">
                    These products are available for purchase on DMs Guild and DriveThruRPG. Each has been extensively
                    playtested and includes professional layout and artwork.
                  </p>
                </div>
                {commercialContent.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {commercialContent.map((content) => (
                      <DndContentCard key={content.slug} content={content} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">
                      No premium products match your filters
                    </h3>
                    <p className="text-slate-400">Try adjusting your search criteria.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Call to Action */}
            <div className="mt-16 text-center bg-gradient-to-r from-red-900/30 to-orange-900/30 p-8 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold text-slate-100 mb-4">Join the Community</h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Have you used any of these creations in your games? I'd love to hear about your experiences! Feedback
                from real tables helps improve future content and ensures everything works as intended.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-red-600 hover:bg-red-700" asChild>
                  <Link href="/contact">
                    <Dice6 className="mr-2 h-4 w-4" />
                    Share Your Experience
                  </Link>
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800" asChild>
                  <Link href="/team-building">
                    <Users className="mr-2 h-4 w-4" />
                    D&D Team Building
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
