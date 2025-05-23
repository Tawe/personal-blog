import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { Download, Map, Scroll, Swords, Users } from "lucide-react"

export default function DndCreationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">D&D Creations</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Custom campaigns, characters, and game mechanics for Dungeons & Dragons
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="campaigns" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="campaigns" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">Campaigns</span>
                </TabsTrigger>
                <TabsTrigger value="characters" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Characters</span>
                </TabsTrigger>
                <TabsTrigger value="items" className="flex items-center gap-2">
                  <Swords className="h-4 w-4" />
                  <span className="hidden sm:inline">Magic Items</span>
                </TabsTrigger>
                <TabsTrigger value="mechanics" className="flex items-center gap-2">
                  <Scroll className="h-4 w-4" />
                  <span className="hidden sm:inline">Game Mechanics</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="campaigns" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>The Shattered Realms</CardTitle>
                      <CardDescription>A campaign for levels 5-15 across fractured planes of existence</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        width={400}
                        height={200}
                        alt="The Shattered Realms"
                        className="aspect-video rounded-lg object-cover"
                      />
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>
                          Players navigate a multiverse shattered by a cosmic event, seeking to restore balance before
                          reality collapses.
                        </p>
                        <ul className="mt-2 list-disc pl-5">
                          <li>10 unique planar locations</li>
                          <li>25+ custom encounters</li>
                          <li>New planar travel mechanics</li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/dnd-creations/campaigns/shattered-realms">
                          <Download className="mr-2 h-4 w-4" />
                          View Campaign
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Depths of Undermountain</CardTitle>
                      <CardDescription>A dungeon delve campaign for levels 1-10</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        width={400}
                        height={200}
                        alt="Depths of Undermountain"
                        className="aspect-video rounded-lg object-cover"
                      />
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>A reimagining of the classic dungeon with modern mechanics and narrative elements.</p>
                        <ul className="mt-2 list-disc pl-5">
                          <li>20 detailed dungeon levels</li>
                          <li>Faction-based storylines</li>
                          <li>Dynamic dungeon evolution</li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/dnd-creations/campaigns/undermountain">
                          <Download className="mr-2 h-4 w-4" />
                          View Campaign
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>The Frostbound Crown</CardTitle>
                      <CardDescription>A winter-themed campaign for levels 3-12</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        width={400}
                        height={200}
                        alt="The Frostbound Crown"
                        className="aspect-video rounded-lg object-cover"
                      />
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>An epic journey through a realm locked in eternal winter by a cursed artifact.</p>
                        <ul className="mt-2 list-disc pl-5">
                          <li>Survival mechanics</li>
                          <li>Nordic-inspired setting</li>
                          <li>Weather-based magic system</li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/dnd-creations/campaigns/frostbound-crown">
                          <Download className="mr-2 h-4 w-4" />
                          View Campaign
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="characters" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Memorable NPCs</CardTitle>
                      <CardDescription>A collection of 20 unique non-player characters</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        width={400}
                        height={200}
                        alt="Memorable NPCs"
                        className="aspect-video rounded-lg object-cover"
                      />
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>Fully developed characters with backgrounds, motivations, and plot hooks.</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/dnd-creations/characters/npcs">View Characters</Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Villain Compendium</CardTitle>
                      <CardDescription>15 antagonists with complete motivations and tactics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        width={400}
                        height={200}
                        alt="Villain Compendium"
                        className="aspect-video rounded-lg object-cover"
                      />
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>From masterminds to monsters, a range of villains for any campaign.</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/dnd-creations/characters/villains">View Villains</Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Pregenerated Characters</CardTitle>
                      <CardDescription>Ready-to-play character sheets for quick game starts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        width={400}
                        height={200}
                        alt="Pregenerated Characters"
                        className="aspect-video rounded-lg object-cover"
                      />
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>Characters for levels 1, 5, and 10 with backstories and equipment.</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/dnd-creations/characters/pregens">View Characters</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="items" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Artifacts of Power</CardTitle>
                      <CardDescription>Legendary items with campaign-changing abilities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        width={400}
                        height={200}
                        alt="Artifacts of Power"
                        className="aspect-video rounded-lg object-cover"
                      />
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>10 unique artifacts with histories, powers, and drawbacks.</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/dnd-creations/items/artifacts">View Artifacts</Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Uncommon Treasures</CardTitle>
                      <CardDescription>50 interesting magic items for low-level play</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        width={400}
                        height={200}
                        alt="Uncommon Treasures"
                        className="aspect-video rounded-lg object-cover"
                      />
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>Creative items that add flavor without breaking game balance.</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/dnd-creations/items/uncommon">View Items</Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Sentient Objects</CardTitle>
                      <CardDescription>Items with personalities and goals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        width={400}
                        height={200}
                        alt="Sentient Objects"
                        className="aspect-video rounded-lg object-cover"
                      />
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>15 sentient items that can become allies, advisors, or complications.</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/dnd-creations/items/sentient">View Items</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="mechanics" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Critical Hit System</CardTitle>
                      <CardDescription>Enhanced critical hit mechanics with lasting effects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        width={400}
                        height={200}
                        alt="Critical Hit System"
                        className="aspect-video rounded-lg object-cover"
                      />
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>A balanced system for making critical hits more impactful and memorable.</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/dnd-creations/mechanics/critical-hits">View System</Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Crafting Rules</CardTitle>
                      <CardDescription>Comprehensive system for creating items</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        width={400}
                        height={200}
                        alt="Crafting Rules"
                        className="aspect-video rounded-lg object-cover"
                      />
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>Rules for crafting mundane items, potions, and magical equipment.</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/dnd-creations/mechanics/crafting">View Rules</Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Faction Reputation</CardTitle>
                      <CardDescription>System for tracking player standing with organizations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        width={400}
                        height={200}
                        alt="Faction Reputation"
                        className="aspect-video rounded-lg object-cover"
                      />
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>A framework for meaningful faction interactions and consequences.</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/dnd-creations/mechanics/factions">View System</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Community Contributions</h2>
                <p className="mt-4 text-muted-foreground md:text-lg">
                  All creations are free to use in your own games. If you enjoy them, consider:
                </p>
                <ul className="mt-6 grid gap-4">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Sharing your experiences</p>
                      <p className="text-sm text-muted-foreground">
                        Let me know how these materials worked in your games
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Contributing your own ideas</p>
                      <p className="text-sm text-muted-foreground">Submit your creations to be featured</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Supporting future content</p>
                      <p className="text-sm text-muted-foreground">Consider a small donation to fund new creations</p>
                    </div>
                  </li>
                </ul>
                <Button className="mt-6" asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  width={400}
                  height={400}
                  alt="D&D Creations"
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
