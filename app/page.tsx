import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BookText, Users, Sword, Building2 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">John Doe</h1>
                  <p className="text-xl text-muted-foreground">
                    Head of Development | Technical Writer | Fantasy Storyteller | D&D Enthusiast
                  </p>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Welcome to my personal website where I share my professional insights, creative writing, and passion
                    for Dungeons & Dragons.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild>
                    <Link href="#featured">Explore My Work</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/team-building">Team Building Services</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="/placeholder.svg?height=550&width=550"
                width={550}
                height={550}
                alt="Profile"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full"
                priority
              />
            </div>
          </div>
        </section>

        <section id="featured" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Content</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Explore the different facets of my professional and creative work
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-4">
              <Card className="transition-all hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Technical Writing</span>
                  </div>
                  <CardTitle>Development Insights</CardTitle>
                  <CardDescription>
                    Articles, tutorials, and insights from my experience as a Head of Development
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    width={400}
                    height={200}
                    alt="Technical Writing"
                    className="aspect-video rounded-lg object-cover"
                  />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/technical-writing">Read Articles</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="transition-all hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Leadership Fantasy</span>
                  </div>
                  <CardTitle>Leadership Stories</CardTitle>
                  <CardDescription>Creative stories that blend fantasy with leadership principles</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    width={400}
                    height={200}
                    alt="Leadership Fantasy"
                    className="aspect-video rounded-lg object-cover"
                  />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/leadership-fantasy">Read Stories</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="transition-all hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sword className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">D&D Creations</span>
                  </div>
                  <CardTitle>Homebrew Content</CardTitle>
                  <CardDescription>
                    Custom campaigns, characters, and game mechanics for Dungeons & Dragons
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    width={400}
                    height={200}
                    alt="D&D Creations"
                    className="aspect-video rounded-lg object-cover"
                  />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dnd-creations">Explore Creations</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="transition-all hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Team Building</span>
                  </div>
                  <CardTitle>D&D Team Building</CardTitle>
                  <CardDescription>Corporate team building services using Dungeons & Dragons</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    width={400}
                    height={200}
                    alt="Team Building"
                    className="aspect-video rounded-lg object-cover"
                  />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/team-building">Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 px-10 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Bringing Teams Together Through Adventure
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  My unique approach combines professional development with the collaborative storytelling of Dungeons &
                  Dragons to create memorable team building experiences.
                </p>
                <Button size="lg" asChild>
                  <Link href="/team-building">Book a Session</Link>
                </Button>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <ul className="grid gap-4">
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
                    <div className="grid gap-1">
                      <p className="text-base font-medium leading-none">Improved Communication</p>
                      <p className="text-sm text-muted-foreground">
                        Role-playing scenarios that develop effective communication skills
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
                    <div className="grid gap-1">
                      <p className="text-base font-medium leading-none">Problem Solving</p>
                      <p className="text-sm text-muted-foreground">
                        Collaborative challenges that enhance creative problem-solving abilities
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
                    <div className="grid gap-1">
                      <p className="text-base font-medium leading-none">Team Bonding</p>
                      <p className="text-sm text-muted-foreground">
                        Shared adventures that create lasting bonds between team members
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
