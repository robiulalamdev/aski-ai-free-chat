import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Code Generator",
  description: "Generate HTML, CSS, and JavaScript projects with live preview. Describe what you want and get working code instantly.",
  openGraph: {
    title: "Code Generator | NexaChat",
    description: "Generate HTML, CSS, and JavaScript projects with live preview.",
    url: "https://freeaichat.app/tools/code-generator",
    siteName: "NexaChat",
    type: "website",
  },
}

export default function CodeGeneratorLayout({ children }: { children: React.ReactNode }) {
  return children
}
