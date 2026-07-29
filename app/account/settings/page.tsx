"use client"

import { useState, useEffect } from "react"
import { Loader2, Save } from "lucide-react"
import { getAccountAction, updatePreferencesAction } from "@/app/actions/account"
import { ThemeToggle } from "@/components/providers/theme-toggle"

export default function SettingsPage() {
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
        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">Customize how Aria behaves</p>
      </div>

      {success && (
        <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">{success}</div>
      )}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <div className="space-y-6">
        {/* AI Preferences */}
        <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6">
          <h3 className="mb-1 text-sm font-semibold text-[var(--foreground)]">System Prompt</h3>
          <p className="mb-4 text-xs text-zinc-500">Custom instructions for Aria. This will be sent with every conversation.</p>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={6}
            className="w-full resize-none rounded-xl border border-[var(--border-custom)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
            placeholder="You are Aria, a helpful AI assistant..."
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:shadow-violet-600/30 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6">
          <h3 className="mb-1 text-sm font-semibold text-[var(--foreground)]">Appearance</h3>
          <p className="mb-4 text-xs text-zinc-500">Switch between dark and light theme</p>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
