import Link from "next/link"
import { Check, Zap, Shield, Building2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"

const FEATURE_MAP: Record<string, string> = {
  custom_prompts: "Custom System Prompts",
  export_data: "Export Chat History",
  share_chat: "Share Conversations",
  priority_support: "Priority Support",
  team_management: "Team Management",
  dedicated_support: "Dedicated Support",
  custom_integrations: "Custom Integrations",
  advanced_analytics: "Advanced Analytics",
  custom_theme: "Custom Theme",
  code_generator: "Code Generator",
  resume_builder: "Resume Builder",
}

const PLAN_ICONS: Record<string, typeof Shield> = {
  free: Shield,
  pro: FileText,
  enterprise: Building2,
}

const PLAN_COLORS: Record<string, { color: string; bg: string }> = {
  free: { color: "#8b6fff", bg: "rgba(139, 111, 255, 0.1)" },
  pro: { color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)" },
  enterprise: { color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
}

async function getPlans() {
  try {
    const plans = await prisma.subscription.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    })
    return plans.map((p) => ({
      name: p.name,
      price: p.price === 0 ? "Free" : `$${Math.round(p.price)}`,
      period: p.price > 0 ? "/month" : undefined,
      description: p.description,
      features: (() => { try { return JSON.parse(p.features).map((f: string) => FEATURE_MAP[f] || f) } catch { return [] } })(),
      tokensPerDay: p.maxTokensPerDay.toLocaleString(),
      slug: p.slug,
      popular: p.slug === "pro",
    }))
  } catch {
    return []
  }
}

export async function Pricing() {
  const plans = await getPlans()

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--badge-bg)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
            Pricing
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free, upgrade when you need more.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = PLAN_ICONS[plan.slug] || Shield
            const colors = PLAN_COLORS[plan.slug] || PLAN_COLORS.free

            return (
              <div
                key={plan.slug}
                className={`relative flex flex-col glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? "border-[var(--primary)]/25 shadow-lg shadow-[var(--glow-purple)]"
                    : "hover-glow"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-brand px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-[var(--glow-purple)]">
                    Most Popular
                  </div>
                )}

                {/* Plan Icon */}
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl mb-4"
                  style={{ backgroundColor: colors.bg }}
                >
                  <Icon className="h-6 w-6" style={{ color: colors.color }} />
                </div>

                <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-[var(--badge-bg)] px-3 py-2">
                  <Zap className="h-4 w-4 text-[var(--primary)]" />
                  <span className="text-sm font-medium text-[var(--primary)]">{plan.tokensPerDay} tokens/day</span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature: string) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={plan.popular ? "default" : "outline"}
                  className={`mt-6 w-full rounded-xl ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] hover:from-[#6d4ce6] hover:to-[#5d3cd6] text-white shadow-lg shadow-[rgba(124,92,252,0.25)] hover:shadow-[0_0_24px_rgba(124,92,252,0.4)] hover:brightness-110"
                      : "glass-card border-[var(--glass-border)] text-foreground hover:bg-[var(--badge-bg)]"
                  }`}
                >
                  <Link href="/signup">{plan.price === "Free" ? "Start Chat" : "Upgrade"}</Link>
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
