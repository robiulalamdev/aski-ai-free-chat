"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2, Check, Zap, CreditCard, ExternalLink, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAccountAction, getSubscriptionAction } from "@/app/actions/account"
import { createCheckoutSession, createPortalSession } from "@/app/actions/checkout"
import { ALL_FEATURES, FEATURE_MAP } from "@/lib/features"

interface Plan {
  id: string
  name: string
  slug: string
  description: string
  price: number
  maxTokensPerDay: number
  features: string[]
  isActive: boolean
}

function SubscriptionContent() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [currentPlan, setCurrentPlan] = useState("free")
  const [dailyTokens, setDailyTokens] = useState(0)
  const [plans, setPlans] = useState<Plan[]>([])
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    const success = searchParams.get("success")
    const canceled = searchParams.get("canceled")

    if (success) setMessage({ type: "success", text: "Payment successful! Your plan has been upgraded." })
    if (canceled) setMessage({ type: "error", text: "Payment was canceled." })

    Promise.all([getAccountAction(), getSubscriptionAction()]).then(([user, sub]) => {
      if (user) {
        setCurrentPlan(user.plan)
        setDailyTokens(user.tokensUsedToday || 0)
      }
      if (sub) setPlans(sub)
      setLoading(false)
    })
  }, [searchParams])

  const handleCheckout = async (slug: string) => {
    setCheckoutLoading(slug)
    const result = await createCheckoutSession(slug)
    if (result?.error) {
      setMessage({ type: "error", text: result.error })
      setCheckoutLoading(null)
    } else if (result?.url) {
      window.location.href = result.url
    }
  }

  const handlePortal = async () => {
    setPortalLoading(true)
    const result = await createPortalSession()
    if (result?.error) {
      setMessage({ type: "error", text: result.error })
      setPortalLoading(false)
    } else if (result?.url) {
      window.location.href = result.url
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
      </div>
    )
  }

  const currentPlanData = plans.find((p) => p.slug === currentPlan)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Subscription</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your plan and billing</p>
      </div>

      {message && (
        <div
          className={cn(
            "mb-6 rounded-xl border px-4 py-3 text-sm",
            message.type === "success"
              ? "border-green-500/20 bg-green-500/10 text-green-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          )}
        >
          {message.text}
        </div>
      )}

      {/* Current Usage */}
      <div className="mb-8 rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Today&apos;s Usage</h3>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-400 capitalize">{currentPlan} Plan</span>
            {currentPlan !== "free" && (
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border-custom)] px-3 py-1.5 text-xs font-medium text-zinc-400 hover:bg-[var(--surface-light)] transition-colors"
              >
                {portalLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CreditCard className="h-3 w-3" />}
                Manage Billing
              </button>
            )}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Tokens used</span>
            <span className="text-[var(--foreground)] font-medium">
              {dailyTokens.toLocaleString()} / {(currentPlanData?.maxTokensPerDay || 50000).toLocaleString()}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all"
              style={{ width: `${Math.min((dailyTokens / (currentPlanData?.maxTokensPerDay || 50000)) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500">Resets daily at midnight UTC</p>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.slug
          const isPaid = plan.price > 0
          const isCheckout = checkoutLoading === plan.slug

          return (
            <div
              key={plan.slug}
              className={cn(
                "relative rounded-2xl border p-6 transition-all",
                isCurrent
                  ? "border-green-500/30 bg-green-500/5"
                  : plan.slug === "pro"
                  ? "border-violet-500/30 bg-violet-500/5 shadow-lg shadow-violet-600/10"
                  : "border-[var(--border-custom)] bg-[var(--surface)]"
              )}
            >
              {plan.slug === "pro" && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
                  Current Plan
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-lg font-bold text-[var(--foreground)]">{plan.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{plan.description}</p>
              </div>

              <div className="mb-5">
                <span className="text-3xl font-bold text-[var(--foreground)]">
                  {plan.price === 0 ? "Free" : `$${plan.price}`}
                </span>
                {plan.price > 0 && <span className="text-sm text-zinc-500">/month</span>}
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 rounded-xl bg-violet-500/10 px-3 py-2">
                  <Zap className="h-4 w-4 text-violet-400" />
                  <span className="text-sm font-medium text-violet-400">{plan.maxTokensPerDay.toLocaleString()} tokens/day</span>
                </div>
              </div>

              <ul className="mb-6 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                    {FEATURE_MAP[feature] || feature}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-400">
                  <Check className="h-4 w-4" />
                  Current Plan
                </div>
              ) : isPaid ? (
                <button
                  onClick={() => handleCheckout(plan.slug)}
                  disabled={isCheckout || !plan.isActive}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    plan.slug === "pro"
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 hover:brightness-110 active:scale-[0.98]"
                      : "border border-[var(--border-custom)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-light)] active:scale-[0.98]",
                    (isCheckout || !plan.isActive) && "opacity-50"
                  )}
                >
                  {isCheckout ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4" />
                      Upgrade to {plan.name}
                    </>
                  )}
                </button>
              ) : (
                <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-custom)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-zinc-500 cursor-default">
                  Free Plan
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function SubscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
        </div>
      }
    >
      <SubscriptionContent />
    </Suspense>
  )
}
