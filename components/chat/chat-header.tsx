"use client"

import Link from "next/link"
import { Brain, Menu, PanelLeftClose, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ChatHeader({
  title,
  onToggleSidebar,
  sidebarOpen,
  onRegenerate,
}: {
  title: string
  onToggleSidebar: () => void
  sidebarOpen: boolean
  onRegenerate?: () => void
}) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="lg:hidden">
          <Menu className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="hidden lg:flex">
          {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-violet-600" />
          <span className="hidden text-sm font-medium sm:inline">FreeAI Chat</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden truncate text-sm text-zinc-500 sm:inline dark:text-zinc-400">
          {title}
        </span>
        {onRegenerate && (
          <Button variant="ghost" size="icon" onClick={onRegenerate} title="Regenerate response">
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
    </header>
  )
}
