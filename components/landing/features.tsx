import {
  Shield,
  Wifi,
  FileText,
  Brain,
  Share2,
  Wrench,
  FileCode,
  FileUser,
} from "lucide-react"

const features = [
  {
    title: "AI-Powered Chat",
    description:
      "Powered by advanced AI. Fast, accurate responses with real-time streaming.",
    icon: Brain,
    color: "#8b6fff",
    bg: "rgba(139, 111, 255, 0.1)",
  },
  {
    title: "AI Tools",
    description:
      "Code Generator, Resume Builder, and more. Build projects and documents with AI assistance.",
    icon: Wrench,
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.1)",
  },
  {
    title: "Code Generator",
    description:
      "Describe what you want, get working HTML/CSS/JS code with live preview. Download as ZIP.",
    icon: FileCode,
    color: "#22c55e",
    bg: "rgba(34, 197, 94, 0.1)",
  },
  {
    title: "Resume Builder",
    description:
      "Build professional resumes with AI enhancement. Export as PDF or DOC in seconds.",
    icon: FileUser,
    color: "#f97316",
    bg: "rgba(249, 115, 22, 0.1)",
  },
  {
    title: "Secure Authentication",
    description:
      "Server-side JWT authentication with httpOnly cookies. Your account and data are protected.",
    icon: Shield,
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.1)",
  },
  {
    title: "Streaming Responses",
    description:
      "See AI responses in real-time as they're generated. No waiting for the full answer.",
    icon: Wifi,
    color: "#06b6d4",
    bg: "rgba(6, 182, 212, 0.1)",
  },
  {
    title: "Share Conversations",
    description:
      "Share any chat via a public link. Others can read your shared conversations.",
    icon: Share2,
    color: "#ec4899",
    bg: "rgba(236, 72, 153, 0.1)",
  },
  {
    title: "Conversation History",
    description:
      "All chats saved securely. Access any conversation from any device.",
    icon: FileText,
    color: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.1)",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--badge-bg)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
            Features
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A modern AI chat platform built for individuals and teams.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="glass-card group rounded-2xl p-6 hover-glow cursor-default"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
                  style={{ backgroundColor: feature.bg }}
                >
                  <Icon className="h-6 w-6" style={{ color: feature.color }} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
