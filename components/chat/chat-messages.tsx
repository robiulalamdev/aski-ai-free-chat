"use client"

import { useEffect, useRef } from "react"
import { Bot, Loader2, CheckCheck } from "lucide-react"
import { MarkdownRenderer } from "./markdown-renderer"
import type { Message } from "@/types/chat"

function formatTime(ts: number): string {
  const d = new Date(ts)
  const h = d.getHours()
  const m = d.getMinutes().toString().padStart(2, "0")
  const ampm = h >= 12 ? "PM" : "AM"
  const hour12 = h % 12 || 12
  return `${hour12}:${m} ${ampm}`
}

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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 mb-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">How can I help you today?</h3>
          <p className="mt-2 text-sm text-zinc-500">
            Ask me anything — I&apos;m powered by DeepSeek AI.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 w-full">
      {messages.map((message) => (
        <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
          {message.role === "assistant" && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
          )}

          <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} max-w-[75%]`}>
            <div
              className={`rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-md"
                  : "bg-[#231e30] text-zinc-100 rounded-bl-md"
              }`}
            >
              {message.role === "user" ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
              ) : (
                <div className="text-sm leading-relaxed">
                  <MarkdownRenderer content={message.content} />
                </div>
              )}
            </div>
            <div className={`flex items-center gap-1.5 mt-1.5 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
              <span className="text-[10px] text-zinc-600">{formatTime(message.createdAt)}</span>
              {message.role === "user" && (
                <CheckCheck className="h-3.5 w-3.5 text-violet-400" />
              )}
            </div>
          </div>

          {message.role === "user" && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2a2438] border border-[#2e2840]">
              <span className="text-xs font-semibold text-zinc-300">N</span>
            </div>
          )}
        </div>
      ))}

      {isGenerating && streamingText && (
        <div className="flex gap-3 justify-start">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col items-start max-w-[75%]">
            <div className="rounded-2xl rounded-bl-md bg-[#231e30] px-4 py-3">
              <div className="text-sm leading-relaxed">
                <MarkdownRenderer content={streamingText} />
                <span className="inline-block h-4 w-1.5 animate-pulse bg-violet-500 ml-0.5 rounded-sm align-text-bottom" />
              </div>
            </div>
          </div>
        </div>
      )}

      {isGenerating && !streamingText && (
        <div className="flex gap-3 justify-start">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="rounded-2xl rounded-bl-md bg-[#231e30] px-4 py-3">
            <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
