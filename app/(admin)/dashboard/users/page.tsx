"use client"

import { useState, useEffect } from "react"
import { Loader2, Search, Users as UsersIcon } from "lucide-react"
import { getAllUsers } from "@/app/actions/admin"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  plan: string
  createdAt: Date
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data as User[])
      setLoading(false)
    })
  }, [])

  const filtered = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#7c5cfc]" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">Users</h1>
          <p className="mt-1 text-sm text-[#6b7280]">{users.length} total users</p>
        </div>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full rounded-xl border border-[#e2e5f1] dark:border-[#2a2540] bg-white/80 dark:bg-[#1a1726]/80 backdrop-blur-sm py-3 pl-11 pr-4 text-sm text-[#1a1a2e] dark:text-[#e8e4f0] outline-none transition-all duration-200 placeholder:text-[#9ca3af] focus:border-[#7c5cfc]/50 focus:ring-2 focus:ring-[#7c5cfc]/20"
        />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e2e5f1] dark:border-[#2a2540]">
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Plan</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e5f1] dark:divide-[#2a2540]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1f3f9] dark:bg-[#231f35]">
                      <UsersIcon className="h-6 w-6 text-[#9ca3af]" />
                    </div>
                    <p className="text-sm text-[#6b7280]">No users found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="hover:bg-[#f8f9fc] dark:hover:bg-[#231f35]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] text-sm font-bold text-white shadow-lg shadow-[#7c5cfc]/20">
                        {user.firstName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-[#9ca3af]">ID: {user.id.slice(0, 12)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6b7280]">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-[#7c5cfc]/10 px-2.5 py-1 text-xs font-semibold text-[#7c5cfc] capitalize">{user.plan}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#9ca3af]">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
