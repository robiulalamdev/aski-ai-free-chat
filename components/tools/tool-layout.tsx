"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { hasFeatureAction } from "@/app/actions/account"
import type { FeatureSlug } from "@/lib/features"
import { UpgradePrompt } from "./upgrade-prompt"

export function ToolLayout({
  toolName,
  toolSlug,
  featureSlug,
  children,
}: {
  toolName: string
  toolSlug: string
  featureSlug: FeatureSlug
  children: React.ReactNode
}) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  useEffect(() => {
    hasFeatureAction(featureSlug).then((allowed) => setHasAccess(allowed))
  }, [featureSlug])

  if (hasAccess === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="flex h-screen flex-col bg-[var(--background)]">
        <header className="flex h-14 items-center gap-3 border-b border-[var(--border-custom)] bg-[var(--background)] px-4">
          <Link href="/tools" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Tools
          </Link>
          <span className="text-sm font-medium text-white">{toolName}</span>
        </header>
        <UpgradePrompt toolName={toolName} />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-[var(--background)]">
      <header className="flex h-14 items-center gap-3 border-b border-[var(--border-custom)] bg-[var(--background)] px-4">
        <Link href="/tools" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Tools
        </Link>
        <span className="text-sm font-medium text-white">{toolName}</span>
      </header>
      {children}
    </div>
  )
}
