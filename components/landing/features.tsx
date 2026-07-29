import { Shield, Server, Wifi, Zap, FileText, Code } from "lucide-react"

const features = [
  {
    title: "Advanced AI",
    description: "Powered by cutting-edge AI technology — fast, accurate, and always improving.",
    icon: Zap,
  },
  {
    title: "Server-Side",
    description: "API key stays on the server. Never exposed to the client.",
    icon: Server,
  },
  {
    title: "Streaming Responses",
    description: "Real-time streaming tokens for instant feedback.",
    icon: Wifi,
  },
  {
    title: "Markdown Support",
    description: "Beautiful formatted responses with code blocks and tables.",
    icon: FileText,
  },
  {
    title: "Conversation History",
    description: "All your chats saved locally in your browser.",
    icon: Shield,
  },
  {
    title: "Open Source",
    description: "Transparent, auditable, and community-driven development.",
    icon: Code,
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-[#1e1929]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything You Need
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            A modern AI chat experience powered by advanced AI.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="group rounded-2xl border border-[#2e2840] bg-[#231e30] p-6 transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-600/10 hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/10 text-violet-400">
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