"use client"

import { useState, useEffect } from "react"
import { Loader2, Shield, Users } from "lucide-react"
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
        <Loader2 className="h-6 w-6 animate-spin text-[#7c5cfc]" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">Admins</h1>
        <p className="mt-1 text-sm text-[#6b7280]">Manage admin accounts and roles</p>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] shadow-lg shadow-[#7c5cfc]/20">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Role Hierarchy</h3>
            <p className="text-xs text-[#6b7280]">Higher roles can manage lower roles</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { role: "SUPER_ADMIN", desc: "Full access to everything. Can manage admins.", level: 3, color: "from-[#ef4444] to-[#f97316]" },
            { role: "ADMIN", desc: "Can manage users, subscriptions, and content.", level: 2, color: "from-[#7c5cfc] to-[#6d4ce6]" },
            { role: "MODERATOR", desc: "Can view data and moderate content.", level: 1, color: "from-[#3b82f6] to-[#06b6d4]" },
          ].map((r) => (
            <div key={r.role} className="flex items-center justify-between rounded-xl border border-[#e2e5f1] dark:border-[#2a2540] bg-[#f8f9fc] dark:bg-[#231f35] p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${r.color} text-xs font-bold text-white shadow-lg`}>
                  L{r.level}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">{r.role}</p>
                  <p className="text-xs text-[#6b7280]">{r.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7c5cfc]/10">
            <Users className="h-5 w-5 text-[#7c5cfc]" />
          </div>
          <h3 className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Your Account</h3>
        </div>
        {currentUser && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] text-sm font-bold text-white shadow-lg shadow-[#7c5cfc]/20">
                A
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Current Admin</p>
                <span className="rounded-lg bg-[#7c5cfc]/10 px-2.5 py-1 text-xs font-semibold text-[#7c5cfc]">{currentUser.role}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
