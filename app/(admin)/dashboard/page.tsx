"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Users,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Activity,
  Server,
  ArrowUpRight,
  ArrowRight,
  UserPlus,
  DollarSign,
  Sparkles,
} from "lucide-react"
import { getAdminDashboardStats, getAdminAction } from "@/app/actions/admin"
import { cn } from "@/lib/utils"

interface DashboardStats {
  totalUsers: number
  totalConversations: number
  totalMessages: number
  totalSubscriptions: number
  paidUsers: number
  activeSubscriptions: number
  monthlyRevenue: number
  planDistribution: { plan: string; count: number }[]
  recentUsers: { id: string; firstName: string; lastName: string; email: string; plan: string; createdAt: Date }[]
  weeklySignups: { date: string; full: string; count: number }[]
}

const PLAN_STYLES: Record<string, { bg: string; text: string; bar: string }> = {
  free: { bg: "bg-[#f1f3f9] dark:bg-[#231f35]", text: "text-[#6b7280] dark:text-[#8b8698]", bar: "bg-[#9ca3af]" },
  pro: { bg: "bg-[#f0ebff] dark:bg-[#7c5cfc]/10", text: "text-[#7c5cfc] dark:text-[#8b6fff]", bar: "bg-[#7c5cfc]" },
  enterprise: { bg: "bg-[#dbeafe] dark:bg-blue-900/30", text: "text-[#3b82f6] dark:text-blue-400", bar: "bg-[#3b82f6]" },
}

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return `${n}`
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [admin, setAdmin] = useState<{ firstName: string; role: string } | null>(null)

  useEffect(() => {
    getAdminDashboardStats().then((s) => setStats(s as DashboardStats))
    getAdminAction().then((a) => {
      if (a) setAdmin({ firstName: a.firstName, role: a.role })
    })
  }, [])

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#7c5cfc]/20 border-t-[#7c5cfc]" />
          </div>
          <p className="text-sm text-[#6b7280] dark:text-[#8b8698]">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const totalPlanUsers = stats.planDistribution.reduce((sum, p) => sum + p.count, 0) || 1
  const lastWeekSignups = stats.weeklySignups.reduce((sum, d) => sum + d.count, 0)
  const maxSignups = Math.max(...stats.weeklySignups.map((d) => d.count), 1)
  const conversionRate = stats.totalUsers > 0 ? ((stats.paidUsers / stats.totalUsers) * 100).toFixed(1) : "0"

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      sub: `${stats.paidUsers.toLocaleString()} paid accounts`,
      icon: Users,
      tile: "from-[#7c5cfc] to-[#6d4ce6]",
      shadow: "shadow-[#7c5cfc]/25",
      link: "/dashboard/users",
    },
    {
      label: "Conversations",
      value: stats.totalConversations.toLocaleString(),
      sub: `${formatCompact(stats.totalMessages)} total messages`,
      icon: MessageSquare,
      tile: "from-[#8b5cf6] to-[#a78bfa]",
      shadow: "shadow-[#8b5cf6]/25",
      link: "/dashboard/users",
    },
    {
      label: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      sub: `${stats.activeSubscriptions} active subscriptions`,
      icon: DollarSign,
      tile: "from-[#10b981] to-[#059669]",
      shadow: "shadow-[#10b981]/25",
      link: "/dashboard/subscriptions",
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      sub: "free to paid",
      icon: TrendingUp,
      tile: "from-[#f59e0b] to-[#d97706]",
      shadow: "shadow-[#f59e0b]/25",
      link: "/dashboard/subscriptions",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#e5e7eb] bg-gradient-to-br from-white to-[#f6f3ff] p-6 lg:p-8 dark:border-[#2a2540] dark:from-[#1a1726] dark:to-[#14111e]">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#7c5cfc]/10 blur-3xl" />
        <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-[#8b5cf6]/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-[#7c5cfc] dark:text-[#8b6fff]">{today}</p>
            <h1 className="mt-1 text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0] lg:text-3xl">
              Welcome back, {admin?.firstName || "Admin"}
            </h1>
            <p className="mt-2 text-sm text-[#6b7280] dark:text-[#8b8698]">
              Here&apos;s what&apos;s happening across your platform today.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#f0ebff] px-4 py-2.5 dark:bg-[#7c5cfc]/10">
            <Sparkles className="h-4 w-4 text-[#7c5cfc] dark:text-[#8b6fff]" />
            <span className="text-xs font-semibold uppercase tracking-wide text-[#7c5cfc] dark:text-[#8b6fff]">
              {admin?.role?.replace(/_/g, " ") || "ADMIN"}
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.link}
              className="group glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg", card.tile, card.shadow)}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f1f3f9] text-[#9ca3af] transition-all duration-300 group-hover:bg-[#f0ebff] group-hover:text-[#7c5cfc] dark:bg-[#231f35] dark:group-hover:bg-[#7c5cfc]/10 dark:group-hover:text-[#8b6fff]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-5 text-3xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">{card.value}</p>
              <p className="mt-1 text-sm font-medium text-[#6b7280] dark:text-[#8b8698]">{card.label}</p>
              <p className="mt-1 text-xs text-[#9ca3af]">{card.sub}</p>
            </Link>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Signups Chart */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7c5cfc]/10 dark:bg-[#7c5cfc]/10">
                <Activity className="h-5 w-5 text-[#7c5cfc] dark:text-[#8b6fff]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">New Users</h3>
                <p className="text-xs text-[#6b7280] dark:text-[#8b8698]">Signups over the last 7 days</p>
              </div>
            </div>
            <span className="rounded-lg bg-[#f0ebff] px-3 py-1.5 text-xs font-semibold text-[#7c5cfc] dark:bg-[#7c5cfc]/10 dark:text-[#8b6fff]">
              {lastWeekSignups} this week
            </span>
          </div>
          <div className="flex h-44 items-end gap-2 sm:gap-3">
            {stats.weeklySignups.map((day, i) => (
              <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-medium text-[#6b7280] opacity-0 transition-opacity group-hover:opacity-100 dark:text-[#8b8698]">
                  {day.count}
                </span>
                <div
                  className="w-full max-w-[44px] rounded-lg bg-gradient-to-t from-[#6d4ce6] to-[#a78bfa] transition-all duration-300 group-hover:from-[#7c5cfc] group-hover:to-[#c4b5fd]"
                  style={{ height: `${Math.max((day.count / maxSignups) * 100, day.count > 0 ? 8 : 3)}%` }}
                />
                <span className="text-[10px] text-[#9ca3af]">{day.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="glass-card rounded-2xl p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebff] dark:bg-[#7c5cfc]/10">
              <CreditCard className="h-5 w-5 text-[#7c5cfc] dark:text-[#8b6fff]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Plan Distribution</h3>
              <p className="text-xs text-[#6b7280] dark:text-[#8b8698]">Users by subscription plan</p>
            </div>
          </div>
          <div className="space-y-5">
            {stats.planDistribution.length === 0 ? (
              <p className="text-sm text-[#6b7280] dark:text-[#8b8698]">No users yet.</p>
            ) : (
              stats.planDistribution.map((dist) => {
                const style = PLAN_STYLES[dist.plan] || PLAN_STYLES.free
                const pct = (dist.count / totalPlanUsers) * 100
                return (
                  <div key={dist.plan}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs font-medium text-[#6b7280] dark:text-[#8b8698]">
                        {PLAN_LABELS[dist.plan] || dist.plan}
                      </span>
                      <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold", style.bg, style.text)}>
                        {dist.count}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#f1f3f9] dark:bg-[#231f35]">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", style.bar)}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
          <Link
            href="/dashboard/subscriptions"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] py-2.5 text-xs font-medium text-[#6b7280] transition-colors hover:border-[#7c5cfc]/40 hover:text-[#7c5cfc] dark:border-[#2a2540] dark:text-[#8b8698] dark:hover:text-[#8b6fff]"
          >
            Manage plans
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Users */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebff] dark:bg-[#7c5cfc]/10">
                <UserPlus className="h-5 w-5 text-[#7c5cfc] dark:text-[#8b6fff]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Recent Signups</h3>
                <p className="text-xs text-[#6b7280] dark:text-[#8b8698]">Latest users to join the platform</p>
              </div>
            </div>
            <Link
              href="/dashboard/users"
              className="flex items-center gap-1.5 text-xs font-medium text-[#7c5cfc] transition-colors hover:text-[#6d4ce6] dark:text-[#8b6fff]"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-[#f1f3f9] dark:divide-[#231f35]">
            {stats.recentUsers.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#6b7280] dark:text-[#8b8698]">No users yet.</p>
            ) : (
              stats.recentUsers.map((user) => {
                const planStyle = PLAN_STYLES[user.plan] || PLAN_STYLES.free
                return (
                  <div key={user.id} className="flex items-center gap-3 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] text-xs font-bold text-white shadow-md shadow-[#7c5cfc]/20">
                      {user.firstName.charAt(0).toUpperCase()}
                      {user.lastName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="truncate text-xs text-[#6b7280] dark:text-[#8b8698]">{user.email}</p>
                    </div>
                    <span className={cn("hidden rounded-md px-2 py-1 text-xs font-semibold sm:inline-block", planStyle.bg, planStyle.text)}>
                      {PLAN_LABELS[user.plan] || user.plan}
                    </span>
                    <span className="hidden text-xs text-[#9ca3af] md:block">
                      {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="glass-card rounded-2xl p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebff] dark:bg-[#7c5cfc]/10">
              <Server className="h-5 w-5 text-[#7c5cfc] dark:text-[#8b6fff]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">System Info</h3>
              <p className="text-xs text-[#6b7280] dark:text-[#8b8698]">Platform status</p>
            </div>
          </div>
          <div className="space-y-1">
            {[
              ["Version", "1.0.0"],
              ["AI Model", "Advanced AI"],
              ["Database", "PostgreSQL"],
              ["Runtime", "Next.js"],
              ["Plans", `${stats.totalSubscriptions} configured`],
              ["Status", "Operational"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[#f8f9fc] dark:hover:bg-[#231f35]/40">
                <span className="text-[#6b7280] dark:text-[#8b8698]">{label}</span>
                <span className="flex items-center gap-1.5 font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">
                  {label === "Status" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
