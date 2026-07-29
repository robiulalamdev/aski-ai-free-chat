"use client"

import { useEffect, useRef, useState } from "react"
import { Bot, Loader2, CheckCheck, RefreshCw, Copy, Check } from "lucide-react"
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

function AssistantMessage({
  message,
  isLast,
  onRegenerate,
}: {
  message: Message
  isLast: boolean
  onRegenerate?: () => void
}) {
  const [copied, setCopied] = useState(false)

  const copyMessage = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex gap-3 justify-start group">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/20">
        <Bot className="h-5 w-5 text-white" />
      </div>
      <div className="flex flex-col items-start max-w-[75%]">
        <div className="rounded-2xl rounded-bl-md bg-[#231e30] px-4 py-3">
          <div className="text-sm leading-relaxed">
            <MarkdownRenderer content={message.content} />
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-zinc-600">{formatTime(message.createdAt)}</span>
          <button onClick={copyMessage} className="rounded p-1 text-zinc-500 hover:text-zinc-300 hover:bg-[#2a2438] transition-colors" title="Copy message">
            {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
          </button>
          {isLast && onRegenerate && (
            <button onClick={onRegenerate} className="rounded p-1 text-zinc-500 hover:text-zinc-300 hover:bg-[#2a2438] transition-colors" title="Regenerate response">
              <RefreshCw className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function ChatMessages({
  messages,
  isGenerating,
  streamingText,
  onRegenerate,
}: {
  messages: Message[]
  isGenerating: boolean
  streamingText?: string
  onRegenerate?: () => void
}) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log("[ChatMessages] RENDER msgs:", messages.length, "generating:", isGenerating, "stream:", streamingText ? streamingText.substring(0, 30) : "empty")
  })

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
            Ask me anything — I&apos;m powered by AI.
          </p>
        </div>
      </div>
    )
  }

  const lastAssistantIdx = [...messages].reverse().findIndex((m) => m.role === "assistant")
  const lastAssistantId = lastAssistantIdx !== -1 ? messages[messages.length - 1 - lastAssistantIdx].id : null

  return (
    <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 w-full">
      {messages.map((message) => {
        if (message.role === "user") {
          return (
            <div key={message.id} className="flex gap-3 justify-end">
              <div className="flex flex-col items-end max-w-[75%]">
                <div className="rounded-2xl rounded-br-md bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-white">{message.content}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] text-zinc-600">{formatTime(message.createdAt)}</span>
                  <CheckCheck className="h-3.5 w-3.5 text-violet-400" />
                </div>
              </div>
            </div>
          )
        }

        return (
          <AssistantMessage
            key={message.id}
            message={message}
            isLast={message.id === lastAssistantId}
            onRegenerate={message.id === lastAssistantId ? onRegenerate : undefined}
          />
        )
      })}

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
