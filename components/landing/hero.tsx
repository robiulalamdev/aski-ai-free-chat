import Link from "next/link"
import { ArrowRight, Sparkles, Shield, Zap, MessageSquare, Brain, Send, ThumbsUp, ThumbsDown, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 bg-[var(--hero-bg)]">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_40%,var(--glow-purple),transparent)]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[var(--primary)]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--primary)]/3 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-[var(--primary)]/4 rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left: Text Content */}
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--badge-bg)] px-4 py-1.5 text-sm font-medium text-[var(--primary)] glass-card">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by Advanced AI
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Chat With AI
              <span className="block text-gradient-brand">
                Fast, Free & Secure
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Ask questions, write code, analyze data, and get instant answers.
              Your conversations are saved securely in the cloud.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] hover:from-[#6d4ce6] hover:to-[#5d3cd6] text-white shadow-xl shadow-[rgba(124,92,252,0.25)] px-7 h-12 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,92,252,0.4)] hover:brightness-110 active:scale-[0.98]"
              >
                <Link href="/chat/new">
                  Get Started Free
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="glass-card border-[var(--glass-border)] text-foreground hover:bg-[var(--badge-bg)] h-12 rounded-xl transition-all duration-300"
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>

            {/* User Avatars */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/60 flex items-center justify-center text-[10px] font-bold text-white">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-foreground">50K+</span>
                <span className="text-sm text-muted-foreground">Trusted by 50,000+ users worldwide</span>
              </div>
            </div>
          </div>

          {/* Right: Chat Mockup */}
          <div className="relative mx-auto max-w-lg lg:mx-0">
            <div className="glass-card rounded-2xl p-4 sm:p-5 animate-float">
              {/* Chat Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--glass-border)]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-foreground">NexaChat</span>
                <div className="ml-auto h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 py-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-gradient-brand px-4 py-2.5 text-sm text-white shadow-lg shadow-[var(--glow-purple)]">
                    Explain quantum computing in simple terms.
                    <div className="mt-1 text-[10px] text-white/60 text-right">10:30 AM</div>
                  </div>
                </div>

                {/* AI Message */}
                <div className="flex justify-start">
                  <div className="max-w-[85%] glass-card rounded-2xl rounded-bl-md px-4 py-3 text-sm text-foreground">
                    <p className="leading-relaxed">
                      Quantum computing uses qubits, which can exist in multiple states at once thanks to superposition. This allows quantum computers to solve certain problems much faster than classical computers.
                    </p>
                    <div className="mt-2 text-[10px] text-muted-foreground">10:30 AM</div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <button className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-[var(--badge-bg)] transition-colors">
                        <Copy className="h-3 w-3" />
                      </button>
                      <button className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-[var(--badge-bg)] transition-colors">
                        <ThumbsUp className="h-3 w-3" />
                      </button>
                      <button className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-[var(--badge-bg)] transition-colors">
                        <ThumbsDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--input-glass-bg)] px-4 py-2.5">
                <span className="text-sm text-muted-foreground flex-1">Ask anything...</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white">
                  <Send className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -inset-4 -z-10 bg-[var(--primary)]/5 rounded-3xl blur-2xl" />
          </div>
        </div>

        {/* Feature Highlights below hero */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-3xl mx-auto lg:max-w-none">
          <div className="glass-card group rounded-2xl p-5 flex items-start gap-4 hover-glow">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--badge-bg)]">
              <MessageSquare className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Smart AI Responses</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Get accurate and helpful answers instantly from advanced AI models.
              </p>
            </div>
          </div>

          <div className="glass-card group rounded-2xl p-5 flex items-start gap-4 hover-glow">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
              <Shield className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Secure & Private</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Your data is encrypted and your privacy is our top priority.
              </p>
            </div>
          </div>

          <div className="glass-card group rounded-2xl p-5 flex items-start gap-4 hover-glow">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <Zap className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Free Plan Available</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Start chatting for free. Upgrade anytime for more power.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
