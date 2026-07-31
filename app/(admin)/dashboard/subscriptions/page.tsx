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
        <Loader2 className="h-6 w-6 animate-spin text-[#7c5cfc]" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">Subscriptions</h1>
          <p className="mt-1 text-sm text-[#6b7280]">{subs.length} plans</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#7c5cfc]/30 hover:brightness-110 active:scale-[0.98]"
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
            className={`glass-card rounded-2xl p-6 transition-all duration-300 ${
              !sub.isActive ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">{sub.name}</h3>
                <p className="text-xs text-[#9ca3af]">{sub.slug}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleToggle(sub.id)} className="text-[#9ca3af] hover:text-[#7c5cfc] transition-colors">
                  {sub.isActive ? <ToggleRight className="h-5 w-5 text-[#10b981]" /> : <ToggleLeft className="h-5 w-5" />}
                </button>
                <button onClick={() => openEdit(sub)} className="text-[#9ca3af] hover:text-[#7c5cfc] transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(sub.id)} className="text-[#9ca3af] hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="mb-4 text-sm text-[#6b7280]">{sub.description}</p>

            <div className="mb-4">
              <span className="text-3xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">${sub.price}</span>
              <span className="text-sm text-[#9ca3af]">/month</span>
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#7c5cfc]/10 px-3 py-2">
              <Zap className="h-4 w-4 text-[#7c5cfc]" />
              <span className="text-sm font-semibold text-[#7c5cfc]">{sub.maxTokensPerDay.toLocaleString()} tokens/day</span>
            </div>

            <div className="space-y-1.5">
              {getFeaturesArray(sub.features).map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-[#6b7280]">
                  <Check className="h-3 w-3 shrink-0 text-[#7c5cfc]" />
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
          <div className="w-full max-w-lg rounded-2xl border border-[#e2e5f1] dark:border-[#2a2540] bg-white dark:bg-[#1a1726] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">
                {editingId ? "Edit Plan" : "Create Plan"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#9ca3af] hover:text-[#1a1a2e] dark:hover:text-[#e8e4f0] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-500 dark:text-red-400">{error}</div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#6b7280]">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-[#e2e5f1] dark:border-[#2a2540] bg-[#f8f9fc] dark:bg-[#231f35] px-4 py-3 text-sm text-[#1a1a2e] dark:text-[#e8e4f0] outline-none transition-all duration-200 focus:border-[#7c5cfc]/50 focus:ring-2 focus:ring-[#7c5cfc]/20"
                    placeholder="Pro"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#6b7280]">Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                    className="w-full rounded-xl border border-[#e2e5f1] dark:border-[#2a2540] bg-[#f8f9fc] dark:bg-[#231f35] px-4 py-3 text-sm text-[#1a1a2e] dark:text-[#e8e4f0] outline-none transition-all duration-200 focus:border-[#7c5cfc]/50 focus:ring-2 focus:ring-[#7c5cfc]/20"
                    placeholder="pro"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6b7280]">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-[#e2e5f1] dark:border-[#2a2540] bg-[#f8f9fc] dark:bg-[#231f35] px-4 py-3 text-sm text-[#1a1a2e] dark:text-[#e8e4f0] outline-none transition-all duration-200 focus:border-[#7c5cfc]/50 focus:ring-2 focus:ring-[#7c5cfc]/20"
                  placeholder="For power users"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#6b7280]">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-[#e2e5f1] dark:border-[#2a2540] bg-[#f8f9fc] dark:bg-[#231f35] px-4 py-3 text-sm text-[#1a1a2e] dark:text-[#e8e4f0] outline-none transition-all duration-200 focus:border-[#7c5cfc]/50 focus:ring-2 focus:ring-[#7c5cfc]/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#6b7280]">Max Tokens/Day</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={form.maxTokensPerDay}
                    onChange={(e) => setForm({ ...form, maxTokensPerDay: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-[#e2e5f1] dark:border-[#2a2540] bg-[#f8f9fc] dark:bg-[#231f35] px-4 py-3 text-sm text-[#1a1a2e] dark:text-[#e8e4f0] outline-none transition-all duration-200 focus:border-[#7c5cfc]/50 focus:ring-2 focus:ring-[#7c5cfc]/20"
                  />
                </div>
              </div>

              {/* Features Checkboxes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#6b7280]">Features</label>
                <div className="space-y-2 rounded-xl border border-[#e2e5f1] dark:border-[#2a2540] bg-[#f8f9fc] dark:bg-[#231f35] p-4">
                  {ALL_FEATURES.map((feature) => {
                    const isSelected = form.selectedFeatures.includes(feature.slug)
                    return (
                      <label
                        key={feature.slug}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white dark:hover:bg-[#1a1726]"
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                            isSelected
                              ? "border-[#7c5cfc] bg-[#7c5cfc]"
                              : "border-[#d1d5db] dark:border-[#4b5563] bg-transparent"
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
                className="rounded-xl border border-[#e2e5f1] dark:border-[#2a2540] px-4 py-2.5 text-sm font-medium text-[#6b7280] hover:bg-[#f1f3f9] dark:hover:bg-[#231f35] transition-colors"
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
