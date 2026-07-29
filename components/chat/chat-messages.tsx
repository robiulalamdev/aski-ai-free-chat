"use client"

import { useEffect, useRef } from "react"
import { Bot, User, Loader2 } from "lucide-react"
import { MarkdownRenderer } from "./markdown-renderer"
import type { Message } from "@/types/chat"

export function ChatMessages({
  messages,
  isGenerating,
  streamingText,
}: {
  messages: Message[]
  isGenerating: boolean
  streamingText?: string
}) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingText])

  if (messages.length === 0 && !streamingText) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <Bot className="mx-auto h-12 w-12 text-violet-500/50" />
          <h3 className="mt-4 text-lg font-medium">Start a conversation</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Ask anything — the AI runs locally in your browser.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
      {messages.map((message) => (
        <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
          {message.role === "assistant" && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600">
              <Bot className="h-4 w-4 text-white" />
            </div>
          )}

          <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user" ? "bg-violet-600 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}>
            {message.role === "user" ? (
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            ) : (
              <div className="text-sm">
                <MarkdownRenderer content={message.content} />
              </div>
            )}
          </div>

          {message.role === "user" && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
              <User className="h-4 w-4" />
            </div>
          )}
        </div>
      ))}

      {isGenerating && streamingText && (
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
            <div className="text-sm">
              <MarkdownRenderer content={streamingText} />
              <span className="inline-block h-4 w-1.5 animate-pulse bg-violet-600 ml-0.5 rounded-sm align-text-bottom" />
            </div>
          </div>
        </div>
      )}

      {isGenerating && !streamingText && (
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
            <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
