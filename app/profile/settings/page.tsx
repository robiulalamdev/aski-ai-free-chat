"use client"

import { useState, useEffect } from "react"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getProfileAction, updatePreferencesAction } from "@/app/actions/profile"
import { ThemeToggle } from "@/components/providers/theme-toggle"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [systemPrompt, setSystemPrompt] = useState("")

  useEffect(() => {
    getProfileAction().then((user) => {
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
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/profile" className="rounded-xl border border-[var(--border-custom)] bg-[var(--surface)] p-2 text-[var(--foreground)] hover:bg-[var(--surface-light)] transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Settings</h1>
        </div>

        {success && (
          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">{success}</div>
        )}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        {/* AI Preferences */}
        <div className="mb-8 rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6">
          <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">AI Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">System Prompt</label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-[var(--border-custom)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
                placeholder="How should the AI behave?"
              />
              <p className="mt-1.5 text-xs text-zinc-600">Custom instructions for the AI. This will be sent with every conversation.</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:shadow-violet-600/30 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Settings
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6">
          <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Appearance</h2>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
