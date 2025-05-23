import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Clock, Calendar } from "lucide-react"

export default function TechnicalWritingPage() {
  // Sample articles data - in a real app, this would come from a database or CMS
  const articles = [
    {
      id: 1,
      title: "Implementing Microservices Architecture",
      description: "A comprehensive guide to breaking down monolithic applications into microservices",
      date: "May 15, 2023",
      readTime: "12 min read",
      image: "/placeholder.svg?height=200&width=400",
      slug: "implementing-microservices-architecture",
    },
    {
      id: 2,
      title: "The Future of TypeScript in Enterprise Development",
      description: "How TypeScript is changing the landscape of large-scale application development",
      date: "April 3, 2023",
      readTime: "8 min read",
      image: "/placeholder.svg?height=200&width=400",
      slug: "typescript-in-enterprise-development",
    },
    {
      id: 3,
      title: "CI/CD Best Practices for Development Teams",
      description: "Streamlining your development pipeline with effective CI/CD strategies",
      date: "March 21, 2023",
      readTime: "10 min read",
      image: "/placeholder.svg?height=200&width=400",
      slug: "cicd-best-practices",
    },
    {
      id: 4,
      title: "Managing Technical Debt in Growing Organizations",
      description: "Strategies for identifying, prioritizing, and addressing technical debt",
      date: "February 12, 2023",
      readTime: "15 min read",
      image: "/placeholder.svg?height=200&width=400",
      slug: "managing-technical-debt",
    },
    {
      id: 5,
      title: "Building Accessible Web Applications",
      description: "A guide to creating inclusive web experiences for all users",
      date: "January 28, 2023",
      readTime: "11 min read",
      image: "/placeholder.svg?height=200&width=400",
      slug: "building-accessible-web-applications",
    },
    {
      id: 6,
      title: "Performance Optimization Techniques for React Applications",
      description: "Practical strategies to improve the performance of your React apps",
      date: "December 10, 2022",
      readTime: "14 min read",
      image: "/placeholder.svg?height=200&width=400",
      slug: "react-performance-optimization",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Technical Writing</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Insights, tutorials, and best practices from my experience as a Head of Development
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Card key={article.id} className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="relative">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      width={400}
                      height={200}
                      alt={article.title}
                      className="aspect-video w-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                    <CardDescription>{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/technical-writing/${article.slug}`}>Read Article</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Subscribe to My Newsletter</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Get the latest articles and insights delivered directly to your inbox
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button type="submit">Subscribe</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
