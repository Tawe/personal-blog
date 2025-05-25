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
  Sparkles,
  Map,
  Users,
  Crown,
  BookOpen,
  Building,
  Scroll,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Sample Artumin content data - in production, this would come from getArtumiContentBySlug
const sampleContent = {
  slug: "crystal-spires-valdris",
  title: "The Crystal Spires of Valdris",
  date: "2024-01-15",
  type: "location" as const,
  excerpt:
    "High in the northern mountains, the ancient Crystal Spires hold secrets of forgotten magic and lost civilizations.",
  categories: ["locations", "magic", "ancient-history"],
  region: "Northern Kingdoms",
  featured_image: "/placeholder.svg?height=400&width=800&query=crystal spires mountain fantasy",
  status: "complete" as const,
  connections: ["archmage-theron", "the-last-crystal"],
  reading_time: 8,
  content: `
# The Crystal Spires of Valdris

High in the northern reaches of the Valdris Mountains, where the air grows thin and the winds carry whispers of ancient power, stand the Crystal Spires—seven towering formations of pure, luminescent crystal that pierce the sky like frozen lightning.

## The Eternal Glow

Each spire rises nearly a thousand feet from the mountain's peak, their surfaces smooth as glass yet harder than the finest steel. During the day, they appear as pillars of captured starlight, refracting the sun's rays into cascading rainbows that dance across the snow-covered peaks. But it is at night when their true nature reveals itself.

*As darkness falls, the spires begin to pulse with an inner light—a soft, ethereal glow that can be seen from leagues away on clear nights. The light shifts through colors unknown to mortal eyes, hues that seem to exist between blue and silver, between gold and white.*

## Ancient Origins

The origins of the Crystal Spires remain shrouded in mystery, though scholars and mages have proposed numerous theories over the centuries:

### The Sundering Theory
Some believe the spires are remnants of a great magical catastrophe—perhaps the very event that ended the Age of Wonders and scattered the ancient empire. According to this theory, the spires are crystallized magical energy, frozen in time at the moment of some tremendous spell's casting.

### The Celestial Anchor Theory
Others propose that the spires serve as anchors between the material world and the celestial realm. They point to the way the spires' light seems to pulse in rhythm with certain star patterns, and how magical phenomena intensify during celestial events.

### The Draconic Legacy Theory
The most romantic theory suggests the spires were created by the last of the great crystal dragons, who transformed themselves into these eternal monuments rather than face extinction. Proponents note the spires' resemblance to dragon scales and the way they seem to "breathe" with their pulsing light.

## The Keeper's Tower

At the base of the central spire stands a modest tower of white stone, home to the current Keeper of the Spires—Archmage Theron Brightward. For over three centuries, Theron has studied the spires, documenting their patterns, cataloging their effects on local magic, and protecting them from those who would exploit their power.

*The tower itself seems to exist in harmony with the spires, its stones taking on a faint luminescence during the night hours. Visitors often report feeling a sense of profound peace within its walls, as if the very air hums with benevolent magic.*

## Magical Properties

The Crystal Spires are not merely beautiful monuments—they are sources of immense magical power with several documented properties:

### Amplification
Spells cast within a mile of the spires are significantly more powerful, though also more unpredictable. Many young mages have learned to their cost that the spires amplify not just magical energy, but magical mistakes as well.

### Purification
The spires seem to cleanse corruption from magical energy. Cursed items brought near them often lose their malevolent properties, and mages suffering from magical ailments frequently find relief in the spires' presence.

### Revelation
Perhaps most remarkably, the spires occasionally reveal visions of the past or future to those who meditate in their presence. These visions are rare and seem to come only to those with pure intentions and great need.

## The Pilgrimage

Despite the treacherous journey required to reach them, the Crystal Spires draw pilgrims from across the known world. Mages seek to study their properties, scholars hope to unlock their secrets, and the faithful come seeking spiritual enlightenment.

The path to the spires is not for the faint of heart. It requires a week's journey through increasingly dangerous mountain terrain, past the ruins of ancient watchtowers and through valleys where strange echoes carry on the wind. Many who attempt the pilgrimage turn back before reaching their destination.

Those who do complete the journey often speak of being forever changed by the experience. They describe a sense of connection to something vast and eternal, a glimpse of the fundamental forces that shape reality itself.

## Guardians and Threats

While Archmage Theron serves as the official guardian of the spires, he is not their only protector. The mountains themselves seem to defend the sacred site:

- **The Crystal Wolves**: Ethereal beings that appear as wolves made of living light, they patrol the approaches to the spires and are said to judge the intentions of all who would approach.

- **The Singing Stones**: Certain rocks along the pilgrimage path emit haunting melodies that can either guide worthy travelers or lead the unworthy astray.

- **The Mist of Memory**: A strange fog that sometimes descends on the mountain paths, causing travelers to become lost in visions of their own past until they prove their resolve.

Yet threats remain. The Shadowmere Trading Company has long coveted the spires' power for their own purposes, and rumors persist of a secret society that seeks to harness the crystals' energy for dark rituals.

## The Prophecy of the Dimming

Ancient texts speak of a time when the spires' light will begin to fade—a sign that the barriers between worlds are weakening and that great change approaches. Some scholars believe this prophecy refers to the end of the current age, while others interpret it as a warning of invasion from otherworldly forces.

*"When the seven lights grow dim and the mountain's song falls silent, then shall the children of two worlds meet upon the field of stars, and the fate of all shall hang upon the choices of the few."*

Recent observations by Archmage Theron suggest that the spires' light has indeed begun to fluctuate in ways not seen for centuries, lending credence to those who believe the prophecy's time draws near.

## Conclusion

The Crystal Spires of Valdris remain one of Artumin's greatest mysteries and most sacred sites. They stand as a bridge between the mundane and the magical, the mortal and the eternal. Whether they are remnants of a lost age, anchors to other realms, or something else entirely, their presence continues to shape the world around them.

For those brave enough to make the pilgrimage, the spires offer not just magical power or scholarly knowledge, but a profound reminder of the wonder and mystery that still exists in the world. In an age where magic is increasingly understood and catalogued, the Crystal Spires remain beautifully, eternally enigmatic.

*As Archmage Theron often tells visitors: "The spires do not reveal their secrets to those who demand answers, but to those who are content to simply witness their beauty and accept their mystery."*
  `,
}

const typeConfig = {
  story: { color: "bg-purple-600/20 text-purple-400 border-purple-600/30", icon: Scroll, label: "Story" },
  lore: { color: "bg-blue-600/20 text-blue-400 border-blue-600/30", icon: BookOpen, label: "Lore" },
  character: { color: "bg-green-600/20 text-green-400 border-green-600/30", icon: Users, label: "Character" },
  location: { color: "bg-orange-600/20 text-orange-400 border-orange-600/30", icon: Map, label: "Location" },
  history: { color: "bg-red-600/20 text-red-400 border-red-600/30", icon: Crown, label: "History" },
  organization: { color: "bg-teal-600/20 text-teal-400 border-teal-600/30", icon: Building, label: "Organization" },
}

const statusConfig = {
  complete: { color: "bg-green-600/20 text-green-400 border-green-600/30", label: "Complete" },
  "in-progress": { color: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30", label: "In Progress" },
  planned: { color: "bg-slate-600/20 text-slate-400 border-slate-600/30", label: "Planned" },
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function ArtumiContentPage({ params }: PageProps) {
  // In production, this would use getArtumiContentBySlug(params.slug)
  const content = sampleContent

  if (!content) {
    notFound()
  }

  const typeStyle = typeConfig[content.type]
  const statusStyle = statusConfig[content.status]
  const TypeIcon = typeStyle.icon

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="relative">
        <ContentLayout title={content.title}>
          <div className="max-w-4xl mx-auto">
            {/* Back Navigation */}
            <div className="mb-8">
              <Button variant="ghost" className="text-slate-400 hover:text-slate-200" asChild>
                <Link href="/artumin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Artumin
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
                  <Badge className={`${statusStyle.color}`}>{statusStyle.label}</Badge>
                  {content.region && (
                    <Badge className="bg-slate-700/50 text-slate-300 border-slate-600">
                      <Map className="mr-1 h-3 w-3" />
                      {content.region}
                    </Badge>
                  )}
                </div>

                {/* Content Meta */}
                <div className="flex flex-wrap items-center gap-6 text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Created{" "}
                      {new Date(content.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{content.reading_time} min read</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>

                {/* Categories */}
                {content.categories && content.categories.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-slate-300">Categories:</h3>
                    <div className="flex flex-wrap gap-2">
                      {content.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="bg-slate-700/50 text-slate-300">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </header>

            {/* Content Body */}
            <article className="prose prose-invert prose-purple max-w-none mb-12">
              <div dangerouslySetInnerHTML={{ __html: content.content.replace(/\n/g, "<br />") }} />
            </article>

            {/* Related Content */}
            {content.connections && content.connections.length > 0 && (
              <Card className="bg-gradient-to-r from-purple-900/30 to-slate-800/30 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    Connected Entries
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Link
                      href="/artumin/archmage-theron"
                      className="block p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">
                          <Users className="mr-1 h-3 w-3" />
                          Character
                        </Badge>
                      </div>
                      <h4 className="font-medium text-slate-200 mb-2">Archmage Theron Brightward</h4>
                      <p className="text-sm text-slate-400">
                        The last keeper of the old ways, guardian of the Crystal Spires...
                      </p>
                    </Link>
                    <Link
                      href="/artumin/the-last-crystal"
                      className="block p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/30 text-xs">
                          <Scroll className="mr-1 h-3 w-3" />
                          Story
                        </Badge>
                      </div>
                      <h4 className="font-medium text-slate-200 mb-2">The Last Crystal</h4>
                      <p className="text-sm text-slate-400">
                        When the final crystal begins to dim, Theron must choose between preserving ancient knowledge...
                      </p>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ContentLayout>
      </div>
    </div>
  )
}
