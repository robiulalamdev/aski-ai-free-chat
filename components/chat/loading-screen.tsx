"use client"

import { Brain, Sparkles } from "lucide-react"

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1e1929]">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-violet-600/20" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-2xl shadow-violet-600/30">
            <Brain className="h-10 w-10 text-white" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">NexaChat</h2>
          <p className="mt-2 text-sm text-zinc-500 flex items-center gap-1.5 justify-center">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            Powered by DeepSeek AI
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