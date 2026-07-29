"use client"

import Link from "next/link"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UpgradePrompt({ toolName }: { toolName: string }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/10 mb-4">
          <Lock className="h-8 w-8 text-violet-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">{toolName}</h3>
        <p className="mt-2 text-sm text-zinc-500">
          This tool requires a Pro or Enterprise plan. Upgrade to unlock AI-powered tools.
        </p>
        <Button asChild className="mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
          <Link href="/account/subscription">Upgrade Plan</Link>
        </Button>
      </div>
    </div>
  )
}
