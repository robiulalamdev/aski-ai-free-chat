import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="py-20 sm:py-28 bg-[#13101c]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-16 text-center sm:px-16 sm:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(255,255,255,0.15),transparent)]" />
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Start Chatting?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-violet-100">
            No sign-up required. No credit card. Just you and the AI.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-violet-700 hover:bg-violet-50 shadow-lg px-8">
              <Link href="/chat">
                Start Chatting Free
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}