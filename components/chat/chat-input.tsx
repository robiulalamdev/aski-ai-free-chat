"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Square, Sparkles } from "lucide-react"
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
    <div className="border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            className="max-h-[200px] w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 pr-12 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900 dark:placeholder:text-zinc-500"
            disabled={isGenerating}
          />
          {!input.trim() && !isGenerating && (
            <Sparkles className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-300 dark:text-zinc-600" />
          )}
        </div>

        {isGenerating ? (
          <Button variant="destructive" size="icon" onClick={onStop} className="shrink-0">
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="premium" size="icon" onClick={handleSubmit} disabled={!input.trim()} className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
