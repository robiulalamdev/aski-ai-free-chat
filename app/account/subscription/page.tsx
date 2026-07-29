"use client"

import { useState, useEffect } from "react"
import { Loader2, Check, Zap, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAccountAction } from "@/app/actions/account"

const plans = [
  {
    name: "Free",
    slug: "free",
    price: "$0",
    period: "forever",
    tokensPerDay: "50,000",
    tokensPerDayNum: 50000,
    description: "Get started with Aria for free",
    features: [
      "50,000 tokens per day",
      "Basic AI responses",
      "1 conversation at a time",
      "Standard response speed",
    ],
    highlighted: false,
    buttonText: "Current Plan",
    disabled: true,
  },
  {
    name: "Pro",
    slug: "pro",
    price: "$9.99",
    period: "/month",
    tokensPerDay: "500,000",
    tokensPerDayNum: 500000,
    description: "For power users who need more",
    features: [
      "500,000 tokens per day",
      "Advanced AI reasoning",
      "Unlimited conversations",
      "Priority response speed",
      "Custom system prompts",
      "Early access to new features",
    ],
    highlighted: true,
    buttonText: "Upgrade to Pro",
    disabled: false,
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    price: "$29.99",
    period: "/month",
    tokensPerDay: "2,000,000",
    tokensPerDayNum: 2000000,
    description: "For teams and businesses",
    features: [
      "2,000,000 tokens per day",
      "Advanced AI reasoning",
      "Unlimited conversations",
      "Fastest response speed",
      "Custom system prompts",
      "Priority support",
      "API access",
      "Team collaboration",
    ],
    highlighted: false,
    buttonText: "Upgrade to Enterprise",
    disabled: false,
  },
]

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(true)
  const [currentPlan, setCurrentPlan] = useState("free")
  const [dailyTokens, setDailyTokens] = useState(0)

  useEffect(() => {
    getAccountAction().then((user) => {
      if (user) {
        setCurrentPlan(user.plan)
      }
      setLoading(false)
    })
  }, [])

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
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Subscription</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your plan and billing</p>
      </div>

      {/* Current Usage */}
      <div className="mb-8 rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Today&apos;s Usage</h3>
          <span className="rounded-lg bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-400 capitalize">{currentPlan} Plan</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Tokens used</span>
            <span className="text-[var(--foreground)] font-medium">{dailyTokens.toLocaleString()} / {plans.find((p) => p.slug === currentPlan)?.tokensPerDay || "50,000"}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all"
              style={{ width: `${Math.min((dailyTokens / (plans.find((p) => p.slug === currentPlan)?.tokensPerDayNum || 50000)) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500">Resets daily at midnight UTC</p>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.slug
          return (
            <div
              key={plan.slug}
              className={cn(
                "relative rounded-2xl border p-6 transition-all",
                plan.highlighted
                  ? "border-violet-500/30 bg-violet-500/5 shadow-lg shadow-violet-600/10"
                  : "border-[var(--border-custom)] bg-[var(--surface)]"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-lg font-bold text-[var(--foreground)]">{plan.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{plan.description}</p>
              </div>

              <div className="mb-5">
                <span className="text-3xl font-bold text-[var(--foreground)]">{plan.price}</span>
                <span className="text-sm text-zinc-500">{plan.period}</span>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 rounded-xl bg-violet-500/10 px-3 py-2">
                  <Zap className="h-4 w-4 text-violet-400" />
                  <span className="text-sm font-medium text-violet-400">{plan.tokensPerDay} tokens/day</span>
                </div>
              </div>

              <ul className="mb-6 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                disabled={plan.disabled || isCurrent}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  isCurrent
                    ? "border border-[var(--border-custom)] bg-[var(--surface)] text-zinc-500 cursor-default"
                    : plan.highlighted
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 hover:brightness-110 active:scale-[0.98]"
                    : "border border-[var(--border-custom)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-light)] active:scale-[0.98]"
                )}
              >
                {isCurrent ? "Current Plan" : plan.buttonText}
                {!isCurrent && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
