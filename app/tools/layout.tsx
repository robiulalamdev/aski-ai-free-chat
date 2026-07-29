import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Tools",
  description: "AI-powered tools for developers and professionals. Generate code, build resumes, and more with NexaChat.",
  openGraph: {
    title: "AI Tools | NexaChat",
    description: "AI-powered tools for developers and professionals. Generate code, build resumes, and more.",
    url: "https://freeaichat.app/tools",
    siteName: "NexaChat",
    type: "website",
  },
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children
}
