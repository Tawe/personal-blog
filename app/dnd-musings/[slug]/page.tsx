import { notFound } from "next/navigation"
import { ContentLayout } from "@/components/content-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Download,
  ExternalLink,
  Star,
  Dice6,
  Sword,
  Users,
  Map,
  Lightbulb,
  Sparkles,
  Shield,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Sample D&D content data - in production, this would come from getDndContentBySlug
const sampleContent = {
  slug: "shadowmancer-wizard-subclass",
  title: "The Shadowmancer - New Wizard Subclass",
  date: "2024-01-15",
  type: "mechanic" as const,
  excerpt:
    "A wizard subclass focused on shadow manipulation and stealth magic. Harness the power of darkness to confound enemies and protect allies through cunning rather than raw force.",
  system: "5e" as const,
  level_range: "any",
  tags: ["homebrew", "wizard", "shadow", "stealth"],
  featured_image: "/placeholder.svg?height=400&width=800&query=shadow wizard fantasy art",
  availability: "free" as const,
  duration: "10 min read",
  playtested: true,
  content: `
# The Shadowmancer

*Wizard Subclass*

Shadowmancers are wizards who have delved deep into the mysteries of shadow and darkness, learning to manipulate these forces not for evil, but as tools of protection and misdirection. Unlike necromancers who traffic with death, shadowmancers work with the living darkness that exists in the spaces between light.

## Subclass Features

### Shadow Affinity
*2nd-level Shadowmancer feature*

You gain proficiency with the Stealth skill if you don't already have it. Your proficiency bonus is doubled for any ability check you make that uses Stealth.

Additionally, you learn the *minor illusion* cantrip if you don't already know it. It doesn't count against your number of cantrips known.

### Umbral Spells
*2nd-level Shadowmancer feature*

You gain access to spells that are normally unavailable to wizards. Once you gain access to an umbral spell, you always have it prepared, and it doesn't count against the number of spells you can prepare each day.

| Wizard Level | Spells |
|--------------|--------|
| 2nd | *darkness*, *pass without trace* |
| 3rd | *catnap*, *fear* |
| 5th | *greater invisibility*, *shadow of moil* |
| 7th | *mislead*, *modify memory* |
| 9th | *creation*, *seeming* |

### Shadow Step
*2nd-level Shadowmancer feature*

As a bonus action, you can teleport up to 30 feet to an unoccupied space you can see that is in dim light or darkness. You don't need to see your destination, but you must be able to see some part of the area you're teleporting to.

You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.

### Cloak of Shadows
*6th-level Shadowmancer feature*

You can wrap yourself in shadows as a reaction when you take damage. Until the start of your next turn, you have resistance to all damage types except psychic and radiant damage.

Once you use this feature, you can't use it again until you finish a short or long rest.

### Shadow Mastery
*10th-level Shadowmancer feature*

You gain resistance to necrotic damage, and you can see normally in darkness, both magical and nonmagical, to a distance of 120 feet.

Additionally, when you cast a spell of 1st level or higher that creates an area of darkness or shadow, you can see through that darkness as if it were bright light.

### Master of Shadows
*14th-level Shadowmancer feature*

You can cast *darkness* at will, without expending a spell slot. When you cast *darkness* in this way, you can see through the darkness you create.

Additionally, as an action, you can become one with the shadows. For the next minute, you gain the following benefits:

- You are invisible while in dim light or darkness
- You can move through other creatures and objects as if they were difficult terrain, taking 1d10 force damage if you end your turn inside an object
- Your spell attacks deal an additional 1d8 necrotic damage

Once you use this feature, you can't use it again until you finish a long rest.

## Design Notes

### Balance Considerations

The Shadowmancer is designed to be a utility-focused subclass that excels at battlefield control and stealth rather than raw damage output. Key balance points:

- **Shadow Step** is limited by uses per long rest to prevent overuse
- **Cloak of Shadows** provides strong defense but only once per short rest
- **Master of Shadows** is powerful but limited to once per long rest

### Playtesting Results

This subclass has been tested in three different campaigns over 18 months:

- **Campaign 1**: Urban intrigue setting, levels 3-12. The stealth abilities proved invaluable for reconnaissance missions.
- **Campaign 2**: Traditional dungeon crawl, levels 1-8. Shadow Step provided excellent tactical positioning.
- **Campaign 3**: Wilderness exploration, levels 5-15. The darkness manipulation created interesting tactical options.

### Roleplay Opportunities

Shadowmancers offer rich roleplay potential:

- **The Reformed Assassin**: A former killer who now uses shadow magic to protect rather than harm
- **The Scholar of Mysteries**: An academic fascinated by the nature of light and darkness
- **The Protector**: Someone who uses shadows to shield others from harm

## Spell Recommendations

While the Umbral Spells provide the core shadow theme, consider these additional spells:

- **Cantrips**: *mage hand* (invisible), *prestidigitation* (snuff lights)
- **1st Level**: *disguise self*, *silent image*
- **2nd Level**: *blur*, *invisibility*
- **3rd Level**: *counterspell*, *hypnotic pattern*

## Multiclass Synergies

The Shadowmancer works well with:

- **Rogue**: Enhanced stealth and sneak attack opportunities
- **Warlock**: Thematic overlap with darkness and additional spell slots
- **Ranger**: Stealth synergy and wilderness applications

## Conclusion

The Shadowmancer provides a unique take on wizard subclasses, focusing on utility and battlefield control rather than damage. It's particularly well-suited for campaigns that emphasize stealth, intrigue, and tactical thinking.

*This content is available under Creative Commons licensing for personal use. Please credit "John Munn" when sharing or adapting this material.*
  `,
}

const typeConfig = {
  "thought-piece": { color: "bg-blue-600/20 text-blue-400 border-blue-600/30", icon: Lightbulb, label: "Analysis" },
  mechanic: { color: "bg-purple-600/20 text-purple-400 border-purple-600/30", icon: Sparkles, label: "Mechanic" },
  monster: { color: "bg-red-600/20 text-red-400 border-red-600/30", icon: Sword, label: "Monster" },
  "magic-item": { color: "bg-orange-600/20 text-orange-400 border-orange-600/30", icon: Shield, label: "Magic Item" },
  npc: { color: "bg-green-600/20 text-green-400 border-green-600/30", icon: Users, label: "NPC" },
  adventure: { color: "bg-teal-600/20 text-teal-400 border-teal-600/30", icon: Map, label: "Adventure" },
  product: { color: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30", icon: Dice6, label: "Product" },
}

const systemConfig = {
  "5e": { color: "text-red-400", label: "D&D 5e" },
  pathfinder: { color: "text-orange-400", label: "Pathfinder" },
  "system-agnostic": { color: "text-slate-400", label: "System Agnostic" },
}

const availabilityConfig = {
  free: { color: "bg-green-600/20 text-green-400 border-green-600/30", icon: Download, label: "Free" },
  premium: { color: "bg-blue-600/20 text-blue-400 border-blue-600/30", icon: Star, label: "Premium" },
  commercial: {
    color: "bg-purple-600/20 text-purple-400 border-purple-600/30",
    icon: ExternalLink,
    label: "Commercial",
  },
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function DndContentPage({ params }: PageProps) {
  // In production, this would use getDndContentBySlug(params.slug)
  const content = sampleContent

  if (!content) {
    notFound()
  }

  const typeStyle = typeConfig[content.type]
  const systemStyle = systemConfig[content.system]
  const availabilityStyle = availabilityConfig[content.availability]
  const TypeIcon = typeStyle.icon
  const AvailabilityIcon = availabilityStyle.icon

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-red-950/20 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.1),transparent_50%)]"></div>
      <div className="relative">
        <ContentLayout title={content.title}>
          <div className="max-w-4xl mx-auto">
            {/* Back Navigation */}
            <div className="mb-8">
              <Button variant="ghost" className="text-slate-400 hover:text-slate-200" asChild>
                <Link href="/dnd-musings">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to RPG Musings
                </Link>
              </Button>
            </div>

            {/* Content Header */}
            <header className="mb-8">
              {content.featured_image && (
                <div className="relative mb-8 rounded-xl overflow-hidden">
                  <Image
                    src={content.featured_image || "/placeholder.svg"}
                    alt={content.title}
                    width={800}
                    height={400}
                    className="aspect-video w-full object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                </div>
              )}

              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 leading-tight">{content.title}</h1>

                {/* Content Metadata */}
                <div className="flex flex-wrap items-center gap-4">
                  <Badge className={`${typeStyle.color}`}>
                    <TypeIcon className="mr-1 h-3 w-3" />
                    {typeStyle.label}
                  </Badge>
                  <Badge className={`${availabilityStyle.color}`}>
                    <AvailabilityIcon className="mr-1 h-3 w-3" />
                    {availabilityStyle.label}
                  </Badge>
                  {content.playtested && (
                    <Badge className="bg-green-600/20 text-green-400 border-green-600/30">Playtested</Badge>
                  )}
                </div>

                {/* Content Meta */}
                <div className="flex flex-wrap items-center gap-6 text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Published{" "}
                      {new Date(content.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {content.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{content.duration}</span>
                    </div>
                  )}
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  {content.availability === "free" && (
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  )}
                </div>

                {/* System and Level Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Dice6 className="h-4 w-4 text-slate-400" />
                    <span className={`${systemStyle.color} font-medium`}>{systemStyle.label}</span>
                  </div>
                  {content.level_range && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-300">
                        Levels {content.level_range === "any" ? "Any" : content.level_range}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {content.tags && content.tags.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-slate-300">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {content.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-slate-700/50 text-slate-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </header>

            {/* Content Body */}
            <article className="prose prose-invert prose-red max-w-none mb-12">
              <div dangerouslySetInnerHTML={{ __html: content.content.replace(/\n/g, "<br />") }} />
            </article>

            {/* Related Content */}
            <Card className="bg-gradient-to-r from-red-900/30 to-slate-800/30 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Dice6 className="h-5 w-5 text-red-400" />
                  Related RPG Content
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link
                    href="/dnd-musings/aberrant-horrors-bestiary"
                    className="block p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-red-600/20 text-red-400 border-red-600/30 text-xs">
                        <Sword className="mr-1 h-3 w-3" />
                        Monster
                      </Badge>
                      <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">
                        <Download className="mr-1 h-3 w-3" />
                        Free
                      </Badge>
                    </div>
                    <h4 className="font-medium text-slate-200 mb-2">Aberrant Horrors - Monster Collection</h4>
                    <p className="text-sm text-slate-400">
                      A collection of 12 unique aberrations designed to challenge and terrify players...
                    </p>
                  </Link>
                  <Link
                    href="/dnd-musings/social-encounter-mechanics"
                    className="block p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/30 text-xs">
                        <Sparkles className="mr-1 h-3 w-3" />
                        Mechanic
                      </Badge>
                      <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs">
                        <Star className="mr-1 h-3 w-3" />
                        Premium
                      </Badge>
                    </div>
                    <h4 className="font-medium text-slate-200 mb-2">Advanced Social Encounter Mechanics</h4>
                    <p className="text-sm text-slate-400">
                      A comprehensive system for running engaging social encounters with clear stakes...
                    </p>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
