"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Code, FileText, Lock, ArrowLeft, Loader2 } from "lucide-react"
import { hasFeatureAction } from "@/app/actions/account"
import { FEATURES } from "@/lib/features"

const tools = [
  {
    name: "Code Generator",
    description: "Generate HTML, CSS, and JavaScript projects with live preview. Describe what you want and get working code instantly.",
    icon: Code,
    href: "/tools/code-generator",
    feature: FEATURES.CODE_GENERATOR,
    color: "from-emerald-600 to-teal-600",
  },
  {
    name: "Resume Builder",
    description: "Build professional resumes with AI assistance. Fill in your details, enhance with AI, and export as PDF or DOC.",
    icon: FileText,
    href: "/tools/resume-builder",
    feature: FEATURES.RESUME_BUILDER,
    color: "from-orange-600 to-amber-600",
  },
]

export default function ToolsPage() {
  const [accessMap, setAccessMap] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all(
      tools.map(async (tool) => {
        const has = await hasFeatureAction(tool.feature)
        return [tool.feature, has] as const
      })
    ).then((results) => {
      const map: Record<string, boolean> = {}
      for (const [slug, has] of results) map[slug] = has
      setAccessMap(map)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border-custom)] bg-[var(--background)]">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <Link href="/chat/new" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Chat
          </Link>
          <span className="text-sm font-medium text-white">AI Tools</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white">AI-Powered Tools</h1>
          <p className="mt-2 text-zinc-400">Build projects, create documents, and more with AI assistance.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon
            const hasAccess = accessMap[tool.feature] ?? false

            return (
              <Link
                key={tool.name}
                href={hasAccess ? tool.href : "/account/subscription"}
                className="group relative rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-600/10 hover:-translate-y-1"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{tool.name}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{tool.description}</p>

                {!hasAccess && (
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 text-xs text-violet-400">
                    <Lock className="h-3 w-3" />
                    Pro Plan Required
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
