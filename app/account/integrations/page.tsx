"use client"

import { useState, useEffect } from "react"
import { Loader2, Plus, Trash2, X, Webhook, Copy, Check, Lock, ToggleLeft, ToggleRight, Link2, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { getWebhooks, createWebhook, deleteWebhook, toggleWebhook } from "@/app/actions/webhooks"
import { hasFeatureAction } from "@/app/actions/account"
import { FEATURES } from "@/lib/features"

interface WebhookItem {
  id: string
  url: string
  events: string[]
  isActive: boolean
  createdAt: Date
}

const AVAILABLE_EVENTS = [
  { slug: "message.sent", label: "Message Sent" },
  { slug: "message.received", label: "Message Received" },
  { slug: "conversation.created", label: "Conversation Created" },
  { slug: "conversation.deleted", label: "Conversation Deleted" },
  { slug: "subscription.changed", label: "Subscription Changed" },
  { slug: "limit.reached", label: "Token Limit Reached" },
]

export default function IntegrationsPage() {
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [url, setUrl] = useState("")
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [newSecret, setNewSecret] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  const load = async () => {
    const data = await getWebhooks()
    setWebhooks(data as WebhookItem[])
    setLoading(false)
  }

  useEffect(() => {
    hasFeatureAction(FEATURES.CUSTOM_INTEGRATIONS).then((allowed) => setHasAccess(allowed))
    load()
  }, [])

  const toggleEvent = (slug: string) => {
    setSelectedEvents((prev) => prev.includes(slug) ? prev.filter((e) => e !== slug) : [...prev, slug])
  }

  const handleCreate = async () => {
    if (!url.trim() || selectedEvents.length === 0) return
    setCreating(true)
    setError("")
    const result = await createWebhook(url, selectedEvents)
    if (result?.error) setError(result.error)
    else {
      setSuccess("Webhook created!")
      setNewSecret(result.secret || null)
      setUrl("")
      setSelectedEvents([])
      setShowCreate(false)
      await load()
    }
    setCreating(false)
    setTimeout(() => { setSuccess(""); setError("") }, 3000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this webhook?")) return
    await deleteWebhook(id)
    await load()
  }

  const handleToggle = async (id: string) => {
    await toggleWebhook(id)
    await load()
  }

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (hasAccess === null) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-[#7c5cfc]" /></div>
  }

  if (!hasAccess) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0ebff] mx-auto mb-4">
          <Lock className="h-8 w-8 text-[#7c5cfc]" />
        </div>
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0] mb-2">Premium Feature</h2>
        <p className="text-sm text-[#6b7280] mb-6">Custom Integrations requires a paid plan. Upgrade to connect webhooks and integrations.</p>
        <a
          href="/account/subscription"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/25 transition-all duration-300 hover:shadow-[#7c5cfc]/40 hover:brightness-110"
        >
          Upgrade Plan
        </a>
      </div>
    )
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-[#7c5cfc]" /></div>
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">Custom Integrations</h1>
          <p className="mt-2 text-[#6b7280]">Manage webhooks and integrations</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/25 transition-all duration-300 hover:shadow-[#7c5cfc]/40 hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Add Webhook
        </button>
      </div>

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

      {/* New Secret Alert */}
      {newSecret && (
        <div className="mb-6 rounded-xl border border-[#7c5cfc]/20 bg-[#f0ebff] p-4 dark:bg-[#7c5cfc]/10">
          <p className="text-sm font-medium text-[#7c5cfc] mb-2">Webhook Secret (save this now, it won&apos;t be shown again):</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-lg bg-white/50 backdrop-blur-sm px-3 py-2 text-xs text-[#1a1a2e] break-all dark:bg-[#231f35]/50 dark:text-[#e8e4f0]">{newSecret}</code>
            <button onClick={() => copySecret(newSecret)} className="text-[#6b7280] hover:text-[#7c5cfc] transition-colors">
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg rounded-2xl p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebff]">
                  <Link2 className="h-5 w-5 text-[#7c5cfc]" />
                </div>
                <h2 className="text-lg font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">Add Webhook</h2>
              </div>
              <button onClick={() => setShowCreate(false)} className="text-[#6b7280] hover:text-[#1a1a2e] dark:hover:text-[#e8e4f0] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">Endpoint URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-server.com/webhook"
                  className="w-full rounded-xl border border-[#e2e5f1] bg-[#f1f3f9]/50 backdrop-blur-sm px-4 py-3.5 text-sm text-[#1a1a2e] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#7c5cfc]/50 focus:border-[#7c5cfc]/50 transition-all duration-200 dark:border-[#2a2540] dark:bg-[#231f35]/50 dark:text-[#e8e4f0]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0]">Events</label>
                <div className="space-y-2 rounded-xl border border-[#e2e5f1] bg-[#f1f3f9]/30 p-4 dark:border-[#2a2540] dark:bg-[#231f35]/30">
                  {AVAILABLE_EVENTS.map((event) => {
                    const isSelected = selectedEvents.includes(event.slug)
                    return (
                      <label key={event.slug} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/50 dark:hover:bg-[#231f35]/50 transition-colors">
                        <div className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-md border transition-colors",
                          isSelected ? "border-[#7c5cfc] bg-[#7c5cfc]" : "border-[#e2e5f1] dark:border-[#2a2540]"
                        )}>
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <input type="checkbox" checked={isSelected} onChange={() => toggleEvent(event.slug)} className="sr-only" />
                        <span className="text-sm text-[#1a1a2e] dark:text-[#e8e4f0]">{event.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowCreate(false)} className="rounded-xl border border-[#e2e5f1] px-4 py-2.5 text-sm text-[#6b7280] hover:bg-[#f1f3f9] transition-colors dark:border-[#2a2540] dark:hover:bg-[#231f35]">
                Cancel
              </button>
              <button onClick={handleCreate} disabled={creating || !url.trim() || selectedEvents.length === 0} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/25 disabled:opacity-50 transition-all duration-300 hover:shadow-[#7c5cfc]/40 hover:brightness-110">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webhooks List */}
      <div className="space-y-3">
        {webhooks.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f1f3f9] mx-auto mb-4 dark:bg-[#231f35]">
              <Webhook className="h-8 w-8 text-[#9ca3af]" />
            </div>
            <p className="text-sm text-[#6b7280]">No webhooks configured yet.</p>
          </div>
        ) : (
          webhooks.map((wh) => (
            <div key={wh.id} className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => handleToggle(wh.id)} className="text-[#6b7280] hover:text-[#7c5cfc] transition-colors">
                    {wh.isActive ? <ToggleRight className="h-6 w-6 text-emerald-500" /> : <ToggleLeft className="h-6 w-6" />}
                  </button>
                  <code className="text-sm text-[#1a1a2e] dark:text-[#e8e4f0] break-all">{wh.url}</code>
                </div>
                <button onClick={() => handleDelete(wh.id)} className="text-[#9ca3af] hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {wh.events.map((e) => (
                  <span key={e} className="rounded-lg bg-[#f0ebff] px-2.5 py-1 text-xs font-medium text-[#7c5cfc] dark:bg-[#7c5cfc]/10">{e}</span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
