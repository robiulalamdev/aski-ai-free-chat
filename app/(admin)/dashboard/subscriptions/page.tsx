"use client"

import { useState, useEffect } from "react"
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Zap,
  ToggleLeft,
  ToggleRight,
  CreditCard,
  Crown,
} from "lucide-react"
import {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  toggleSubscriptionActive,
} from "@/app/actions/admin"
import { ALL_FEATURES } from "@/lib/features"
import { cn } from "@/lib/utils"

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

const PLAN_ACCENTS: Record<string, { icon: string; tile: string; border: string; badge: string }> = {
  free: {
    icon: "text-[#6b7280] dark:text-[#8b8698]",
    tile: "bg-[#f1f3f9] dark:bg-[#231f35]",
    border: "border-[#e5e7eb] dark:border-[#2a2540]",
    badge: "bg-[#f1f3f9] text-[#6b7280] dark:bg-[#231f35] dark:text-[#8b8698]",
  },
  pro: {
    icon: "text-[#7c5cfc] dark:text-[#8b6fff]",
    tile: "bg-[#f0ebff] dark:bg-[#7c5cfc]/10",
    border: "border-[#7c5cfc]/25 dark:border-[#8b6fff]/25",
    badge: "bg-[#f0ebff] text-[#7c5cfc] dark:bg-[#7c5cfc]/10 dark:text-[#8b6fff]",
  },
  enterprise: {
    icon: "text-[#3b82f6] dark:text-blue-400",
    tile: "bg-[#dbeafe] dark:bg-blue-900/30",
    border: "border-[#3b82f6]/25 dark:border-blue-500/25",
    badge: "bg-[#dbeafe] text-[#3b82f6] dark:bg-blue-900/30 dark:text-blue-400",
  },
}

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

  useEffect(() => {
    getAllSubscriptions().then((data) => {
      setSubs(data as Subscription[])
      setLoading(false)
    })
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
    setError("")
  }

  const openEdit = (sub: Subscription) => {
    setEditingId(sub.id)
    let features: string[] = []
    try {
      features = JSON.parse(sub.features)
    } catch {
      features = []
    }
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
    if (!form.name.trim()) {
      setError("Plan name is required")
      return
    }
    if (!form.slug.trim()) {
      setError("Slug is required")
      return
    }

    setSaving(true)
    setError("")
    const payload = { ...form, features: form.selectedFeatures }

    const result = editingId
      ? await updateSubscription(editingId, payload)
      : await createSubscription(payload)

    if (result?.error) setError(result.error)
    else {
      setShowModal(false)
      await load()
    }
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
    try {
      return JSON.parse(featuresJson)
    } catch {
      return []
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#7c5cfc]/20 border-t-[#7c5cfc]" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">Subscriptions</h1>
          <p className="mt-1 text-sm text-[#6b7280] dark:text-[#8b8698]">
            {subs.length.toLocaleString()} plans configured · {subs.filter((s) => s.isActive).length} active
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-5 py-3 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/25 transition-all duration-300 hover:shadow-[#7c5cfc]/40 hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Add Plan
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {subs.length === 0 ? (
          <div className="glass-card col-span-full rounded-2xl p-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1f3f9] dark:bg-[#231f35]">
              <CreditCard className="h-7 w-7 text-[#9ca3af]" />
            </div>
            <p className="text-sm font-medium text-[#6b7280] dark:text-[#8b8698]">No plans configured yet</p>
            <button onClick={openCreate} className="mt-3 text-xs font-medium text-[#7c5cfc] hover:text-[#6d4ce6] dark:text-[#8b6fff]">
              Create your first plan
            </button>
          </div>
        ) : (
          subs.map((sub) => {
            const accent = PLAN_ACCENTS[sub.slug] || PLAN_ACCENTS.free
            const features = getFeaturesArray(sub.features)
            return (
              <div
                key={sub.id}
                className={cn(
                  "group glass-card relative flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5",
                  !sub.isActive && "opacity-60 saturate-50",
                  sub.slug === "pro" && "ring-1 ring-[#7c5cfc]/20 dark:ring-[#8b6fff]/20"
                )}
              >
                {/* Status + Actions */}
                <div className="mb-4 flex items-start justify-between">
                  <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", accent.tile)}>
                    <Zap className={cn("h-5 w-5", accent.icon)} />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggle(sub.id)}
                      className={cn(
                        "rounded-lg p-1.5 transition-colors",
                        sub.isActive ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10" : "text-[#9ca3af] hover:bg-[#f1f3f9] dark:hover:bg-[#231f35]"
                      )}
                      title={sub.isActive ? "Active" : "Inactive"}
                    >
                      {sub.isActive ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => openEdit(sub)}
                      className="rounded-lg p-1.5 text-[#9ca3af] transition-colors hover:bg-[#f1f3f9] hover:text-[#7c5cfc] dark:hover:bg-[#231f35] dark:hover:text-[#8b6fff]"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="rounded-lg p-1.5 text-[#9ca3af] transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">{sub.name}</h3>
                  {sub.slug === "pro" && (
                    <span className="flex items-center gap-1 rounded-md bg-[#f0ebff] px-1.5 py-0.5 text-[10px] font-semibold text-[#7c5cfc] dark:bg-[#7c5cfc]/10 dark:text-[#8b6fff]">
                      <Crown className="h-3 w-3" />
                      Popular
                    </span>
                  )}
                  {!sub.isActive && (
                    <span className="rounded-md bg-[#f1f3f9] px-1.5 py-0.5 text-[10px] font-semibold text-[#9ca3af] dark:bg-[#231f35]">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="mb-5 text-sm text-[#6b7280] dark:text-[#8b8698]">{sub.description}</p>

                <div className="mb-5 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">
                    ${sub.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-[#9ca3af]">/month</span>
                </div>

                <div className={cn("mb-5 flex items-center gap-2 rounded-xl px-3.5 py-2.5", accent.tile)}>
                  <Zap className={cn("h-4 w-4", accent.icon)} />
                  <span className={cn("text-sm font-semibold", accent.icon)}>
                    {sub.maxTokensPerDay.toLocaleString()} tokens/day
                  </span>
                </div>

                <div className="mb-6 flex-1 space-y-2">
                  {features.length === 0 ? (
                    <p className="text-xs text-[#9ca3af]">No features assigned</p>
                  ) : (
                    features.slice(0, 6).map((f) => (
                      <div key={f} className="flex items-center gap-2.5 text-sm text-[#6b7280] dark:text-[#8b8698]">
                        <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded-full", accent.tile)}>
                          <Check className={cn("h-2.5 w-2.5", accent.icon)} />
                        </span>
                        {getFeatureLabel(f)}
                      </div>
                    ))
                  )}
                </div>

                <div className={cn("flex items-center justify-between rounded-xl border px-3.5 py-2.5", accent.border)}>
                  <span className={cn("rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide", accent.badge)}>
                    {sub.slug}
                  </span>
                  <span className="text-[11px] text-[#9ca3af]">{features.length} features</span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-y-auto rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-2xl max-h-[90vh] dark:border-[#2a2540] dark:bg-[#1a1726]">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebff] dark:bg-[#7c5cfc]/10">
                  <CreditCard className="h-5 w-5 text-[#7c5cfc] dark:text-[#8b6fff]" />
                </div>
                <h2 className="text-lg font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">
                  {editingId ? "Edit Plan" : "Create Plan"}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-[#9ca3af] hover:bg-[#f1f3f9] hover:text-[#1a1a2e] dark:hover:bg-[#231f35] dark:hover:text-[#e8e4f0]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#6b7280] dark:text-[#8b8698]">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-[#e2e5f1] bg-[#f8f9fc] px-4 py-3 text-sm text-[#1a1a2e] outline-none transition-all duration-200 focus:border-[#7c5cfc]/50 focus:ring-2 focus:ring-[#7c5cfc]/20 dark:border-[#2a2540] dark:bg-[#231f35] dark:text-[#e8e4f0]"
                    placeholder="Pro"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#6b7280] dark:text-[#8b8698]">Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                    className="w-full rounded-xl border border-[#e2e5f1] bg-[#f8f9fc] px-4 py-3 text-sm text-[#1a1a2e] outline-none transition-all duration-200 focus:border-[#7c5cfc]/50 focus:ring-2 focus:ring-[#7c5cfc]/20 dark:border-[#2a2540] dark:bg-[#231f35] dark:text-[#e8e4f0]"
                    placeholder="pro"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6b7280] dark:text-[#8b8698]">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-[#e2e5f1] bg-[#f8f9fc] px-4 py-3 text-sm text-[#1a1a2e] outline-none transition-all duration-200 focus:border-[#7c5cfc]/50 focus:ring-2 focus:ring-[#7c5cfc]/20 dark:border-[#2a2540] dark:bg-[#231f35] dark:text-[#e8e4f0]"
                  placeholder="For power users"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#6b7280] dark:text-[#8b8698]">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-[#e2e5f1] bg-[#f8f9fc] px-4 py-3 text-sm text-[#1a1a2e] outline-none transition-all duration-200 focus:border-[#7c5cfc]/50 focus:ring-2 focus:ring-[#7c5cfc]/20 dark:border-[#2a2540] dark:bg-[#231f35] dark:text-[#e8e4f0]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#6b7280] dark:text-[#8b8698]">Max Tokens/Day</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={form.maxTokensPerDay}
                    onChange={(e) => setForm({ ...form, maxTokensPerDay: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-[#e2e5f1] bg-[#f8f9fc] px-4 py-3 text-sm text-[#1a1a2e] outline-none transition-all duration-200 focus:border-[#7c5cfc]/50 focus:ring-2 focus:ring-[#7c5cfc]/20 dark:border-[#2a2540] dark:bg-[#231f35] dark:text-[#e8e4f0]"
                  />
                </div>
              </div>

              {/* Features Checkboxes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#6b7280] dark:text-[#8b8698]">Features</label>
                <div className="space-y-2 rounded-xl border border-[#e2e5f1] bg-[#f8f9fc] p-4 dark:border-[#2a2540] dark:bg-[#231f35]">
                  {ALL_FEATURES.map((feature) => {
                    const isSelected = form.selectedFeatures.includes(feature.slug)
                    return (
                      <label
                        key={feature.slug}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white dark:hover:bg-[#1a1726]"
                      >
                        <div
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-md border transition-colors",
                            isSelected ? "border-[#7c5cfc] bg-[#7c5cfc]" : "border-[#d1d5db] bg-transparent dark:border-[#4b5563]"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleFeature(feature.slug)}
                          className="sr-only"
                        />
                        <span className="text-sm text-[#1a1a2e] dark:text-[#e8e4f0]">{feature.name}</span>
                      </label>
                    )
                  })}
                </div>
                <p className="mt-1.5 text-xs text-[#9ca3af]">{form.selectedFeatures.length} features selected</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-[#e2e5f1] px-4 py-2.5 text-sm font-medium text-[#6b7280] transition-colors hover:bg-[#f1f3f9] dark:border-[#2a2540] dark:hover:bg-[#231f35]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/20 transition-all duration-300 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
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
