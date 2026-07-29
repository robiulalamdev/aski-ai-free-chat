import Link from "next/link"
import { ArrowRight, Sparkles, Brain, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(124,58,237,0.08),transparent)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="premium" className="mb-6">
            <Sparkles className="mr-1 h-3 w-3" />
            AI Runs in Your Browser
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            AI Chat That
            <span className="block bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Respects Your Privacy
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400 sm:text-xl">
            No servers. No tracking. No subscriptions. The AI model runs entirely in your browser using WebGPU.
            Chat offline, stay private, and never pay per message.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Button asChild variant="premium" size="lg">
              <Link href="/chat">
                Start Chatting Free
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-violet-500" />
              Local AI
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-violet-500" />
              100% Private
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Free Forever
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
