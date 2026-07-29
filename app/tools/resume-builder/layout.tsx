import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resume Builder",
  description: "Build professional resumes with AI assistance. Fill in your details, enhance with AI, and export as PDF or DOC.",
  openGraph: {
    title: "Resume Builder | NexaChat",
    description: "Build professional resumes with AI assistance. Export as PDF or DOC.",
    url: "https://freeaichat.app/tools/resume-builder",
    siteName: "NexaChat",
    type: "website",
  },
}

export default function ResumeBuilderLayout({ children }: { children: React.ReactNode }) {
  return children
}
