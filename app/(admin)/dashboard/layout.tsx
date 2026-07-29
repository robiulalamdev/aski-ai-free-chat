"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, CreditCard, Shield, LogOut, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { adminLogoutAction } from "@/app/actions/admin"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/dashboard/admins", label: "Admins", icon: Shield },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await adminLogoutAction()
    router.push("/dashboard/login")
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <div className="flex w-72 flex-col border-r border-[var(--border-custom)] bg-[var(--sidebar-bg)]">
        <div className="flex items-center gap-3 border-b border-[var(--border-custom)] px-5 py-4">
          <Link
            href="/"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-custom)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-light)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="text-sm font-bold text-[var(--foreground)]">NexaChat</h2>
            <p className="text-[10px] font-medium text-violet-400 uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
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

        <div className="border-t border-[var(--border-custom)] p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-10">{children}</div>
      </div>
    </div>
  )
}
