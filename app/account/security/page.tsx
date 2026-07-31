"use client"

import { useState, useEffect } from "react"
import { Loader2, Lock, Eye, EyeOff, Check, Shield, AlertTriangle, Key, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAccountAction } from "@/app/actions/account"

export default function SecurityPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [lastLogin, setLastLogin] = useState("")

  useEffect(() => {
    getAccountAction().then((user) => {
      if (user) {
        setLastLogin(user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "")
      }
      setLoading(false)
    })
  }, [])

  const passwordChecks = [
    { label: "At least 8 characters", valid: newPassword.length >= 8 },
    { label: "Has uppercase letter", valid: /[A-Z]/.test(newPassword) },
    { label: "Has lowercase letter", valid: /[a-z]/.test(newPassword) },
    { label: "Has number", valid: /[0-9]/.test(newPassword) },
  ]

  const allValid = passwordChecks.every((c) => c.valid) && newPassword === confirmPassword && confirmPassword.length > 0

  const handlePasswordChange = async () => {
    if (!allValid) return
    setSaving(true)
    setError("")
    setSuccess("")

    // TODO: Implement actual password change API
    await new Promise((r) => setTimeout(r, 800))
    setError("Password change not yet implemented. Connect a password change server action.")
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#7c5cfc]" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">Security</h1>
        <p className="mt-2 text-[#6b7280]">Manage your password and security settings</p>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Password Card */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebff]">
              <Key className="h-5 w-5 text-[#7c5cfc]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Password</h3>
              <p className="text-sm text-[#6b7280]">Last changed: never</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ca3af]" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#e2e5f1] bg-[#f1f3f9]/50 backdrop-blur-sm pl-12 pr-12 py-3.5 text-sm text-[#1a1a2e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7c5cfc]/50 focus:border-[#7c5cfc]/50 transition-all duration-200 dark:border-[#2a2540] dark:bg-[#231f35]/50 dark:text-[#e8e4f0]"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                >
                  {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ca3af]" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#e2e5f1] bg-[#f1f3f9]/50 backdrop-blur-sm pl-12 pr-12 py-3.5 text-sm text-[#1a1a2e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7c5cfc]/50 focus:border-[#7c5cfc]/50 transition-all duration-200 dark:border-[#2a2540] dark:bg-[#231f35]/50 dark:text-[#e8e4f0]"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                >
                  {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {newPassword.length > 0 && (
                <div className="mt-3 space-y-2">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-2 text-xs">
                      <div className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full transition-colors",
                        check.valid ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-[#f1f3f9] text-[#9ca3af] dark:bg-[#231f35]"
                      )}>
                        {check.valid && <Check className="h-3 w-3" />}
                      </div>
                      <span className={check.valid ? "text-emerald-600 dark:text-emerald-400" : "text-[#6b7280]"}>{check.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ca3af]" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#e2e5f1] bg-[#f1f3f9]/50 backdrop-blur-sm pl-12 pr-12 py-3.5 text-sm text-[#1a1a2e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7c5cfc]/50 focus:border-[#7c5cfc]/50 transition-all duration-200 dark:border-[#2a2540] dark:bg-[#231f35]/50 dark:text-[#e8e4f0]"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                <p className="mt-2 text-xs text-red-500 dark:text-red-400">Passwords do not match</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handlePasswordChange}
                disabled={!allValid || saving}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/25 transition-all duration-300 hover:shadow-[#7c5cfc]/40 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                Update Password
              </button>
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebff]">
              <Clock className="h-5 w-5 text-[#7c5cfc]" />
            </div>
            <h3 className="text-base font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Session</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-[#e2e5f1] dark:border-[#2a2540]">
              <div>
                <p className="text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">Access Token</p>
                <p className="text-xs text-[#6b7280]">Expires in 1 hour</p>
              </div>
              <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">Active</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">Refresh Token</p>
                <p className="text-xs text-[#6b7280]">Expires in 7 days</p>
              </div>
              <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">Active</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 dark:border-red-800/50 dark:bg-red-900/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-base font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
          </div>
          <p className="mb-4 text-sm text-[#6b7280]">Permanently delete your account and all data</p>
          <button className="rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
