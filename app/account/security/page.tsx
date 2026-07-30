"use client"

import { useState, useEffect } from "react"
import { Loader2, Lock, Eye, EyeOff, Check } from "lucide-react"
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
        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Security</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Manage your password and security settings</p>
      </div>

      {success && (
        <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">{success}</div>
      )}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <div className="space-y-6">
        {/* Account Info */}
        <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <Lock className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Password</h3>
              <p className="text-xs text-[var(--muted)]">Last changed: never</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-custom)] bg-[var(--input-bg)] px-4 py-3 pr-11 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-custom)] bg-[var(--input-bg)] px-4 py-3 pr-11 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {newPassword.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-2 text-xs">
                      <div className={`flex h-4 w-4 items-center justify-center rounded-full ${check.valid ? "bg-green-500/20 text-green-400" : "bg-zinc-500/20 text-[var(--muted)]"}`}>
                        {check.valid && <Check className="h-3 w-3" />}
                      </div>
                      <span className={check.valid ? "text-green-400" : "text-[var(--muted)]"}>{check.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-custom)] bg-[var(--input-bg)] px-4 py-3 pr-11 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                <p className="mt-1.5 text-xs text-red-400">Passwords do not match</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handlePasswordChange}
                disabled={!allValid || saving}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:shadow-violet-600/30 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                Update Password
              </button>
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6">
          <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Session</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-[var(--border-custom)]">
              <div>
                <p className="text-sm text-[var(--foreground)]">Access Token</p>
                <p className="text-xs text-[var(--muted)]">Expires in 1 hour</p>
              </div>
              <span className="rounded-lg bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">Active</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-[var(--foreground)]">Refresh Token</p>
                <p className="text-xs text-[var(--muted)]">Expires in 7 days</p>
              </div>
              <span className="rounded-lg bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">Active</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <h3 className="mb-1 text-sm font-semibold text-red-400">Danger Zone</h3>
          <p className="mb-4 text-xs text-[var(--muted)]">Permanently delete your account and all data</p>
          <button className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
