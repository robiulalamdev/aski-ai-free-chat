"use client"

import { useState, useEffect } from "react"
import { Loader2, BarChart3, MessageSquare, Zap, Calendar, TrendingUp, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
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
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-[#7c5cfc]" /></div>
  }

  if (!data) {
    return <div className="text-center py-20 text-[#6b7280]">Failed to load analytics</div>
  }

  const maxDaily = Math.max(...data.dailyUsage.map((d) => d.count), 1)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">Advanced Analytics</h1>
        <p className="mt-2 text-[#6b7280]">Usage statistics and insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        {[
          { label: "Total Conversations", value: data.totalConversations, icon: MessageSquare, color: "#7c5cfc", bg: "#f0ebff" },
          { label: "Total Messages", value: data.totalMessages, icon: BarChart3, color: "#8b5cf6", bg: "#f3e8ff" },
          { label: "This Week", value: data.messagesThisWeek, icon: Calendar, color: "#6366f1", bg: "#e0e7ff" },
          { label: "This Month", value: data.messagesThisMonth, icon: Zap, color: "#22c55e", bg: "#dcfce7" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass-card rounded-2xl p-5 hover-glow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-3" style={{ backgroundColor: stat.bg }}>
                <Icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <p className="text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-[#6b7280] mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Token Usage */}
      <div className="glass-card rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebff]">
            <Activity className="h-5 w-5 text-[#7c5cfc]" />
          </div>
          <h3 className="text-base font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Token Usage Today</h3>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[#6b7280]">{data.tokensUsedToday.toLocaleString()} / {data.tokensLimit.toLocaleString()}</span>
          <span className="rounded-lg bg-[#f0ebff] px-3 py-1 text-xs font-medium text-[#7c5cfc]">{data.plan} Plan</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[#f1f3f9] dark:bg-[#231f35]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] transition-all"
            style={{ width: `${Math.min((data.tokensUsedToday / data.tokensLimit) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Daily Usage Chart */}
      <div className="glass-card rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebff]">
            <TrendingUp className="h-5 w-5 text-[#7c5cfc]" />
          </div>
          <h3 className="text-base font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Daily Messages (Last 7 Days)</h3>
        </div>
        <div className="flex items-end gap-2 h-40">
          {data.dailyUsage.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-[#6b7280]">{day.count}</span>
              <div className="w-full rounded-t-lg bg-gradient-to-t from-[#7c5cfc] to-[#6d4ce6] transition-all" style={{ height: `${(day.count / maxDaily) * 100}%`, minHeight: day.count > 0 ? "4px" : "0" }} />
              <span className="text-[10px] text-[#6b7280]">{day.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Message Split */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-8">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="mb-4 text-base font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Message Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[#6b7280]">Your messages</span>
                <span className="text-[#1a1a2e] dark:text-[#e8e4f0] font-medium">{data.userMessages}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#f1f3f9] dark:bg-[#231f35]">
                <div className="h-full rounded-full bg-[#7c5cfc]" style={{ width: `${data.totalMessages > 0 ? (data.userMessages / data.totalMessages) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[#6b7280]">AI responses</span>
                <span className="text-[#1a1a2e] dark:text-[#e8e4f0] font-medium">{data.assistantMessages}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#f1f3f9] dark:bg-[#231f35]">
                <div className="h-full rounded-full bg-[#6d4ce6]" style={{ width: `${data.totalMessages > 0 ? (data.assistantMessages / data.totalMessages) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="mb-4 text-base font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Top Conversations</h3>
          <div className="space-y-2">
            {data.topConversations.length === 0 ? (
              <p className="text-sm text-[#6b7280]">No conversations yet</p>
            ) : (
              data.topConversations.map((c, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-[#f1f3f9]/50 backdrop-blur-sm px-4 py-3 dark:bg-[#231f35]/50">
                  <span className="text-sm text-[#1a1a2e] dark:text-[#e8e4f0] truncate max-w-[70%]">{c.title}</span>
                  <span className="text-xs text-[#6b7280]">{c.messageCount} msgs</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="mb-4 text-base font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Account</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6b7280]">Member since</span>
          <span className="text-[#1a1a2e] dark:text-[#e8e4f0]">{new Date(data.memberSince).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}
