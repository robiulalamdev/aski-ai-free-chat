"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/50 bg-white/80 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <Brain className="h-6 w-6 text-violet-600" />
          FreeAI Chat
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
            Features
          </Link>
          <Link href="#pricing" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
            Pricing
          </Link>
          <Link href="#faq" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
            FAQ
          </Link>
          <Button asChild variant="premium" size="sm">
            <Link href="/chat">Start Chat</Link>
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      <div className={cn("md:hidden", open ? "block" : "hidden")}>
        <div className="space-y-2 border-t border-zinc-200 bg-white px-4 pb-4 pt-3 dark:border-zinc-800 dark:bg-zinc-950">
          <Link href="#features" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Features
          </Link>
          <Link href="#pricing" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Pricing
          </Link>
          <Link href="#faq" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
            FAQ
          </Link>
          <Button asChild variant="premium" size="sm" className="w-full">
            <Link href="/chat" onClick={() => setOpen(false)}>Start Chat</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
