import {
  Shield,
  Wifi,
  FileText,
  Brain,
  Share2,
  Wrench,
  FileCode,
  FileUser,
  Sparkles,
  Zap,
  Lock,
  Globe,
} from "lucide-react";

const features = [
  {
    title: "AI-Powered Chat",
    description:
      "Powered by advanced AI. Fast, accurate responses with real-time streaming.",
    icon: Brain,
    color: "#7c5cfc",
    bg: "#f0ebff",
  },
  {
    title: "AI Tools",
    description:
      "Code Generator, Resume Builder, and more. Build projects and documents with AI assistance.",
    icon: Wrench,
    color: "#8b5cf6",
    bg: "#f3e8ff",
  },
  {
    title: "Code Generator",
    description:
      "Describe what you want, get working HTML/CSS/JS code with live preview. Download as ZIP.",
    icon: FileCode,
    color: "#22c55e",
    bg: "#dcfce7",
  },
  {
    title: "Resume Builder",
    description:
      "Build professional resumes with AI enhancement. Export as PDF or DOC in seconds.",
    icon: FileUser,
    color: "#f97316",
    bg: "#ffedd5",
  },
  {
    title: "Secure Authentication",
    description:
      "Server-side JWT authentication with httpOnly cookies. Your account and data are protected.",
    icon: Shield,
    color: "#3b82f6",
    bg: "#dbeafe",
  },
  {
    title: "Streaming Responses",
    description:
      "See AI responses in real-time as they're generated. No waiting for the full answer.",
    icon: Wifi,
    color: "#06b6d4",
    bg: "#cffafe",
  },
  {
    title: "Share Conversations",
    description:
      "Share any chat via a public link. Others can read your shared conversations.",
    icon: Share2,
    color: "#ec4899",
    bg: "#fce7f3",
  },
  {
    title: "Conversation History",
    description:
      "All chats saved securely. Access any conversation from any device.",
    icon: FileText,
    color: "#8b5cf6",
    bg: "#ede9fe",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-[#f8f9fc] dark:bg-[#0f0d18]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#1a1a2e] dark:text-[#e8e4f0] sm:text-4xl">
            Everything You Need
          </h2>
          <p className="mt-4 text-lg text-[#6b7280]">
            A modern AI chat platform built for individuals and teams.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-card group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover-glow cursor-default"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
                  style={{ backgroundColor: feature.bg }}
                >
                  <Icon className="h-6 w-6" style={{ color: feature.color }} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-[#6b7280] leading-relaxed">
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
