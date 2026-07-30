"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  User,
  Settings,
  Shield,
  CreditCard,
  Receipt,
  Wallet,
  BarChart3,
  Users,
  Webhook,
  Headphones,
  Menu,
  X,
  LogOut,
  Loader2,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getAccountAction } from "@/app/actions/account"
import { logoutAction } from "@/app/actions/auth"
import { ThemeToggle } from "@/components/providers/theme-toggle"

const navSections = [
  {
    label: "ACCOUNT",
    items: [
      { href: "/account", label: "Account", icon: User },
      { href: "/account/settings", label: "Settings", icon: Settings },
      { href: "/account/security", label: "Security", icon: Shield },
    ],
  },
  {
    label: "BILLING",
    items: [
      { href: "/account/subscription", label: "Subscription", icon: CreditCard },
      { href: "/account/billing-history", label: "Billing History", icon: Receipt },
      { href: "/account/payment-methods", label: "Payment Methods", icon: Wallet },
    ],
  },
  {
    label: "WORKSPACE",
    items: [
      { href: "/account/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/account/team", label: "Team", icon: Users },
      { href: "/account/integrations", label: "Integrations", icon: Webhook },
    ],
  },
]

interface UserData {
  firstName: string
  lastName: string
  email: string
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    getAccountAction().then((u) => {
      if (u) setUser(u)
    })
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    setLoggingOut(true)
    await logoutAction()
    router.push("/login")
  }

  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7c5cfc]">
          <span className="text-sm font-bold text-white">N</span>
        </div>
        <span className="text-lg font-bold text-[#1a1a2e]">NexaChat</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {navSections.map((section, idx) => (
          <div key={section.label} className={cn(idx > 0 && "mt-6")}>
            <p className="mb-2 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
              {section.label}
            </p>
            {section.items.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors mb-0.5",
                    isActive
                      ? "bg-[#f0ebff] text-[#7c5cfc] border border-[#7c5cfc]/20"
                      : "text-[#6b7280] hover:bg-[#f5f5f7] hover:text-[#1a1a2e]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Help Section */}
      <div className="px-4 pb-3">
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4">
          <h4 className="text-sm font-semibold text-[#1a1a2e]">Need help?</h4>
          <p className="mt-1 text-xs text-[#6b7280] leading-relaxed">Our support team is here to help you 24/7</p>
          <Link
            href="/support"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#1a1a2e] transition-colors hover:bg-[#f5f5f7]"
          >
            <Headphones className="h-4 w-4" />
            Contact Support
          </Link>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-[#e5e7eb] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] text-sm font-bold text-white">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1a1a2e] truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-[#6b7280] truncate">{user?.email}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
        </div>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:h-screen lg:sticky lg:top-0 bg-white border-r border-[#e5e7eb]">
        {sidebarContent}
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/chat/new" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7c5cfc]">
              <span className="text-sm font-bold text-white">N</span>
            </div>
            <span className="text-lg font-bold text-[#1a1a2e]">NexaChat</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-[#6b7280] hover:bg-[#f5f5f7]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {sidebarContent}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex items-center gap-3 border-b border-[#e5e7eb] bg-white px-4 py-3 lg:hidden sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-[#6b7280] hover:bg-[#f5f5f7]"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/chat/new" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7c5cfc]">
              <span className="text-xs font-bold text-white">N</span>
            </div>
            <span className="text-base font-bold text-[#1a1a2e]">NexaChat</span>
          </Link>
        </div>

        {/* Page Content */}
        <div className="px-8 py-10 lg:px-12 lg:py-12">
          {children}
        </div>
      </div>
    </div>
  )
}
