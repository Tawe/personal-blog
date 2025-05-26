import { HubPageTemplate } from "@/components/hub-page-template"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Cloud, Zap, Database, Shield, GitBranch } from "lucide-react"
import type { HubConfig } from "@/lib/types"

const technicalConfig: HubConfig = {
  title: "Technical Architecture",
  description: "Deep dives into system design, scalability, and technology decisions",
  contentFolder: "technical-writings",
  baseUrl: "/technical-architecture",
  breadcrumbPath: "Strategic Narratives > Technical Architecture",
  theme: {
    primary: "blue",
    secondary: "slate",
    accent: "cyan",
  },
}

export default function TechnicalArchitecturePage() {
  return (
    <HubPageTemplate config={technicalConfig}>
      {/* Introduction */}
      <div className="mb-12 text-center">
        <p className="text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto">
          Technical communication is about translating complex concepts into actionable insights. These articles focus
          on practical solutions, architectural patterns, and best practices drawn from real-world experience building
          and scaling software systems.
        </p>
      </div>

      {/* Technical Focus Areas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6 text-center">
            <Code className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Architecture & Design</h3>
            <p className="text-slate-400 text-sm">
              System design patterns, microservices, and scalable architecture principles.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6 text-center">
            <Zap className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Performance & Optimization</h3>
            <p className="text-slate-400 text-sm">
              Strategies for building fast, efficient applications that scale under load.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6 text-center">
            <Cloud className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Cloud & DevOps</h3>
            <p className="text-slate-400 text-sm">
              Modern deployment strategies, containerization, and cloud-native development.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6 text-center">
            <Database className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Data & Databases</h3>
            <p className="text-slate-400 text-sm">
              Database design, data modeling, and strategies for managing data at scale.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6 text-center">
            <Shield className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Security & Best Practices</h3>
            <p className="text-slate-400 text-sm">
              Security patterns, code quality, and engineering practices for reliable systems.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6 text-center">
            <GitBranch className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Languages & Frameworks</h3>
            <p className="text-slate-400 text-sm">
              Deep dives into JavaScript, TypeScript, React, and modern development tools.
            </p>
          </CardContent>
        </Card>
      </div>
    </HubPageTemplate>
  )
}
