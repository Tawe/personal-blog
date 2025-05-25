import { notFound } from "next/navigation"
import { ContentLayout } from "@/components/content-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, ArrowLeft, Share2, Download, Code, Target, FileText, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Sample technical article data - in production, this would come from getTechnicalArticleBySlug
const sampleArticle = {
  slug: "microservices-architecture",
  title: "Building Scalable Microservices Architecture",
  date: "2024-01-15",
  updated: "2024-02-01",
  excerpt: "A comprehensive guide to designing and implementing microservices that scale with your business needs",
  tags: ["architecture", "microservices", "scalability", "devops"],
  difficulty: "intermediate" as const,
  type: "guide" as const,
  reading_time: 12,
  featured_image: "/placeholder.svg?height=400&width=800",
  code_languages: ["javascript", "docker", "yaml"],
  recently_updated: true,
  content: `
# Building Scalable Microservices Architecture

Microservices architecture has become the de facto standard for building scalable, maintainable applications. However, the transition from monolithic to microservices architecture requires careful planning and execution.

## Core Principles

### Single Responsibility
Each microservice should have a single, well-defined responsibility. This principle ensures that services remain focused and maintainable.

### Decentralized Data Management
Each service should own its data and expose it only through well-defined APIs.

\`\`\`javascript
// User Service - owns user data
class UserService {
  async createUser(userData) {
    const user = await this.userRepository.create(userData);
    await this.eventBus.publish('user.created', user);
    return user;
  }

  async getUserById(id) {
    return await this.userRepository.findById(id);
  }
}
\`\`\`

### Service Communication
Services should communicate through well-defined APIs, preferably using HTTP/REST or message queues for asynchronous communication.

## Implementation Strategy

### 1. Start with a Monolith
Begin with a well-structured monolith and extract services as you identify clear boundaries.

### 2. Identify Service Boundaries
Use Domain-Driven Design (DDD) to identify bounded contexts that can become microservices.

### 3. Data Decomposition
Plan how to split shared databases while maintaining data consistency.

\`\`\`yaml
# Docker Compose for local development
version: '3.8'
services:
  user-service:
    build: ./user-service
    ports:
      - "3001:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@user-db:5432/users
    depends_on:
      - user-db

  order-service:
    build: ./order-service
    ports:
      - "3002:3000"
    environment:
      - DATABASE_URL=postgresql://order:password@order-db:5432/orders
    depends_on:
      - order-db

  user-db:
    image: postgres:13
    environment:
      POSTGRES_DB: users
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password

  order-db:
    image: postgres:13
    environment:
      POSTGRES_DB: orders
      POSTGRES_USER: order
      POSTGRES_PASSWORD: password
\`\`\`

## Deployment Considerations

### Container Orchestration
Use Kubernetes or Docker Swarm for container orchestration and service discovery.

### API Gateway
Implement an API gateway to handle cross-cutting concerns like authentication, rate limiting, and request routing.

### Monitoring and Observability
Implement distributed tracing and centralized logging to monitor service health and performance.

\`\`\`yaml
# Kubernetes deployment example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: user-service-secrets
              key: database-url
\`\`\`

## Common Pitfalls

### Over-Engineering
Don't create microservices for the sake of it. Start simple and evolve based on actual needs.

### Data Consistency
Plan for eventual consistency and implement compensation patterns for distributed transactions.

### Network Latency
Be aware of the network overhead introduced by service-to-service communication.

## Conclusion

Microservices architecture offers significant benefits for scalability and maintainability, but it also introduces complexity. Success requires careful planning, proper tooling, and a deep understanding of distributed systems principles.

The key is to start simple, measure everything, and evolve your architecture based on real-world usage patterns and business requirements.
  `,
}

const difficultyConfig = {
  beginner: { color: "bg-green-600/20 text-green-400 border-green-600/30", icon: "●" },
  intermediate: { color: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30", icon: "●●" },
  advanced: { color: "bg-red-600/20 text-red-400 border-red-600/30", icon: "●●●" },
}

const typeConfig = {
  tutorial: { color: "bg-blue-600/20 text-blue-400 border-blue-600/30", icon: Code },
  guide: { color: "bg-purple-600/20 text-purple-400 border-purple-600/30", icon: Zap },
  analysis: { color: "bg-orange-600/20 text-orange-400 border-orange-600/30", icon: Target },
  documentation: { color: "bg-slate-600/20 text-slate-400 border-slate-600/30", icon: FileText },
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function TechnicalArticlePage({ params }: PageProps) {
  // In production, this would use getTechnicalArticleBySlug(params.slug)
  const article = sampleArticle

  if (!article) {
    notFound()
  }

  const difficultyStyle = difficultyConfig[article.difficulty]
  const typeStyle = typeConfig[article.type]
  const TypeIcon = typeStyle.icon

  return (
    <ContentLayout title={article.title}>
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Button variant="ghost" className="text-slate-400 hover:text-slate-200" asChild>
            <Link href="/technical-writing">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Technical Writing
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          {article.featured_image && (
            <div className="relative mb-8 rounded-xl overflow-hidden">
              <Image
                src={article.featured_image || "/placeholder.svg"}
                alt={article.title}
                width={800}
                height={400}
                className="aspect-video w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
            </div>
          )}

          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 leading-tight">{article.title}</h1>

            {/* Technical Metadata */}
            <div className="flex flex-wrap items-center gap-4">
              <Badge className={`${difficultyStyle.color} font-mono`}>
                <Target className="mr-1 h-3 w-3" />
                {difficultyStyle.icon} {article.difficulty}
              </Badge>
              <Badge className={`${typeStyle.color}`}>
                <TypeIcon className="mr-1 h-3 w-3" />
                {article.type}
              </Badge>
              {article.recently_updated && (
                <Badge className="bg-green-600/20 text-green-400 border-green-600/30">Recently Updated</Badge>
              )}
            </div>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Published{" "}
                  {new Date(article.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {article.updated && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Updated{" "}
                    {new Date(article.updated).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.reading_time} min read</span>
              </div>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>

            {/* Code Languages */}
            {article.code_languages && article.code_languages.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-300">Technologies Covered:</h3>
                <div className="flex flex-wrap gap-2">
                  {article.code_languages.map((language) => (
                    <Badge
                      key={language}
                      variant="outline"
                      className="bg-slate-900/50 text-slate-300 border-slate-600 font-mono"
                    >
                      <Code className="mr-1 h-3 w-3" />
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-300">Topics:</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-slate-700/50 text-slate-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-invert prose-blue max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br />") }} />
        </article>

        {/* Related Articles */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Related Technical Articles</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/technical-writing/react-performance-optimization"
                className="block p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-red-600/20 text-red-400 border-red-600/30 text-xs font-mono">●●● advanced</Badge>
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs">
                    <Code className="mr-1 h-3 w-3" />
                    tutorial
                  </Badge>
                </div>
                <h4 className="font-medium text-slate-200 mb-2">Performance Optimization Techniques for React</h4>
                <p className="text-sm text-slate-400">
                  Practical strategies to improve the performance of your React applications...
                </p>
              </Link>
              <Link
                href="/technical-writing/kubernetes-deployment-strategies"
                className="block p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-red-600/20 text-red-400 border-red-600/30 text-xs font-mono">●●● advanced</Badge>
                  <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/30 text-xs">
                    <Zap className="mr-1 h-3 w-3" />
                    guide
                  </Badge>
                </div>
                <h4 className="font-medium text-slate-200 mb-2">Advanced Kubernetes Deployment Strategies</h4>
                <p className="text-sm text-slate-400">
                  Master blue-green deployments, canary releases, and rolling updates...
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  )
}
