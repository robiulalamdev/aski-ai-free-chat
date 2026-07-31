"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Brain, LogOut, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getCurrentUserAction, logoutAction } from "@/app/actions/auth"
import { ThemeToggle } from "@/components/providers/theme-toggle"

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
        ? "border-b border-[#e2e5f1]/50 dark:border-[#2a2540]/50 bg-white/80 dark:bg-[#0f0d18]/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20"
        : "bg-transparent"
    )}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] shadow-lg shadow-[#7c5cfc]/25 transition-all duration-300 hover:shadow-[#7c5cfc]/40 hover:brightness-110">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">NexaChat</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          <Link href="#features" className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#6b7280] hover:text-[#1a1a2e] hover:bg-[#f1f3f9]/80 dark:hover:text-[#e8e4f0] dark:hover:bg-[#231f35]/80 transition-all duration-200">
            Features
          </Link>
          <Link href="#pricing" className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#6b7280] hover:text-[#1a1a2e] hover:bg-[#f1f3f9]/80 dark:hover:text-[#e8e4f0] dark:hover:bg-[#231f35]/80 transition-all duration-200">
            Pricing
          </Link>
          <Link href="#faq" className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#6b7280] hover:text-[#1a1a2e] hover:bg-[#f1f3f9]/80 dark:hover:text-[#e8e4f0] dark:hover:bg-[#231f35]/80 transition-all duration-200">
            FAQ
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {user ? (
            <>
              <Button asChild variant="ghost" className="text-[#6b7280] hover:text-[#1a1a2e] dark:hover:text-[#e8e4f0] font-medium">
                <Link href="/chat/new">{user.firstName}</Link>
              </Button>
              <Button onClick={handleLogout} variant="ghost" size="icon" className="text-[#6b7280] hover:text-red-500 dark:hover:text-red-400">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-[#6b7280] hover:text-[#1a1a2e] dark:hover:text-[#e8e4f0] font-medium">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] hover:from-[#6d4ce6] hover:to-[#5d3cd6] text-white shadow-lg shadow-[#7c5cfc]/25 transition-all duration-300 hover:shadow-[#7c5cfc]/40 hover:brightness-110 px-5">
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="text-[#6b7280] hover:text-[#1a1a2e] dark:hover:text-[#e8e4f0]" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={cn("md:hidden transition-all duration-300", open ? "block" : "hidden")}>
        <div className="space-y-1 border-t border-[#e2e5f1]/50 dark:border-[#2a2540]/50 bg-white/95 dark:bg-[#0f0d18]/95 backdrop-blur-xl px-4 pb-4 pt-3">
          <Link href="#features" onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-[#6b7280] hover:bg-[#f1f3f9] hover:text-[#1a1a2e] dark:hover:bg-[#231f35] dark:hover:text-[#e8e4f0] transition-all duration-200">
            Features
          </Link>
          <Link href="#pricing" onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-[#6b7280] hover:bg-[#f1f3f9] hover:text-[#1a1a2e] dark:hover:bg-[#231f35] dark:hover:text-[#e8e4f0] transition-all duration-200">
            Pricing
          </Link>
          <Link href="#faq" onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-[#6b7280] hover:bg-[#f1f3f9] hover:text-[#1a1a2e] dark:hover:bg-[#231f35] dark:hover:text-[#e8e4f0] transition-all duration-200">
            FAQ
          </Link>
          <div className="my-2 border-t border-[#e2e5f1]/50 dark:border-[#2a2540]/50" />
          {user ? (
            <>
              <Link href="/chat/new" onClick={() => setOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-[#6b7280] hover:bg-[#f1f3f9] hover:text-[#1a1a2e] dark:hover:bg-[#231f35] dark:hover:text-[#e8e4f0] transition-all duration-200">
                Go to Chat
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button onClick={() => { handleLogout(); setOpen(false) }} className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-[#6b7280] hover:bg-[#f1f3f9] hover:text-[#1a1a2e] dark:hover:bg-[#231f35] dark:hover:text-[#e8e4f0] transition-all duration-200">
                Sign In
              </Link>
              <Button asChild className="w-full bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] text-white shadow-lg shadow-[#7c5cfc]/25 mt-2">
                <Link href="/signup" onClick={() => setOpen(false)}>
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
