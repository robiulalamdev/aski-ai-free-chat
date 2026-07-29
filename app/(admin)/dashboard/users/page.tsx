"use client"

import { useState, useEffect } from "react"
import { Loader2, Search } from "lucide-react"
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
        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Users</h1>
          <p className="mt-1 text-sm text-zinc-500">{users.length} total users</p>
        </div>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full rounded-xl border border-[var(--border-custom)] bg-[var(--surface)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-zinc-500 focus:border-violet-500/50"
        />
      </div>

      <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-custom)]">
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-custom)]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-zinc-500">No users found</td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--surface-light)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white">
                        {user.firstName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-zinc-500">ID: {user.id.slice(0, 12)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-400 capitalize">{user.plan}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
