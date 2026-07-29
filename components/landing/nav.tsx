"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Brain, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getCurrentUserAction, logoutAction } from "@/app/actions/auth"

export function Nav() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<{ firstName: string } | null>(null)

  useEffect(() => {
    getCurrentUserAction().then((u) => { if (u) setUser(u) }).catch(() => {})
  }, [])

  const handleLogout = async () => {
    await logoutAction()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#2e2840]/50 bg-[#1e1929]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
            <Brain className="h-4 w-4 text-white" />
          </div>
          FreeAI
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="#faq" className="text-sm text-zinc-400 hover:text-white transition-colors">
            FAQ
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/chat" className="text-sm text-zinc-300 hover:text-white transition-colors">
                {user.firstName}
              </Link>
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-zinc-400 hover:text-red-400 gap-1.5">
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" className="text-zinc-400 hover:text-white">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-600/20">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden text-zinc-400 hover:text-white hover:bg-[#2a2438]" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      <div className={cn("md:hidden", open ? "block" : "hidden")}>
        <div className="space-y-2 border-t border-[#2e2840] bg-[#1e1929] px-4 pb-4 pt-3">
          <Link href="#features" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-[#2a2438] hover:text-white">
            Features
          </Link>
          <Link href="#pricing" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-[#2a2438] hover:text-white">
            Pricing
          </Link>
          <Link href="#faq" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-[#2a2438] hover:text-white">
            FAQ
          </Link>
          {user ? (
            <>
              <Link href="/chat" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-[#2a2438] hover:text-white">
                Go to Chat
              </Link>
              <button onClick={() => { handleLogout(); setOpen(false) }} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-[#2a2438]">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-[#2a2438] hover:text-white">
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
