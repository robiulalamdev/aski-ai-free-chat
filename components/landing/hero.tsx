import Link from "next/link"
import { ArrowRight, Sparkles, Shield, Zap, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 bg-[var(--background)]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(124,58,237,0.12),transparent)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by DeepSeek AI
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Chat With AI
            <span className="block bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Fast, Free & Secure
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-400 sm:text-xl max-w-2xl mx-auto">
            Ask questions, write code, analyze data, and get instant answers. Your conversations are saved securely in the cloud.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-violet-600/25 px-8 h-12">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-[var(--border-custom)] bg-transparent text-zinc-300 hover:bg-[var(--surface)] hover:text-white h-12">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/10">
                <MessageSquare className="h-5 w-5 text-violet-400" />
              </div>
              <span className="text-xs text-zinc-500">Streaming Responses</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/10">
                <Shield className="h-5 w-5 text-violet-400" />
              </div>
              <span className="text-xs text-zinc-500">Secure & Private</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/10">
                <Zap className="h-5 w-5 text-violet-400" />
              </div>
              <span className="text-xs text-zinc-500">Free Plan Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
