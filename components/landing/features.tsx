import { Shield, Server, Wifi, Zap, FileText, Code } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "100% Private",
    description: "AI runs entirely in your browser. Nothing leaves your device.",
    icon: Shield,
  },
  {
    title: "Zero Server Cost",
    description: "No expensive GPU servers needed. The model runs locally.",
    icon: Server,
  },
  {
    title: "Offline Ready",
    description: "After first download, use the AI offline anywhere.",
    icon: Wifi,
  },
  {
    title: "Tool Calling",
    description: "Search the web, read websites, and more — all from chat.",
    icon: Zap,
  },
  {
    title: "Markdown Responses",
    description: "Beautiful formatted responses with code blocks and tables.",
    icon: FileText,
  },
  {
    title: "Open Source",
    description: "Transparent, auditable, and community-driven development.",
    icon: Code,
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need, Nothing You Don&apos;t
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            A modern AI chat experience that puts you in control.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
