"use client"

import { useState, useEffect } from "react"
import { Users, MessageSquare, CreditCard, TrendingUp, Activity, Server } from "lucide-react"
import { getAdminDashboardStats, getAdminAction } from "@/app/actions/admin"

export default function DashboardOverview() {
  const [stats, setStats] = useState({ totalUsers: 0, totalConversations: 0, totalSubscriptions: 0 })
  const [admin, setAdmin] = useState<{ firstName: string; role: string } | null>(null)

  useEffect(() => {
    getAdminDashboardStats().then(setStats)
    getAdminAction().then(setAdmin)
  }, [])

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "from-[#7c5cfc] to-[#6d4ce6]", shadow: "shadow-[#7c5cfc]/20" },
    { label: "Conversations", value: stats.totalConversations, icon: MessageSquare, color: "from-[#a78bfa] to-[#8b5cf6]", shadow: "shadow-[#a78bfa]/20" },
    { label: "Subscriptions", value: stats.totalSubscriptions, icon: CreditCard, color: "from-[#6d4ce6] to-[#5b3fd4]", shadow: "shadow-[#6d4ce6]/20" },
    { label: "Revenue", value: "$0", icon: TrendingUp, color: "from-[#10b981] to-[#059669]", shadow: "shadow-[#10b981]/20" },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">
          Welcome back, {admin?.firstName || "Admin"}
        </h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          <span className="rounded-lg bg-[#7c5cfc]/10 px-2.5 py-1 text-xs font-semibold text-[#7c5cfc]">{admin?.role || "ADMIN"}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} shadow-lg ${card.shadow}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">{card.value}</p>
              <p className="text-sm text-[#6b7280] mt-1">{card.label}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7c5cfc]/10">
              <Activity className="h-5 w-5 text-[#7c5cfc]" />
            </div>
            <h3 className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-[#6b7280]">
              <div className="h-2 w-2 rounded-full bg-[#7c5cfc]" />
              System initialized
            </div>
            <div className="flex items-center gap-3 text-sm text-[#6b7280]">
              <div className="h-2 w-2 rounded-full bg-[#10b981]" />
              Admin account created
            </div>
            <div className="flex items-center gap-3 text-sm text-[#6b7280]">
              <div className="h-2 w-2 rounded-full bg-[#6d4ce6]" />
              Subscription plans seeded
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7c5cfc]/10">
              <Server className="h-5 w-5 text-[#7c5cfc]" />
            </div>
            <h3 className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">System Info</h3>
          </div>
          <div className="space-y-3">
            {[
              ["Version", "1.0.0"],
              ["AI Model", "Advanced AI"],
              ["Database", "PostgreSQL (Neon)"],
              ["Runtime", "Next.js"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-[#6b7280]">{label}</span>
                <span className="text-[#1a1a2e] dark:text-[#e8e4f0] font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
