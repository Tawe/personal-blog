import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Star } from "lucide-react"

export default function LeadershipFantasyPage() {
  // Sample stories data - in a real app, this would come from a database or CMS
  const stories = [
    {
      id: 1,
      title: "The Council of Five Kingdoms",
      description: "A tale of diplomacy and leadership when five rival kingdoms must unite against a common threat",
      rating: 4.8,
      readTime: "25 min read",
      image: "/placeholder.svg?height=300&width=500",
      slug: "council-of-five-kingdoms",
    },
    {
      id: 2,
      title: "The Wizard's Apprentice",
      description: "How a young apprentice learns to lead through service and wisdom rather than power",
      rating: 4.6,
      readTime: "18 min read",
      image: "/placeholder.svg?height=300&width=500",
      slug: "wizards-apprentice",
    },
    {
      id: 3,
      title: "Dragon's Counsel",
      description: "An ancient dragon teaches a reluctant queen the true meaning of strategic thinking",
      rating: 4.9,
      readTime: "30 min read",
      image: "/placeholder.svg?height=300&width=500",
      slug: "dragons-counsel",
    },
    {
      id: 4,
      title: "The Silent Knight",
      description: "A knight who cannot speak must find new ways to inspire and lead his companions",
      rating: 4.7,
      readTime: "22 min read",
      image: "/placeholder.svg?height=300&width=500",
      slug: "silent-knight",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Leadership Fantasy Stories</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Creative tales that blend fantasy worlds with leadership principles and lessons
                </p>
              </div>
              <div className="space-y-2">
                <p className="max-w-[700px] md:text-lg">
                  These stories use the power of fantasy to illustrate complex leadership concepts in engaging and
                  memorable ways.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {stories.map((story) => (
                <Card key={story.id} className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="relative">
                    <Image
                      src={story.image || "/placeholder.svg"}
                      width={500}
                      height={300}
                      alt={story.title}
                      className="aspect-[5/3] w-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl">{story.title}</CardTitle>
                    <CardDescription className="text-base">{story.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span>{story.rating} rating</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{story.readTime}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/leadership-fantasy/${story.slug}`}>Read Story</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why Fantasy for Leadership?</h2>
                <ul className="mt-6 grid gap-6">
                  <li className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      1
                    </div>
                    <div>
                      <h3 className="font-bold">Memorable Lessons</h3>
                      <p className="text-muted-foreground">
                        Stories create emotional connections that make leadership principles stick
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      2
                    </div>
                    <div>
                      <h3 className="font-bold">Complex Concepts Simplified</h3>
                      <p className="text-muted-foreground">
                        Fantasy settings allow abstract leadership ideas to be visualized concretely
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      3
                    </div>
                    <div>
                      <h3 className="font-bold">Engaging Format</h3>
                      <p className="text-muted-foreground">
                        Creative storytelling makes leadership development enjoyable rather than academic
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <blockquote className="border-l-4 border-primary pl-4 italic">
                  "Through fantasy, we can explore leadership challenges in ways that transcend the limitations of our
                  everyday experience, revealing universal truths about what it means to guide others."
                </blockquote>
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    width={60}
                    height={60}
                    alt="Author"
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">Head of Development</p>
                  </div>
                </div>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/about">About My Approach</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
