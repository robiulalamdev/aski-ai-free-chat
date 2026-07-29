import { Brain } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-[#2e2840] bg-[#13101c]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-sm font-medium text-white">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <Brain className="h-3.5 w-3.5 text-white" />
            </div>
            NexaChat
          </Link>
          <p className="text-sm text-zinc-500">
            Built with privacy in mind. &copy; {new Date().getFullYear()} NexaChat
          </p>
        </div>
      </div>
    </footer>
  )
}