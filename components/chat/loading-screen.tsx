"use client"

import { Sparkles } from "lucide-react"

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-violet-600/20" />
          <div className="relative flex h-20 w-20 items-center justify-center">
            <img src="/logo.png" alt="NexaChat" className="h-20 w-20 object-contain" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">NexaChat</h2>
          <p className="mt-2 text-sm text-[var(--muted)] flex items-center gap-1.5 justify-center">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            Powered by AI
          </p>
        </div>

        <button
          onClick={onComplete}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3 text-sm font-medium text-white shadow-lg shadow-violet-600/25 transition-all hover:shadow-violet-600/40 hover:brightness-110 active:scale-[0.98]"
        >
          Start Chat
        </button>
      </div>
    </div>
  )
}