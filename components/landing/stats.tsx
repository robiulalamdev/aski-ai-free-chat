import { Users, MessageSquare, Shield, Zap } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Active Users",
    color: "#8b6fff",
    bg: "rgba(139, 111, 255, 0.1)",
  },
  {
    icon: MessageSquare,
    value: "2M+",
    label: "Messages Sent",
    color: "#7c5cfc",
    bg: "rgba(124, 92, 252, 0.1)",
  },
  {
    icon: Shield,
    value: "99.9%",
    label: "Uptime",
    color: "#22c55e",
    bg: "rgba(34, 197, 94, 0.1)",
  },
  {
    icon: Zap,
    value: "100%",
    label: "Secure",
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.1)",
  },
]

export function Stats() {
  return (
    <section className="py-14 sm:py-16 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex flex-col items-center gap-3 text-center">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: stat.bg }}
                  >
                    <Icon className="h-5 w-5" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
