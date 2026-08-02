"use client"

import { useState, useEffect } from "react"
import { Shield, Users, ShieldCheck, ShieldAlert, UserCog, BadgeCheck, type LucideIcon } from "lucide-react"
import { getAdminAction, getAllAdmins } from "@/app/actions/admin"
import { cn } from "@/lib/utils"

interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean
  createdAt: Date
}

interface CurrentAdmin {
  adminId: string
  firstName: string
  lastName: string
  email: string
  role: string
}

const ROLE_STYLES: Record<string, { tile: string; badge: string; dot: string; icon: LucideIcon }> = {
  SUPER_ADMIN: {
    tile: "from-[#ef4444] to-[#f97316]",
    badge: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    dot: "bg-red-500",
    icon: ShieldAlert,
  },
  ADMIN: {
    tile: "from-[#7c5cfc] to-[#6d4ce6]",
    badge: "bg-[#f0ebff] text-[#7c5cfc] dark:bg-[#7c5cfc]/10 dark:text-[#8b6fff]",
    dot: "bg-[#7c5cfc]",
    icon: ShieldCheck,
  },
  MODERATOR: {
    tile: "from-[#3b82f6] to-[#06b6d4]",
    badge: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    dot: "bg-blue-500",
    icon: UserCog,
  },
}

const ROLE_HIERARCHY = [
  { role: "SUPER_ADMIN", desc: "Full access to everything. Can manage admins and billing.", level: 3 },
  { role: "ADMIN", desc: "Can manage users, subscriptions, and content.", level: 2 },
  { role: "MODERATOR", desc: "Can view data and moderate content.", level: 1 },
]

function roleLabel(role: string): string {
  return role.replace(/_/g, " ").toLowerCase()
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [currentUser, setCurrentUser] = useState<CurrentAdmin | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminAction().then((a) => {
      if (a)
        setCurrentUser({
          adminId: a.adminId,
          firstName: a.firstName,
          lastName: a.lastName,
          email: a.email,
          role: a.role,
        })
    })
    getAllAdmins().then((data) => {
      setAdmins(data as AdminUser[])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#7c5cfc]/20 border-t-[#7c5cfc]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">Admins</h1>
        <p className="mt-1 text-sm text-[#6b7280] dark:text-[#8b8698]">
          {admins.length.toLocaleString()} admin accounts · Manage roles and access
        </p>
      </div>

      {/* Role Hierarchy */}
      <div className="glass-card rounded-2xl p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] shadow-lg shadow-[#7c5cfc]/25">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Role Hierarchy</h3>
            <p className="text-xs text-[#6b7280] dark:text-[#8b8698]">Higher roles can manage lower roles</p>
          </div>
        </div>

        <div className="space-y-3">
          {ROLE_HIERARCHY.map((r) => {
            const style = ROLE_STYLES[r.role]
            const Icon = style.icon
            return (
              <div
                key={r.role}
                className="flex items-center justify-between rounded-xl border border-[#e5e7eb] bg-[#f8f9fc] p-4 transition-colors hover:bg-white dark:border-[#2a2540] dark:bg-[#231f35] dark:hover:bg-[#1a1726]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white shadow-lg",
                      style.tile
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">{roleLabel(r.role)}</p>
                    <p className="text-xs text-[#6b7280] dark:text-[#8b8698]">{r.desc}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-md bg-[#f1f3f9] px-2.5 py-1 text-[11px] font-semibold text-[#6b7280] dark:bg-[#1a1726] dark:text-[#8b8698]">
                  Level {r.level}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Admins List */}
      <div className="glass-card rounded-2xl p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebff] dark:bg-[#7c5cfc]/10">
            <Users className="h-5 w-5 text-[#7c5cfc] dark:text-[#8b6fff]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Admin Accounts</h3>
            <p className="text-xs text-[#6b7280] dark:text-[#8b8698]">Everyone with panel access</p>
          </div>
        </div>

        {admins.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#e5e7eb] py-10 text-center dark:border-[#2a2540]">
            <BadgeCheck className="h-8 w-8 text-[#9ca3af]" />
            <p className="text-sm text-[#6b7280] dark:text-[#8b8698]">No admin accounts found</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f1f3f9] dark:divide-[#231f35]">
            {admins.map((admin) => {
              const style = ROLE_STYLES[admin.role] || ROLE_STYLES.ADMIN
              const isYou = currentUser?.adminId === admin.id
              return (
                <div key={admin.id} className="flex items-center gap-3 py-3.5">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white shadow-md",
                      style.tile
                    )}
                  >
                    {admin.firstName.charAt(0).toUpperCase()}
                    {admin.lastName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">
                      {admin.firstName} {admin.lastName}
                      {isYou && (
                        <span className="rounded-md bg-[#f0ebff] px-1.5 py-0.5 text-[10px] font-semibold text-[#7c5cfc] dark:bg-[#7c5cfc]/10 dark:text-[#8b6fff]">
                          You
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-[#6b7280] dark:text-[#8b8698]">{admin.email}</p>
                  </div>
                  <span className={cn("hidden items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold sm:flex", style.badge)}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
                    {roleLabel(admin.role)}
                  </span>
                  <span
                    className={cn(
                      "rounded-md px-2 py-1 text-[11px] font-medium",
                      admin.isActive
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-[#f1f3f9] text-[#9ca3af] dark:bg-[#231f35]"
                    )}
                  >
                    {admin.isActive ? "Active" : "Disabled"}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
