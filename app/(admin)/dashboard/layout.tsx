"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, CreditCard, Shield, LogOut, ChevronLeft, Brain } from "lucide-react"
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
    <div className="flex h-screen bg-[#f8f9fc] dark:bg-[#0f0d18]">
      {/* Sidebar */}
      <div className="hidden lg:flex w-72 flex-col border-r border-[#e2e5f1] dark:border-[#2a2540] bg-white/80 dark:bg-[#1a1726]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-[#e2e5f1] dark:border-[#2a2540] px-5 py-5">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1f3f9] dark:bg-[#231f35] text-[#6b7280] hover:bg-[#f0ebff] dark:hover:bg-[#7c5cfc]/10 hover:text-[#7c5cfc] transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] shadow-lg shadow-[#7c5cfc]/20">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">NexaChat</h2>
              <p className="text-[10px] font-semibold text-[#7c5cfc] uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-[#7c5cfc]/10 to-[#6d4ce6]/10 text-[#7c5cfc] border border-[#7c5cfc]/20"
                    : "text-[#6b7280] hover:bg-[#f1f3f9] dark:hover:bg-[#231f35] hover:text-[#1a1a2e] dark:hover:text-[#e8e4f0]"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-[#e2e5f1] dark:border-[#2a2540] p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#6b7280] transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-[#e2e5f1] dark:border-[#2a2540] bg-white/80 dark:bg-[#1a1726]/80 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6]">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#6b7280] hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">{children}</div>
      </div>
    </div>
  )
}
