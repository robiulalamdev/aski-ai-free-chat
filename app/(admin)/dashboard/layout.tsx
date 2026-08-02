"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Shield,
  LogOut,
  Brain,
  Menu,
  X,
  ChevronLeft,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { adminLogoutAction, getAdminAction } from "@/app/actions/admin"
import { ThemeToggle } from "@/components/providers/theme-toggle"

const NAV_SECTIONS = [
  {
    label: "Menu",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/users", label: "Users", icon: Users },
      { href: "/dashboard/subscriptions", label: "Subscriptions", icon: CreditCard },
      { href: "/dashboard/admins", label: "Admins", icon: Shield },
    ],
  },
]

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Overview", subtitle: "Platform performance at a glance" },
  "/dashboard/users": { title: "Users", subtitle: "Manage registered accounts" },
  "/dashboard/subscriptions": { title: "Subscriptions", subtitle: "Pricing plans and billing" },
  "/dashboard/admins": { title: "Admins", subtitle: "Roles and access control" },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [admin, setAdmin] = useState<{ firstName: string; lastName: string; email: string; role: string } | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    getAdminAction().then((a) => {
      if (a) setAdmin({ firstName: a.firstName, lastName: a.lastName, email: a.email, role: a.role })
    })
  }, [])

  const closeMobile = () => setMobileOpen(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await adminLogoutAction()
    router.push("/dashboard/login")
  }

  const current = PAGE_TITLES[pathname] || { title: "Admin", subtitle: "" }
  const fullName = admin ? `${admin.firstName} ${admin.lastName}` : "Admin"
  const initials = admin ? `${admin.firstName?.[0] ?? ""}${admin.lastName?.[0] ?? ""}` : "A"
  const roleLabel = admin?.role
    ? admin.role.charAt(0) + admin.role.slice(1).toLowerCase()
    : "Admin"

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] shadow-lg shadow-[#7c5cfc]/25">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#14111e]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1a1a2e] dark:text-[#e8e4f0] leading-none">NexaChat</h2>
            <p className="mt-1 text-[10px] font-semibold text-[#7c5cfc] dark:text-[#8b6fff] uppercase tracking-wider">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-[#f0ebff] text-[#7c5cfc] dark:bg-[#7c5cfc]/10 dark:text-[#8b6fff]"
                        : "text-[#6b7280] hover:bg-[#f5f5f7] hover:text-[#1a1a2e] dark:text-[#8b8698] dark:hover:bg-[#231f35] dark:hover:text-[#e8e4f0]"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[#7c5cfc] to-[#6d4ce6]" />
                    )}
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? "text-[#7c5cfc] dark:text-[#8b6fff]" : "text-[#9ca3af] group-hover:text-[#6b7280] dark:group-hover:text-[#8b8698]"
                      )}
                    />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile + Logout */}
      <div className="border-t border-[#e5e7eb] dark:border-[#2a2540] p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] text-xs font-bold text-white shadow-md shadow-[#7c5cfc]/20">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">{fullName}</p>
            <p className="truncate text-[11px] text-[#6b7280] dark:text-[#8b8698]">{roleLabel}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#6b7280] transition-all duration-200 hover:bg-red-50 hover:text-red-500 dark:text-[#8b8698] dark:hover:bg-red-500/10 dark:hover:text-red-400 disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fc] dark:bg-[#0f0d18]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-[#e5e7eb] bg-white dark:border-[#2a2540] dark:bg-[#14111e]">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#e5e7eb] bg-white transition-transform duration-300 lg:hidden dark:border-[#2a2540] dark:bg-[#14111e]",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] shadow-lg shadow-[#7c5cfc]/25">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">NexaChat Admin</span>
          </div>
          <button
            onClick={closeMobile}
            className="rounded-lg p-2 text-[#6b7280] hover:bg-[#f5f5f7] dark:hover:bg-[#231f35]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Main Column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[#e5e7eb] bg-white/80 px-5 py-3.5 backdrop-blur-xl lg:px-8 dark:border-[#2a2540] dark:bg-[#14111e]/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-[#6b7280] hover:bg-[#f5f5f7] lg:hidden dark:hover:bg-[#231f35]"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              href="/"
              className="hidden h-9 w-9 items-center justify-center rounded-xl border border-[#e5e7eb] text-[#6b7280] transition-all duration-200 hover:border-[#7c5cfc]/40 hover:text-[#7c5cfc] lg:flex dark:border-[#2a2540] dark:text-[#8b8698] dark:hover:text-[#8b6fff]"
              title="Back to site"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-[#1a1a2e] dark:text-[#e8e4f0] lg:text-lg">
                {current.title}
              </h1>
              <p className="hidden text-xs text-[#6b7280] sm:block dark:text-[#8b8698]">{current.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="hidden items-center gap-2 rounded-xl border border-[#e5e7eb] px-3.5 py-2 text-xs font-medium text-[#6b7280] transition-colors hover:text-[#7c5cfc] sm:flex dark:border-[#2a2540] dark:text-[#8b8698] dark:hover:text-[#8b6fff]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View site
            </Link>
            <ThemeToggle />
            <div className="flex items-center gap-2.5 rounded-xl border border-[#e5e7eb] py-1.5 pl-1.5 pr-3.5 dark:border-[#2a2540]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] text-xs font-bold text-white">
                {initials}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-xs font-semibold text-[#1a1a2e] leading-tight dark:text-[#e8e4f0]">
                  {fullName}
                </p>
                <p className="text-[10px] text-[#6b7280] dark:text-[#8b8698]">{roleLabel}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">{children}</div>
        </main>
      </div>
    </div>
  )
}
