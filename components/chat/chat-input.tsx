"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Square, Paperclip, Mic } from "lucide-react"
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
    <div className="border-t border-[#2e2840] bg-[#1e1929] p-4">
      <div className="mx-auto flex w-full items-end gap-3 px-6">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            className="max-h-[200px] w-full resize-none rounded-2xl border border-[#2e2840] bg-[#231e30] px-5 py-3.5 pr-24 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
            disabled={isGenerating}
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-300 hover:bg-[#2a2438]">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-300 hover:bg-[#2a2438]">
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isGenerating ? (
          <Button onClick={onStop} className="h-11 w-11 shrink-0 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg">
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!input.trim()} className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-600/20 disabled:opacity-40 disabled:shadow-none">
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}