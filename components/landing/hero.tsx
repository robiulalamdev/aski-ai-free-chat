import Link from "next/link"
import { ArrowRight, Sparkles, Brain, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 bg-[#1e1929]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(124,58,237,0.15),transparent)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
              Powered by Advanced AI
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            AI Chat That
            <span className="block bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Respects Your Privacy
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-400 sm:text-xl">
            No servers. No tracking. No subscriptions. Chat with AI — fast, free, and private.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-600/25 px-8">
              <Link href="/chat/new">
                Start Chatting Free
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-[#2e2840] bg-transparent text-zinc-300 hover:bg-[#2a2438] hover:text-white">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-violet-400" />
              Start Chatting
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-violet-400" />
              Server-Side API
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-violet-400" />
              Free to Use
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}