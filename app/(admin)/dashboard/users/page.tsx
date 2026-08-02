"use client"

import { useState, useEffect } from "react"
import { Search, Users as UsersIcon, Filter, X } from "lucide-react"
import { getAllUsers } from "@/app/actions/admin"
import { cn } from "@/lib/utils"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  plan: string
  createdAt: Date
  _count?: { conversations: number }
}

const PLAN_STYLES: Record<string, { badge: string; dot: string }> = {
  free: { badge: "bg-[#f1f3f9] text-[#6b7280] dark:bg-[#231f35] dark:text-[#8b8698]", dot: "bg-[#9ca3af]" },
  pro: { badge: "bg-[#f0ebff] text-[#7c5cfc] dark:bg-[#7c5cfc]/10 dark:text-[#8b6fff]", dot: "bg-[#7c5cfc]" },
  enterprise: { badge: "bg-[#dbeafe] text-[#3b82f6] dark:bg-blue-900/30 dark:text-blue-400", dot: "bg-[#3b82f6]" },
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [planFilter, setPlanFilter] = useState("all")

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data as User[])
      setLoading(false)
    })
  }, [])

  const plans = Array.from(new Set(users.map((u) => u.plan)))
  const filtered = users.filter((u) => {
    const matchesSearch =
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesPlan = planFilter === "all" || u.plan === planFilter
    return matchesSearch && matchesPlan
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#7c5cfc]/20 border-t-[#7c5cfc]" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">Users</h1>
          <p className="mt-1 text-sm text-[#6b7280] dark:text-[#8b8698]">
            {users.length.toLocaleString()} total users ·{" "}
            {users.filter((u) => u.plan !== "free").length.toLocaleString()} paid
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-xl border border-[#e5e7eb] px-3.5 py-2.5 text-xs font-medium text-[#6b7280] sm:flex dark:border-[#2a2540] dark:text-[#8b8698]">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            System operational
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-[#e2e5f1] bg-white px-11 py-3 text-sm text-[#1a1a2e] outline-none transition-all duration-200 placeholder:text-[#9ca3af] focus:border-[#7c5cfc]/50 focus:ring-2 focus:ring-[#7c5cfc]/20 dark:border-[#2a2540] dark:bg-[#1a1726] dark:text-[#e8e4f0]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#9ca3af] hover:text-[#6b7280]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 rounded-xl border border-[#e2e5f1] px-3 py-2.5 dark:border-[#2a2540]">
            <Filter className="h-4 w-4 text-[#9ca3af]" />
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="bg-transparent text-sm text-[#6b7280] outline-none dark:text-[#8b8698] [&>option]:text-[#1a1a2e] dark:[&>option]:bg-[#1a1726]"
            >
              <option value="all">All plans</option>
              {plans.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f8f9fc]/60 dark:border-[#2a2540] dark:bg-[#231f35]/30">
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] dark:text-[#8b8698]">
                  User
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] dark:text-[#8b8698]">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] dark:text-[#8b8698]">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] dark:text-[#8b8698]">
                  Chats
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] dark:text-[#8b8698]">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f9] dark:divide-[#231f35]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1f3f9] dark:bg-[#231f35]">
                        <UsersIcon className="h-7 w-7 text-[#9ca3af]" />
                      </div>
                      <p className="text-sm font-medium text-[#6b7280] dark:text-[#8b8698]">
                        {search || planFilter !== "all" ? "No users match your filters" : "No users yet"}
                      </p>
                      {(search || planFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearch("")
                            setPlanFilter("all")
                          }}
                          className="text-xs font-medium text-[#7c5cfc] hover:text-[#6d4ce6] dark:text-[#8b6fff]"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const planStyle = PLAN_STYLES[user.plan] || PLAN_STYLES.free
                  return (
                    <tr key={user.id} className="transition-colors hover:bg-[#f8f9fc] dark:hover:bg-[#231f35]/40">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] text-xs font-bold text-white shadow-md shadow-[#7c5cfc]/20">
                            {user.firstName.charAt(0).toUpperCase()}
                            {user.lastName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-[11px] text-[#9ca3af]">ID: {user.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#8b8698]">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold capitalize", planStyle.badge)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", planStyle.dot)} />
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#8b8698]">
                        {user._count?.conversations ?? 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#9ca3af]">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#e5e7eb] px-6 py-3.5 dark:border-[#2a2540]">
          <p className="text-xs text-[#9ca3af]">
            Showing {filtered.length} of {users.length} users
          </p>
        </div>
      </div>
    </div>
  )
}
