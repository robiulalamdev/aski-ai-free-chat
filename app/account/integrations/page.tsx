"use client"

import { useState, useEffect } from "react"
import { Loader2, Plus, Trash2, ToggleLeft, ToggleRight, X, Webhook, Copy, Check } from "lucide-react"
import { getWebhooks, createWebhook, deleteWebhook, toggleWebhook } from "@/app/actions/webhooks"

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

  const load = async () => {
    const data = await getWebhooks()
    setWebhooks(data as WebhookItem[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

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

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-violet-500" /></div>
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Custom Integrations</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage webhooks and integrations</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Add Webhook
        </button>
      </div>

      {success && <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">{success}</div>}
      {error && <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}

      {/* New Secret Alert */}
      {newSecret && (
        <div className="mb-6 rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
          <p className="text-sm font-medium text-violet-400 mb-2">Webhook Secret (save this now, it won&apos;t be shown again):</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-lg bg-[var(--input-bg)] px-3 py-2 text-xs text-zinc-300 break-all">{newSecret}</code>
            <button onClick={() => copySecret(newSecret)} className="text-zinc-400 hover:text-violet-400">
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--foreground)]">Add Webhook</h2>
              <button onClick={() => setShowCreate(false)} className="text-zinc-400 hover:text-[var(--foreground)]"><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-400">Endpoint URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-server.com/webhook"
                  className="w-full rounded-xl border border-[var(--border-custom)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-violet-500/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">Events</label>
                <div className="space-y-2 rounded-xl border border-[var(--border-custom)] bg-[var(--input-bg)] p-4">
                  {AVAILABLE_EVENTS.map((event) => {
                    const isSelected = selectedEvents.includes(event.slug)
                    return (
                      <label key={event.slug} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-[var(--surface)] transition-colors">
                        <div className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${isSelected ? "border-violet-500 bg-violet-600" : "border-zinc-600"}`}>
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <input type="checkbox" checked={isSelected} onChange={() => toggleEvent(event.slug)} className="sr-only" />
                        <span className="text-sm text-[var(--foreground)]">{event.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowCreate(false)} className="rounded-xl border border-[var(--border-custom)] px-4 py-2.5 text-sm text-zinc-400 hover:bg-[var(--surface-light)]">Cancel</button>
              <button onClick={handleCreate} disabled={creating || !url.trim() || selectedEvents.length === 0} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50">
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
          <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-12 text-center">
            <Webhook className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
            <p className="text-sm text-zinc-500">No webhooks configured yet.</p>
          </div>
        ) : (
          webhooks.map((wh) => (
            <div key={wh.id} className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => handleToggle(wh.id)} className="text-zinc-400 hover:text-violet-400">
                    {wh.isActive ? <ToggleRight className="h-5 w-5 text-green-400" /> : <ToggleLeft className="h-5 w-5" />}
                  </button>
                  <code className="text-sm text-[var(--foreground)] break-all">{wh.url}</code>
                </div>
                <button onClick={() => handleDelete(wh.id)} className="text-zinc-400 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {wh.events.map((e) => (
                  <span key={e} className="rounded-lg bg-violet-500/10 px-2 py-0.5 text-xs text-violet-400">{e}</span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
