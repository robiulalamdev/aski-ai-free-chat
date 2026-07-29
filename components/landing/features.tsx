import { Shield, Server, Wifi, Zap, FileText, Code, Brain, Globe } from "lucide-react"

const features = [
  {
    title: "Advanced AI",
    description: "Powered by cutting-edge AI technology — fast, accurate, and always improving.",
    icon: Brain,
  },
  {
    title: "Server-Side Security",
    description: "API key stays on the server. Never exposed to the client. Your data stays safe.",
    icon: Shield,
  },
  {
    title: "Streaming Responses",
    description: "Real-time streaming tokens for instant feedback. No waiting for full responses.",
    icon: Wifi,
  },
  {
    title: "Markdown Support",
    description: "Beautiful formatted responses with code blocks, tables, and rich text.",
    icon: FileText,
  },
  {
    title: "Conversation History",
    description: "All your chats saved securely. Access any conversation anytime.",
    icon: Globe,
  },
  {
    title: "Code Generation",
    description: "Write, explain, and debug code in any programming language.",
    icon: Code,
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything You Need
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            A modern AI chat experience built for developers and everyone.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="group rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-600/10 hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/10 text-violet-400 group-hover:bg-violet-600/20 transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
