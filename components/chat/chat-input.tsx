"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Square } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ChatInput({
  onSend,
  isGenerating,
  onStop,
}: {
  onSend: (message: string) => void
  isGenerating: boolean
  onStop: () => void
}) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px"
    }
  }, [input])

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed || isGenerating) return
    onSend(trimmed)
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-[#e2e5f1] dark:border-[#2a2540] bg-white/80 dark:bg-[#14111e]/80 backdrop-blur-xl p-4">
      <div className="mx-auto flex w-full items-end gap-3 px-6">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            className="max-h-[200px] w-full resize-none rounded-2xl border border-[#e2e5f1] dark:border-[#2a2540] bg-[#f1f3f9]/50 dark:bg-[#231f35]/50 backdrop-blur-sm px-5 py-3.5 pr-14 text-sm text-[#1a1a2e] dark:text-[#e8e4f0] outline-none transition-all duration-200 placeholder:text-[#9ca3af] focus:border-[#7c5cfc]/50 focus:ring-2 focus:ring-[#7c5cfc]/20"
            disabled={isGenerating}
          />
        </div>

        {isGenerating ? (
          <Button onClick={onStop} className="h-11 w-11 shrink-0 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 transition-all duration-300 hover:shadow-red-500/40">
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!input.trim()} className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] text-white shadow-lg shadow-[#7c5cfc]/25 disabled:opacity-40 disabled:shadow-none transition-all duration-300 hover:shadow-[#7c5cfc]/40 hover:brightness-110 active:scale-95">
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
