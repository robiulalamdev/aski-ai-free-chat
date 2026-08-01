import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 bg-[#f8f9fc] dark:bg-[#0f0d18]">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(124,92,252,0.12),transparent)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#7c5cfc]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#7c5cfc]/3 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#6d4ce6]/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#7c5cfc]/20 bg-[#f0ebff]/80 backdrop-blur-sm px-4 py-1.5 text-sm text-[#7c5cfc] dark:bg-[#7c5cfc]/10 dark:text-[#8b6fff]">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by AI
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-[#1a1a2e] dark:text-[#e8e4f0] sm:text-6xl lg:text-7xl">
            Chat With AI
            <span className="block bg-gradient-to-r from-[#7c5cfc] via-[#6d4ce6] to-[#7c5cfc] bg-clip-text text-transparent">
              Fast, Free & Secure
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg leading-8 text-[#6b7280] sm:text-xl max-w-2xl mx-auto">
            Ask questions, write code, analyze data, and get instant answers.
            Your conversations are saved securely in the cloud.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] hover:from-[#6d4ce6] hover:to-[#5d3cd6] text-white shadow-xl shadow-[#7c5cfc]/25 px-8 h-12 rounded-xl transition-all duration-300 hover:shadow-[#7c5cfc]/40 hover:brightness-110 active:scale-[0.98]"
            >
              <Link href="/chat/new">
                Get Started Free
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-[#e2e5f1] bg-white/50 backdrop-blur-sm text-[#1a1a2e] hover:bg-[#f1f3f9] h-12 rounded-xl dark:border-[#2a2540] dark:bg-[#1a1726]/50 dark:text-[#e8e4f0] dark:hover:bg-[#231f35] transition-all duration-300"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0ebff] dark:bg-[#7c5cfc]/10">
                <MessageSquare className="h-5 w-5 text-[#7c5cfc]" />
              </div>
              <span className="text-xs font-medium text-[#6b7280]">Streaming Responses</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dcfce7] dark:bg-emerald-500/10">
                <Shield className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="text-xs font-medium text-[#6b7280]">Secure & Private</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dbeafe] dark:bg-blue-500/10">
                <Zap className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-xs font-medium text-[#6b7280]">Free Plan Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
