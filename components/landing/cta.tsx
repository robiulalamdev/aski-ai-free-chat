import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-[#14111e]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-6 py-16 text-center sm:px-16 sm:py-24 shadow-2xl shadow-[#7c5cfc]/25">
          {/* Background decorations */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(255,255,255,0.15),transparent)]" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl" />
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Start Chatting?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Create a free account and start chatting with AI in seconds. No credit card required.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-[#7c5cfc] hover:bg-white/90 shadow-xl shadow-black/10 px-8 h-12 rounded-xl transition-all duration-300 hover:shadow-2xl hover:brightness-110 active:scale-[0.98]">
              <Link href="/chat/new">
                Sign Up Free
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
