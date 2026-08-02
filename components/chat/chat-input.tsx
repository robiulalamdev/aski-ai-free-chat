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
    <div className="border-t border-[#e2e5f1] dark:border-[#2a2540] bg-white/80 dark:bg-[#14111e]/80 backdrop-blur-xl px-4 py-3">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end rounded-2xl border border-[#e2e5f1] dark:border-[#2a2540] bg-[#f1f3f9]/50 dark:bg-[#231f35]/50 backdrop-blur-sm transition-all duration-200 focus-within:border-[#7c5cfc]/50 focus-within:ring-2 focus-within:ring-[#7c5cfc]/20">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            className="max-h-[200px] min-h-[44px] flex-1 resize-none bg-transparent px-4 py-3 text-sm text-[#1a1a2e] dark:text-[#e8e4f0] outline-none placeholder:text-[#9ca3af]"
            disabled={isGenerating}
          />
          {isGenerating ? (
            <Button
              onClick={onStop}
              className="mr-2 mb-2 h-8 w-8 shrink-0 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-sm transition-all duration-200"
            >
              <Square className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="mr-2 mb-2 h-8 w-8 shrink-0 rounded-lg bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] text-white shadow-sm disabled:opacity-40 disabled:shadow-none transition-all duration-200 hover:brightness-110"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
