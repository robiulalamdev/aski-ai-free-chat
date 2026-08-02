import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function NotFoundPage({ title = "404", subtitle = "Page Not Found", description = "The page you're looking for doesn't exist or has been moved." }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#f0ebff] via-[#f8f9fc] to-[#e8e0ff] dark:from-[#0f0d18] dark:via-[#14111e] dark:to-[#1a1726] px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#7c5cfc]/5 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#7c5cfc]/5 blur-3xl" />
      </div>

      <div className="text-center relative z-10">
        <div className="glass-card rounded-3xl p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] mb-6 shadow-lg shadow-[#7c5cfc]/25">
            <span className="text-3xl font-bold text-white">{title}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">{subtitle}</h1>
          <p className="mt-3 text-sm text-[#6b7280] max-w-md">{description}</p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/25 transition-all duration-300 hover:shadow-[#7c5cfc]/40 hover:brightness-110 active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
