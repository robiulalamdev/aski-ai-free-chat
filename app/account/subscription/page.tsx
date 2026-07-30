"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Loader2,
  Check,
  Zap,
  Settings,
  FileText,
  Shield,
  Building2,
  RefreshCw,
  Clock,
  Headphones,
  ArrowRight,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getAccountAction, getSubscriptionAction } from "@/app/actions/account"
import { createCheckoutSession, createPortalSession } from "@/app/actions/checkout"
import { FEATURE_MAP } from "@/lib/features"

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
  const router = useRouter()
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
        <Loader2 className="h-6 w-6 animate-spin text-[#7c5cfc]" />
      </div>
    )
  }

  const currentPlanData = plans.find((p) => p.slug === currentPlan)

  const getPlanIcon = (slug: string) => {
    switch (slug) {
      case "free":
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0ebff]">
            <Shield className="h-6 w-6 text-[#7c5cfc]" />
          </div>
        )
      case "pro":
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dcfce7]">
            <FileText className="h-6 w-6 text-[#22c55e]" />
          </div>
        )
      case "enterprise":
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dbeafe]">
            <Building2 className="h-6 w-6 text-[#3b82f6]" />
          </div>
        )
      default:
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0ebff]">
            <Zap className="h-6 w-6 text-[#7c5cfc]" />
          </div>
        )
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1a2e]">Subscription</h1>
        <p className="mt-2 text-[#6b7280]">Manage your plan, usage and billing details</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div
          className={cn(
            "mb-6 rounded-xl border px-4 py-3 text-sm",
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          )}
        >
          {message.text}
        </div>
      )}

      {/* Usage Card */}
      <div className="mb-8 rounded-2xl border border-[#e5e7eb] bg-white p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebff]">
              <Settings className="h-5 w-5 text-[#7c5cfc]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1a1a2e]">Today&apos;s Usage</h3>
              <p className="text-sm text-[#6b7280]">Tokens used</p>
            </div>
          </div>
          <Link
            href="/account/billing-history"
            className="flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#1a1a2e] transition-colors hover:bg-[#f5f5f7]"
          >
            <FileText className="h-4 w-4" />
            Billing History
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[#f0ebff] mb-3">
          <div
            className="h-full rounded-full bg-[#7c5cfc]"
            style={{ width: `${Math.min((dailyTokens / (currentPlanData?.maxTokensPerDay || 50000)) * 100, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#9ca3af]">Resets daily at midnight UTC</p>
          <p className="text-sm font-medium text-[#1a1a2e]">
            {dailyTokens.toLocaleString()} / {(currentPlanData?.maxTokensPerDay || 50000).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.slug
          const isPaid = plan.price > 0
          const isCheckout = checkoutLoading === plan.slug

          return (
            <div
              key={plan.slug}
              className={cn(
                "relative flex flex-col rounded-2xl border p-6 transition-all",
                isCurrent
                  ? "border-[#22c55e]/30 bg-[#dcfce7]/30"
                  : plan.slug === "pro"
                  ? "border-[#7c5cfc]/30 bg-[#f0ebff]/30"
                  : "border-[#e5e7eb] bg-white"
              )}
            >
              {/* Current Plan Badge */}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-[#22c55e] px-4 py-1 text-xs font-semibold text-white">
                    Current Plan
                  </span>
                </div>
              )}
              {plan.slug === "pro" && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-[#7c5cfc] px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-4">
                <div className="mb-3">{getPlanIcon(plan.slug)}</div>
                <h3 className="text-xl font-bold text-[#1a1a2e]">{plan.name}</h3>
                <p className="mt-1 text-sm text-[#6b7280]">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-5">
                {plan.price === 0 ? (
                  <span className="text-4xl font-bold text-[#1a1a2e]">Free</span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[#1a1a2e]">${plan.price}</span>
                    <span className="text-sm text-[#6b7280]">/month</span>
                  </div>
                )}
              </div>

              {/* Token Usage */}
              <div className="mb-6">
                <div className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-3",
                  plan.slug === "pro" || plan.slug === "enterprise"
                    ? "bg-[#dcfce7]/50"
                    : "bg-[#f0ebff]/50"
                )}>
                  <Zap className={cn(
                    "h-4 w-4",
                    plan.slug === "pro" || plan.slug === "enterprise"
                      ? "text-[#22c55e]"
                      : "text-[#7c5cfc]"
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    plan.slug === "pro" || plan.slug === "enterprise"
                      ? "text-[#22c55e]"
                      : "text-[#7c5cfc]"
                  )}>
                    {plan.maxTokensPerDay.toLocaleString()} tokens/day
                  </span>
                </div>
              </div>

              {/* Features List */}
              <ul className="mb-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-[#1a1a2e]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#22c55e]" />
                    {FEATURE_MAP[feature] || feature}
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div className="mt-auto">
                {isCurrent ? (
                  <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#22c55e]/30 bg-[#dcfce7]/50 px-4 py-3 text-sm font-medium text-[#22c55e]">
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
                        ? "bg-[#7c5cfc] text-white shadow-lg shadow-[#7c5cfc]/20 hover:shadow-[#7c5cfc]/30 hover:brightness-110 active:scale-[0.98]"
                        : "border border-[#e5e7eb] bg-white text-[#1a1a2e] hover:bg-[#f5f5f7] active:scale-[0.98]",
                      (isCheckout || !plan.isActive) && "opacity-50"
                    )}
                  >
                    {isCheckout ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Upgrade to {plan.name}
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-medium text-[#6b7280] cursor-default">
                    Current Plan
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Features */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0ebff]">
            <Lock className="h-5 w-5 text-[#7c5cfc]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a2e]">Secure & Private</h4>
            <p className="mt-0.5 text-xs text-[#6b7280]">Your data is encrypted and never shared</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dbeafe]">
            <RefreshCw className="h-5 w-5 text-[#3b82f6]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a2e]">Cancel Anytime</h4>
            <p className="mt-0.5 text-xs text-[#6b7280]">No long-term contracts or hidden fees</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dcfce7]">
            <Clock className="h-5 w-5 text-[#22c55e]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a2e]">Instant Upgrade</h4>
            <p className="mt-0.5 text-xs text-[#6b7280]">Get access immediately after payment</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffedd5]">
            <Headphones className="h-5 w-5 text-[#f97316]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a2e]">24/7 Support</h4>
            <p className="mt-0.5 text-xs text-[#6b7280]">Our team is here to help you succeed</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SubscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-[#7c5cfc]" />
        </div>
      }
    >
      <SubscriptionContent />
    </Suspense>
  )
}
