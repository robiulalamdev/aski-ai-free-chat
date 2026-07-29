"use client"

import { useState, useEffect } from "react"
import { Loader2, Plus, Pencil, Trash2, X, Check, Zap, ToggleLeft, ToggleRight } from "lucide-react"
import {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  toggleSubscriptionActive,
} from "@/app/actions/admin"
import { ALL_FEATURES } from "@/lib/features"

interface Subscription {
  id: string
  name: string
  slug: string
  description: string
  price: number
  maxTokensPerDay: number
  features: string
  isActive: boolean
}

const emptyForm = { name: "", slug: "", description: "", price: 0, maxTokensPerDay: 50000, selectedFeatures: [] as string[] }

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const load = async () => {
    const data = await getAllSubscriptions()
    setSubs(data as Subscription[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
    setError("")
  }

  const openEdit = (sub: Subscription) => {
    setEditingId(sub.id)
    let features: string[] = []
    try { features = JSON.parse(sub.features) } catch { features = [] }
    setForm({
      name: sub.name,
      slug: sub.slug,
      description: sub.description,
      price: sub.price,
      maxTokensPerDay: sub.maxTokensPerDay,
      selectedFeatures: features,
    })
    setShowModal(true)
    setError("")
  }

  const toggleFeature = (slug: string) => {
    setForm((prev) => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(slug)
        ? prev.selectedFeatures.filter((f) => f !== slug)
        : [...prev.selectedFeatures, slug],
    }))
  }

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Plan name is required"); return }
    if (!form.slug.trim()) { setError("Slug is required"); return }

    setSaving(true)
    setError("")
    const payload = { ...form, features: form.selectedFeatures }

    const result = editingId
      ? await updateSubscription(editingId, payload)
      : await createSubscription(payload)

    if (result?.error) setError(result.error)
    else { setShowModal(false); await load() }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this subscription?")) return
    await deleteSubscription(id)
    await load()
  }

  const handleToggle = async (id: string) => {
    await toggleSubscriptionActive(id)
    await load()
  }

  const getFeatureLabel = (slug: string) => ALL_FEATURES.find((f) => f.slug === slug)?.name || slug

  const getFeaturesArray = (featuresJson: string): string[] => {
    try { return JSON.parse(featuresJson) } catch { return [] }
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Subscriptions</h1>
          <p className="mt-1 text-sm text-zinc-500">{subs.length} plans</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:shadow-violet-600/30 hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Add Plan
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {subs.map((sub) => (
          <div
            key={sub.id}
            className={`rounded-2xl border p-6 transition-all ${
              sub.isActive
                ? "border-[var(--border-custom)] bg-[var(--surface)]"
                : "border-red-500/20 bg-red-500/5 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[var(--foreground)]">{sub.name}</h3>
                <p className="text-xs text-zinc-500">{sub.slug}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleToggle(sub.id)} className="text-zinc-400 hover:text-violet-400 transition-colors">
                  {sub.isActive ? <ToggleRight className="h-5 w-5 text-green-400" /> : <ToggleLeft className="h-5 w-5" />}
                </button>
                <button onClick={() => openEdit(sub)} className="text-zinc-400 hover:text-violet-400 transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(sub.id)} className="text-zinc-400 hover:text-red-400 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="mb-4 text-sm text-zinc-400">{sub.description}</p>

            <div className="mb-4">
              <span className="text-3xl font-bold text-[var(--foreground)]">${sub.price}</span>
              <span className="text-sm text-zinc-500">/month</span>
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-xl bg-violet-500/10 px-3 py-2">
              <Zap className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-400">{sub.maxTokensPerDay.toLocaleString()} tokens/day</span>
            </div>

            <div className="space-y-1.5">
              {getFeaturesArray(sub.features).map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-zinc-400">
                  <Check className="h-3 w-3 shrink-0 text-violet-400" />
                  {getFeatureLabel(f)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                {editingId ? "Edit Plan" : "Create Plan"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-[var(--foreground)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-400">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-[var(--border-custom)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-violet-500/50"
                    placeholder="Pro"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-400">Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                    className="w-full rounded-xl border border-[var(--border-custom)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-violet-500/50"
                    placeholder="pro"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-400">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border-custom)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-violet-500/50"
                  placeholder="For power users"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-400">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-[var(--border-custom)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-400">Max Tokens/Day</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={form.maxTokensPerDay}
                    onChange={(e) => setForm({ ...form, maxTokensPerDay: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-[var(--border-custom)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              {/* Features Checkboxes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">Features</label>
                <div className="space-y-2 rounded-xl border border-[var(--border-custom)] bg-[var(--input-bg)] p-4">
                  {ALL_FEATURES.map((feature) => {
                    const isSelected = form.selectedFeatures.includes(feature.slug)
                    return (
                      <label
                        key={feature.slug}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-[var(--surface)]"
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                            isSelected
                              ? "border-violet-500 bg-violet-600"
                              : "border-zinc-600 bg-transparent"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleFeature(feature.slug)}
                          className="sr-only"
                        />
                        <span className="text-sm text-[var(--foreground)]">{feature.name}</span>
                      </label>
                    )
                  })}
                </div>
                <p className="mt-1.5 text-xs text-zinc-500">{form.selectedFeatures.length} features selected</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-[var(--border-custom)] px-4 py-2.5 text-sm font-medium text-zinc-400 hover:bg-[var(--surface-light)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
