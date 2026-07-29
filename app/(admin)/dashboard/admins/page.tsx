"use client"

import { useState, useEffect } from "react"
import { Loader2, Shield, Plus, Trash2 } from "lucide-react"
import { getAdminAction } from "@/app/actions/admin"

interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean
  createdAt: Date
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ adminId: string; role: string } | null>(null)

  useEffect(() => {
    getAdminAction().then(setCurrentUser)
    // In a real app, fetch all admins from an API
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Admins</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage admin accounts and roles</p>
      </div>

      <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/20">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Role Hierarchy</h3>
            <p className="text-xs text-zinc-500">Higher roles can manage lower roles</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { role: "SUPER_ADMIN", desc: "Full access to everything. Can manage admins.", level: 3, color: "from-red-600 to-orange-600" },
            { role: "ADMIN", desc: "Can manage users, subscriptions, and content.", level: 2, color: "from-violet-600 to-indigo-600" },
            { role: "MODERATOR", desc: "Can view data and moderate content.", level: 1, color: "from-blue-600 to-cyan-600" },
          ].map((r) => (
            <div key={r.role} className="flex items-center justify-between rounded-xl border border-[var(--border-custom)] bg-[var(--input-bg)] p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${r.color} text-xs font-bold text-white`}>
                  L{r.level}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{r.role}</p>
                  <p className="text-xs text-zinc-500">{r.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6">
        <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Your Account</h3>
        {currentUser && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">Current Admin</p>
                <span className="rounded bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-400">{currentUser.role}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
