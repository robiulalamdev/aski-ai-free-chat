"use client"

import { useState, useEffect } from "react"
import { Loader2, BarChart3, MessageSquare, Users, Zap, Calendar } from "lucide-react"
import { getAnalytics } from "@/app/actions/analytics"

interface AnalyticsData {
  plan: string
  tokensUsedToday: number
  tokensLimit: number
  totalConversations: number
  totalMessages: number
  userMessages: number
  assistantMessages: number
  messagesThisWeek: number
  messagesThisMonth: number
  dailyUsage: { date: string; count: number }[]
  topConversations: { title: string; messageCount: number; createdAt: Date }[]
  memberSince: Date
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics().then((d) => { setData(d); setLoading(false) })
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-violet-500" /></div>
  }

  if (!data) {
    return <div className="text-center py-20 text-zinc-500">Failed to load analytics</div>
  }

  const maxDaily = Math.max(...data.dailyUsage.map((d) => d.count), 1)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Advanced Analytics</h1>
        <p className="mt-1 text-sm text-zinc-500">Usage statistics and insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        {[
          { label: "Total Conversations", value: data.totalConversations, icon: MessageSquare, color: "from-violet-600 to-indigo-600" },
          { label: "Total Messages", value: data.totalMessages, icon: BarChart3, color: "from-purple-600 to-pink-600" },
          { label: "This Week", value: data.messagesThisWeek, icon: Calendar, color: "from-indigo-600 to-blue-600" },
          { label: "This Month", value: data.messagesThisMonth, icon: Zap, color: "from-emerald-600 to-teal-600" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-5">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Token Usage */}
      <div className="mb-8 rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6">
        <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Token Usage Today</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--muted)]">{data.tokensUsedToday.toLocaleString()} / {data.tokensLimit.toLocaleString()}</span>
          <span className="rounded-lg bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-400">{data.plan} Plan</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all"
            style={{ width: `${Math.min((data.tokensUsedToday / data.tokensLimit) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Daily Usage Chart */}
      <div className="mb-8 rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6">
        <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Daily Messages (Last 7 Days)</h3>
        <div className="flex items-end gap-2 h-40">
          {data.dailyUsage.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-zinc-500">{day.count}</span>
              <div className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-indigo-600 transition-all" style={{ height: `${(day.count / maxDaily) * 100}%`, minHeight: day.count > 0 ? "4px" : "0" }} />
              <span className="text-[10px] text-zinc-500">{day.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Message Split */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-8">
        <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6">
          <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Message Breakdown</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-zinc-400">Your messages</span>
                <span className="text-[var(--foreground)] font-medium">{data.userMessages}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full rounded-full bg-violet-600" style={{ width: `${data.totalMessages > 0 ? (data.userMessages / data.totalMessages) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-zinc-400">Aria responses</span>
                <span className="text-[var(--foreground)] font-medium">{data.assistantMessages}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full rounded-full bg-indigo-600" style={{ width: `${data.totalMessages > 0 ? (data.assistantMessages / data.totalMessages) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6">
          <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Top Conversations</h3>
          <div className="space-y-2">
            {data.topConversations.length === 0 ? (
              <p className="text-sm text-zinc-500">No conversations yet</p>
            ) : (
              data.topConversations.map((c, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-[var(--input-bg)] px-4 py-2.5">
                  <span className="text-sm text-[var(--foreground)] truncate max-w-[70%]">{c.title}</span>
                  <span className="text-xs text-zinc-500">{c.messageCount} msgs</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6">
        <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Account</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Member since</span>
          <span className="text-[var(--foreground)]">{new Date(data.memberSince).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}
