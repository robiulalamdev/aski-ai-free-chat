import Link from "next/link"
import { Check, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"

const FEATURE_MAP: Record<string, string> = {
  custom_prompts: "Custom System Prompts",
  export_data: "Export Chat History",
  priority_support: "Priority Support",
  team_management: "Team Management",
  dedicated_support: "Dedicated Support",
  custom_integrations: "Custom Integrations",
  advanced_analytics: "Advanced Analytics",
  custom_theme: "Custom Theme",
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
    <section id="pricing" className="py-20 sm:py-28 bg-[#13101c]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-zinc-400">
            Start free, upgrade when you need more.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.slug}
              className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg ${
                plan.popular
                  ? "border-violet-500/50 bg-[#231e30] shadow-violet-600/10"
                  : "border-[#2e2840] bg-[#1e1929] hover:border-[#3a3450]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 text-xs font-medium text-white shadow-lg">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.period && <span className="text-sm text-zinc-500">{plan.period}</span>}
              </div>
              <p className="mt-2 text-sm text-zinc-400">{plan.description}</p>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-violet-500/10 px-3 py-2">
                <Zap className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-400">{plan.tokensPerDay} tokens/day</span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature: string) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check className="h-4 w-4 text-violet-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild variant={plan.popular ? "default" : "outline"} className={`mt-6 w-full ${plan.popular ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700" : "border-[#2e2840] bg-transparent text-zinc-300 hover:bg-[#2a2438]"}`}>
                <Link href="/signup">{plan.price === "Free" ? "Start Chat" : "Upgrade"}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
