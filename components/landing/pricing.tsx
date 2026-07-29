import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For casual users",
    features: ["Local AI model", "Basic tools", "1 conversation"],
    cta: "Start Chat",
    href: "/chat",
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For power users",
    features: ["Faster models", "All tools", "Unlimited conversations", "Custom prompts"],
    cta: "Coming Soon",
    href: "#",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$29",
    period: "/month",
    description: "For teams",
    features: ["Priority models", "API access", "Team management", "Dedicated support"],
    cta: "Coming Soon",
    href: "#",
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Start free, upgrade when you need more.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col transition-all duration-300 hover:shadow-lg ${
                plan.popular ? "border-violet-500 shadow-violet-200 dark:shadow-violet-900/20" : ""
              }`}
            >
              {plan.popular && (
                <Badge variant="premium" className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-sm text-zinc-500">{plan.period}</span>}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-violet-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant={plan.popular ? "premium" : "outline"} className="w-full">
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
