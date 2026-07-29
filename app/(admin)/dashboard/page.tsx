"use client"

import { useState, useEffect } from "react"
import { Users, MessageSquare, CreditCard, TrendingUp } from "lucide-react"
import { getAdminDashboardStats, getAdminAction } from "@/app/actions/admin"

export default function DashboardOverview() {
  const [stats, setStats] = useState({ totalUsers: 0, totalConversations: 0, totalSubscriptions: 0 })
  const [admin, setAdmin] = useState<{ firstName: string; role: string } | null>(null)

  useEffect(() => {
    getAdminDashboardStats().then(setStats)
    getAdminAction().then(setAdmin)
  }, [])

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "from-violet-600 to-indigo-600" },
    { label: "Conversations", value: stats.totalConversations, icon: MessageSquare, color: "from-purple-600 to-pink-600" },
    { label: "Subscriptions", value: stats.totalSubscriptions, icon: CreditCard, color: "from-indigo-600 to-blue-600" },
    { label: "Revenue", value: "$0", icon: TrendingUp, color: "from-emerald-600 to-teal-600" },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Welcome back, {admin?.firstName || "Admin"}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          <span className="rounded bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-400">{admin?.role || "ADMIN"}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6 transition-all hover:border-violet-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{card.value}</p>
              <p className="text-sm text-zinc-500">{card.label}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6">
          <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <div className="h-2 w-2 rounded-full bg-violet-500" />
              System initialized
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Admin account created
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              Subscription plans seeded
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6">
          <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">System Info</h3>
          <div className="space-y-2">
            {[
              ["Version", "1.0.0"],
              ["AI Model", "Advanced AI"],
              ["Database", "PostgreSQL (Neon)"],
              ["Runtime", "Next.js"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">{label}</span>
                <span className="text-[var(--foreground)] font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
