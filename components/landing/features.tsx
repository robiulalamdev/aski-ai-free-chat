import {
  Shield,
  Wifi,
  FileText,
  Code,
  Brain,
  Share2,
  Users,
  BarChart3,
  Wrench,
  FileCode,
  FileUser,
} from "lucide-react";

const features = [
  {
    title: "AI-Powered Chat",
    description:
      "Powered by AI via OpenRouter. Fast, accurate responses with real-time streaming.",
    icon: Brain,
  },
  {
    title: "AI Tools",
    description:
      "Code Generator, Resume Builder, and more. Build projects and documents with AI assistance.",
    icon: Wrench,
  },
  {
    title: "Code Generator",
    description:
      "Describe what you want, get working HTML/CSS/JS code with live preview. Download as ZIP.",
    icon: FileCode,
  },
  {
    title: "Resume Builder",
    description:
      "Build professional resumes with AI enhancement. Export as PDF or DOC in seconds.",
    icon: FileUser,
  },
  {
    title: "Secure Authentication",
    description:
      "Server-side JWT authentication with httpOnly cookies. Your account and data are protected.",
    icon: Shield,
  },
  {
    title: "Streaming Responses",
    description:
      "See AI responses in real-time as they're generated. No waiting for the full answer.",
    icon: Wifi,
  },
  {
    title: "Share Conversations",
    description:
      "Share any chat via a public link. Others can read your shared conversations.",
    icon: Share2,
  },
  {
    title: "Conversation History",
    description:
      "All chats saved securely in PostgreSQL. Access any conversation from any device.",
    icon: FileText,
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Everything You Need
          </h2>
          <p className="mt-4 text-lg text-[var(--muted)]">
            A modern AI chat platform built for individuals and teams.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-600/10 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/10 text-violet-400 group-hover:bg-violet-600/20 transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
