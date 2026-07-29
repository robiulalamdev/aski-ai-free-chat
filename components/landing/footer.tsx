import { Brain } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium">
            <Brain className="h-5 w-5 text-violet-600" />
            FreeAI Chat
          </Link>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Built with privacy in mind. &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
