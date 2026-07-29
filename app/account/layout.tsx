"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Settings, Shield, CreditCard, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/account", label: "Account", icon: User },
  { href: "/account/settings", label: "Settings", icon: Settings },
  { href: "/account/security", label: "Security", icon: Shield },
  { href: "/account/subscription", label: "Subscription", icon: CreditCard },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Left Sidebar */}
      <div className="flex w-72 flex-col border-r border-[var(--border-custom)] bg-[var(--sidebar-bg)]">
        <div className="flex items-center gap-3 border-b border-[var(--border-custom)] px-5 py-4">
          <Link
            href="/c"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-custom)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-light)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Account</h2>
        </div>

        <nav className="flex-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors mb-1",
                  isActive
                    ? "bg-gradient-to-r from-violet-600/10 to-indigo-600/10 text-violet-400 border border-violet-500/20"
                    : "text-zinc-400 hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Right Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-8 py-10">
          {children}
        </div>
      </div>
    </div>
  )
}
