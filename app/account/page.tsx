"use client"

import { useState, useEffect } from "react"
import { Loader2, Save, User, Mail, FileText, Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAccountAction, updateAccountAction } from "@/app/actions/account"
import Link from "next/link"

export default function AccountPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [bio, setBio] = useState("")
  const [email, setEmail] = useState("")
  const [plan, setPlan] = useState("free")

  useEffect(() => {
    getAccountAction().then((user) => {
      if (user) {
        setFirstName(user.firstName)
        setLastName(user.lastName)
        setBio(user.bio || "")
        setEmail(user.email)
        setPlan(user.plan)
      }
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError("")
    setSuccess("")
    const result = await updateAccountAction({ firstName, lastName, bio })
    if (result?.error) setError(result.error)
    else setSuccess("Account updated")
    setSaving(false)
    setTimeout(() => setSuccess(""), 3000)
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
        <h1 className="text-3xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">Account</h1>
        <p className="mt-2 text-[#6b7280]">Manage your account information</p>
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
        {/* Profile Card */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] text-xl font-bold text-white shadow-lg shadow-[#7c5cfc]/25">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">{firstName} {lastName}</p>
              <p className="text-sm text-[#6b7280]">{email}</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ca3af]" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-[#e2e5f1] bg-[#f1f3f9]/50 backdrop-blur-sm pl-12 pr-4 py-3.5 text-sm text-[#1a1a2e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7c5cfc]/50 focus:border-[#7c5cfc]/50 transition-all duration-200 dark:border-[#2a2540] dark:bg-[#231f35]/50 dark:text-[#e8e4f0]"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">Last Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ca3af]" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-[#e2e5f1] bg-[#f1f3f9]/50 backdrop-blur-sm pl-12 pr-4 py-3.5 text-sm text-[#1a1a2e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7c5cfc]/50 focus:border-[#7c5cfc]/50 transition-all duration-200 dark:border-[#2a2540] dark:bg-[#231f35]/50 dark:text-[#e8e4f0]"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ca3af]" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full rounded-xl border border-[#e2e5f1] bg-[#f1f3f9]/30 pl-12 pr-4 py-3.5 text-sm text-[#6b7280] cursor-not-allowed dark:border-[#2a2540] dark:bg-[#231f35]/30"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">Bio</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 h-5 w-5 text-[#9ca3af]" />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[#e2e5f1] bg-[#f1f3f9]/50 backdrop-blur-sm pl-12 pr-4 py-3.5 text-sm text-[#1a1a2e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7c5cfc]/50 focus:border-[#7c5cfc]/50 transition-all duration-200 dark:border-[#2a2540] dark:bg-[#231f35]/50 dark:text-[#e8e4f0]"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Plan Card */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebff]">
              <Sparkles className="h-5 w-5 text-[#7c5cfc]" />
            </div>
            <h3 className="text-base font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Current Plan</h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-[#f0ebff] px-3 py-1.5 text-sm font-medium text-[#7c5cfc] capitalize">{plan}</span>
              <span className="text-sm text-[#6b7280]">50,000 tokens/day</span>
            </div>
            <Link
              href="/account/subscription"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/25 transition-all duration-300 hover:shadow-[#7c5cfc]/40 hover:brightness-110 active:scale-[0.98]"
            >
              Upgrade
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/25 transition-all duration-300 hover:shadow-[#7c5cfc]/40 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
