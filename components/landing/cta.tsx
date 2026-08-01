import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="py-20 sm:py-28 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card relative overflow-hidden rounded-3xl p-8 sm:p-16 text-center border border-[var(--glass-border)]">
          {/* Background decorations */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,var(--glow-purple),transparent)]" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--primary)]/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[var(--primary)]/8 rounded-full blur-[80px]" />
          </div>

          <div className="flex justify-center mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--badge-bg)] glass-card">
              <Sparkles className="h-7 w-7 text-[var(--primary)]" />
            </div>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to supercharge your productivity?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Join thousands of users and experience the power of AI today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] hover:from-[#6d4ce6] hover:to-[#5d3cd6] text-white shadow-xl shadow-[rgba(124,92,252,0.25)] px-8 h-12 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,92,252,0.4)] hover:brightness-110 active:scale-[0.98]">
              <Link href="/chat/new">
                Get Started Free
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
