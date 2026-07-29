"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Brain, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getCurrentUserAction, logoutAction } from "@/app/actions/auth"

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<{ firstName: string } | null>(null)

  useEffect(() => {
    getCurrentUserAction().then((u) => { if (u) setUser(u) }).catch(() => {})
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleLogout = async () => {
    await logoutAction()
  }

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled
        ? "border-b border-[var(--border-custom)] bg-[var(--background)]/90 backdrop-blur-xl shadow-lg shadow-black/20"
        : "bg-transparent"
    )}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/20">
            <Brain className="h-4 w-4 text-white" />
          </div>
          NexaChat
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link href="#features" className="rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/tools" className="rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
            Tools
          </Link>
          <Link href="#pricing" className="rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="#faq" className="rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
            FAQ
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Button asChild variant="ghost" className="text-zinc-400 hover:text-white">
                <Link href="/chat/new">{user.firstName}</Link>
              </Button>
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-zinc-500 hover:text-red-400 gap-1.5">
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-zinc-400 hover:text-white">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/20">
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden text-zinc-400 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      <div className={cn("md:hidden transition-all duration-300", open ? "block" : "hidden")}>
        <div className="space-y-1 border-t border-[var(--border-custom)] bg-[var(--background)]/95 backdrop-blur-xl px-4 pb-4 pt-3">
          <Link href="#features" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-[var(--surface)] hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/tools" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-[var(--surface)] hover:text-white transition-colors">
            Tools
          </Link>
          <Link href="#pricing" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-[var(--surface)] hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="#faq" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-[var(--surface)] hover:text-white transition-colors">
            FAQ
          </Link>
          <div className="my-2 border-t border-[var(--border-custom)]" />
          {user ? (
            <>
              <Link href="/chat/new" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-[var(--surface)] hover:text-white transition-colors">
                Go to Chat
              </Link>
              <button onClick={() => { handleLogout(); setOpen(false) }} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-[var(--surface)] hover:text-white transition-colors">
                Sign In
              </Link>
              <Button asChild className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                <Link href="/signup" onClick={() => setOpen(false)}>Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
