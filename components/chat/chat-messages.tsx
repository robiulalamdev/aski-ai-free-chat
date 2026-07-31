"use client"

import { useEffect, useRef, useState } from "react"
import { Bot, Loader2, CheckCheck, RefreshCw, Copy, Check, FileText, Eye } from "lucide-react"
import { MarkdownRenderer } from "./markdown-renderer"
import { triggerVersionSelect } from "./tool-preview-panel"
import type { Message } from "@/types/chat"

function formatTime(ts: number): string {
  const d = new Date(ts)
  const h = d.getHours()
  const m = d.getMinutes().toString().padStart(2, "0")
  const ampm = h >= 12 ? "PM" : "AM"
  const hour12 = h % 12 || 12
  return `${hour12}:${m} ${ampm}`
}

function stripCodeBlocks(content: string): string {
  return content.replace(/```[\s\S]*?```/g, "").trim()
}

function ResumeStatusMessage({ content }: { content: string }) {
  const textOnly = stripCodeBlocks(content)
  return (
    <div className="flex items-start gap-2">
      <FileText className="h-4 w-4 text-[#7c5cfc] mt-0.5 shrink-0" />
      <div>
        {textOnly ? (
          <p className="text-sm text-[#1a1a2e] dark:text-[#e8e4f0]">{textOnly}</p>
        ) : (
          <p className="text-sm text-[#9ca3af] italic">Resume updated</p>
        )}
      </div>
    </div>
  )
}

function AssistantMessage({
  message,
  isLast,
  onRegenerate,
  toolType,
  versionIndex,
}: {
  message: Message
  isLast: boolean
  onRegenerate?: () => void
  toolType?: string | null
  versionIndex?: number
}) {
  const [copied, setCopied] = useState(false)
  const isResume = toolType === "resume_builder"
  const hasCode = /```[\s\S]*?```/.test(message.content)

  const copyMessage = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex gap-3 justify-start group">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] shadow-lg shadow-[#7c5cfc]/20">
        <Bot className="h-5 w-5 text-white" />
      </div>
      <div className="flex flex-col items-start max-w-[75%]">
        <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
          <div className="text-sm leading-relaxed text-[#1a1a2e] dark:text-[#e8e4f0]">
            {isResume && hasCode ? (
              <ResumeStatusMessage content={message.content} />
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-[#9ca3af]">{formatTime(message.createdAt)}</span>

          {/* View button for resume versions */}
          {isResume && hasCode && versionIndex !== undefined && (
            <button
              onClick={() => triggerVersionSelect(versionIndex + 1)}
              className="rounded p-1 text-[#7c5cfc] hover:text-[#6d4ce6] hover:bg-[#f0ebff] dark:hover:bg-[#7c5cfc]/10 transition-colors"
              title="View this version in preview"
            >
              <Eye className="h-3 w-3" />
            </button>
          )}

          <button onClick={copyMessage} className="rounded p-1 text-[#9ca3af] hover:text-[#1a1a2e] hover:bg-[#f1f3f9] dark:hover:text-[#e8e4f0] dark:hover:bg-[#231f35] transition-colors" title="Copy message">
            {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          </button>
          {isLast && onRegenerate && (
            <button onClick={onRegenerate} className="rounded p-1 text-[#9ca3af] hover:text-[#1a1a2e] hover:bg-[#f1f3f9] dark:hover:text-[#e8e4f0] dark:hover:bg-[#231f35] transition-colors" title="Regenerate response">
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
  toolType,
}: {
  messages: Message[]
  isGenerating: boolean
  streamingText?: string
  onRegenerate?: () => void
  toolType?: string | null
}) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const isResume = toolType === "resume_builder"

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingText])

  if (messages.length === 0 && !streamingText) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] shadow-xl shadow-[#7c5cfc]/25 mb-4 animate-float">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">How can I help you today?</h3>
          <p className="mt-2 text-sm text-[#6b7280]">
            {isResume ? "Tell me about your experience to build your resume" : "Ask me anything — I&apos;m powered by AI."}
          </p>
        </div>
      </div>
    )
  }

  const lastAssistantIdx = [...messages].reverse().findIndex((m) => m.role === "assistant")
  const lastAssistantId = lastAssistantIdx !== -1 ? messages[messages.length - 1 - lastAssistantIdx].id : null

  // Track version index for resume messages
  let resumeVersionCounter = 0

  return (
    <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 w-full">
      {messages.map((message) => {
        if (message.role === "user") {
          return (
            <div key={message.id} className="flex gap-3 justify-end">
              <div className="flex flex-col items-end max-w-[75%]">
                <div className="rounded-2xl rounded-br-md bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-4 py-3 shadow-lg shadow-[#7c5cfc]/15">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-white">{message.content}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] text-[#9ca3af]">{formatTime(message.createdAt)}</span>
                  <CheckCheck className="h-3.5 w-3.5 text-[#7c5cfc]" />
                </div>
              </div>
            </div>
          )
        }

        // Calculate version index for resume messages
        let versionIdx: number | undefined
        if (isResume && /```[\s\S]*?```/.test(message.content)) {
          versionIdx = resumeVersionCounter
          resumeVersionCounter++
        }

        return (
          <AssistantMessage
            key={message.id}
            message={message}
            isLast={message.id === lastAssistantId}
            onRegenerate={message.id === lastAssistantId ? onRegenerate : undefined}
            toolType={toolType}
            versionIndex={versionIdx}
          />
        )
      })}

      {isGenerating && streamingText && (
        <div className="flex gap-3 justify-start">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] shadow-lg shadow-[#7c5cfc]/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col items-start max-w-[75%]">
            <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
              <div className="text-sm leading-relaxed">
                {isResume ? (
                  <div className="flex items-center gap-2 text-[#6b7280]">
                    <FileText className="h-4 w-4 text-[#7c5cfc]" />
                    <span>Updating your resume...</span>
                    <span className="inline-block h-3 w-1 animate-pulse bg-[#7c5cfc] rounded-sm" />
                  </div>
                ) : (
                  <>
                    <MarkdownRenderer content={streamingText} />
                    <span className="inline-block h-4 w-1.5 animate-pulse bg-[#7c5cfc] ml-0.5 rounded-sm align-text-bottom" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isGenerating && !streamingText && (
        <div className="flex gap-3 justify-start">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] shadow-lg shadow-[#7c5cfc]/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
            {isResume ? (
              <div className="flex items-center gap-2 text-[#6b7280] text-sm">
                <FileText className="h-4 w-4 text-[#7c5cfc]" />
                <span>Building your resume...</span>
              </div>
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-[#7c5cfc]" />
            )}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
