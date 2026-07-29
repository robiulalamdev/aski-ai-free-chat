"use client"

import { Brain } from "lucide-react"

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-violet-400/30" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
            <Brain className="h-10 w-10 text-white" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold">FreeAI Chat</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Powered by DeepSeek
          </p>
        </div>

        <button
          onClick={onComplete}
          className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:from-violet-700 hover:to-indigo-700"
        >
          Start Chat
        </button>
      </div>
    </div>
  )
}