import { UserPlus, MessageCircle, Zap } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    number: "1",
    title: "Create Your Account",
    description: "Sign up in seconds and get access to powerful AI chat.",
  },
  {
    icon: MessageCircle,
    number: "2",
    title: "Ask Anything",
    description: "Ask questions, generate content, write code, analyze data, and more.",
  },
  {
    icon: Zap,
    number: "3",
    title: "Get Instant Answers",
    description: "Receive accurate, high-quality responses in real-time.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--badge-bg)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
            How It Works
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Get started in 3 simple steps
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 relative">
          {/* Connector lines */}
          <div className="hidden sm:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[var(--primary)]/20 to-transparent" />

          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="flex flex-col items-center text-center relative">
                {/* Step circle */}
                <div className="relative mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--badge-bg)] glass-card">
                    <Icon className="h-8 w-8 text-[var(--primary)]" />
                  </div>
                  <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white shadow-lg shadow-[var(--glow-purple)]">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
