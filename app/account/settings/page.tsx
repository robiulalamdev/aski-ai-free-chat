"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import {
  Loader2,
  Save,
  Sparkles,
  Palette,
  Sun,
  Moon,
  Monitor,
  Shield,
  RefreshCw,
  Clock,
  Headphones,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getAccountAction, updatePreferencesAction } from "@/app/actions/account"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [systemPrompt, setSystemPrompt] = useState("")

  useEffect(() => {
    getAccountAction().then((user) => {
      if (user) {
        setSystemPrompt(user.systemPrompt || "")
      }
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError("")
    setSuccess("")
    const result = await updatePreferencesAction({ systemPrompt })
    if (result?.error) setError(result.error)
    else setSuccess("Settings saved")
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

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">Settings</h1>
        <p className="mt-2 text-[#6b7280] dark:text-[#8b8698]">Customize how Aria behaves</p>
      </div>

      {/* Success/Error Message */}
      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* System Prompt Card */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 dark:border-[#2a2540] dark:bg-[#1a1726]">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebff] dark:bg-[#7c5cfc]/10">
              <Sparkles className="h-5 w-5 text-[#7c5cfc]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">System Prompt</h3>
              <p className="text-sm text-[#6b7280] dark:text-[#8b8698]">Customize instructions for Aria. This will be used in all conversations.</p>
            </div>
          </div>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={6}
            className="mt-4 w-full resize-none rounded-xl border border-[#e5e7eb] bg-[#f5f5f7] px-4 py-3 text-sm text-[#1a1a2e] outline-none transition-colors placeholder:text-[#9ca3af] focus:border-[#7c5cfc]/50 focus:ring-1 focus:ring-[#7c5cfc]/30 dark:border-[#2a2540] dark:bg-[#231f35] dark:text-[#e8e4f0]"
            placeholder="You are Aria, a helpful AI assistant..."
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#7c5cfc] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/20 transition-all hover:shadow-[#7c5cfc]/30 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </button>
          </div>
        </div>

        {/* Appearance Card */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 dark:border-[#2a2540] dark:bg-[#1a1726]">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebff] dark:bg-[#7c5cfc]/10">
              <Palette className="h-5 w-5 text-[#7c5cfc]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Appearance</h3>
              <p className="text-sm text-[#6b7280] dark:text-[#8b8698]">Switch between dark and light theme</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {themeOptions.map((option) => {
              const isActive = theme === option.value
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all",
                    isActive
                      ? "border-[#7c5cfc] bg-[#f0ebff] dark:border-[#8b6fff] dark:bg-[#7c5cfc]/10"
                      : "border-[#e5e7eb] bg-white hover:border-[#d1d5db] hover:bg-[#f5f5f7] dark:border-[#2a2540] dark:bg-[#1a1726] dark:hover:border-[#2a2540] dark:hover:bg-[#231f35]"
                  )}
                >
                  {isActive && (
                    <div className="absolute top-3 right-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7c5cfc]">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  )}
                  <Icon className={cn("h-6 w-6", isActive ? "text-[#7c5cfc] dark:text-[#8b6fff]" : "text-[#6b7280] dark:text-[#8b8698]")} />
                  <span className={cn("text-sm font-medium", isActive ? "text-[#7c5cfc] dark:text-[#8b6fff]" : "text-[#1a1a2e] dark:text-[#e8e4f0]")}>
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Features */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0ebff] dark:bg-[#7c5cfc]/10">
            <Shield className="h-5 w-5 text-[#7c5cfc]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Secure & Private</h4>
            <p className="mt-0.5 text-xs text-[#6b7280] dark:text-[#8b8698]">Your data is encrypted and never shared</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dbeafe] dark:bg-blue-900/30">
            <RefreshCw className="h-5 w-5 text-[#3b82f6] dark:text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Cancel Anytime</h4>
            <p className="mt-0.5 text-xs text-[#6b7280] dark:text-[#8b8698]">No long-term contracts or hidden fees</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dcfce7] dark:bg-emerald-900/30">
            <Clock className="h-5 w-5 text-[#22c55e] dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">Instant Changes</h4>
            <p className="mt-0.5 text-xs text-[#6b7280] dark:text-[#8b8698]">All changes are applied immediately</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffedd5] dark:bg-orange-900/30">
            <Headphones className="h-5 w-5 text-[#f97316] dark:text-orange-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">24/7 Support</h4>
            <p className="mt-0.5 text-xs text-[#6b7280] dark:text-[#8b8698]">Our team is here to help you succeed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
