"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Bot, User, Lock, Send, ArrowRight, Shield } from "lucide-react"
import Link from "next/link"
import { MarkdownRenderer } from "@/components/chat/markdown-renderer"
import { getSharedConversation } from "@/app/actions/share"
import { ThemeToggle } from "@/components/providers/theme-toggle"
import { NotFoundPage } from "@/components/not-found-page"

interface SharedMessage {
  id: string
  role: string
  content: string
  createdAt: string
}

interface SharedConv {
  title: string
  author: string
  messages: SharedMessage[]
  createdAt: string
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  let h = d.getHours()
  const m = d.getMinutes().toString().padStart(2, "0")
  const s = d.getSeconds().toString().padStart(2, "0")
  const ampm = h >= 12 ? "PM" : "AM"
  h = h % 12 || 12
  return `${h}:${m}:${s} ${ampm}`
}

function isToday(iso: string): boolean {
  const d = new Date(iso)
  const now = new Date()
  return d.toDateString() === now.toDateString()
}

export default function SharedChatPage() {
  const params = useParams()
  const slug = params.slug as string
  const [conv, setConv] = useState<SharedConv | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = "Shared Chat - NexaChat"
    getSharedConversation(slug).then((data) => {
      if (data) {
        setConv(data as SharedConv)
        document.title = `${data.title} - NexaChat`
      } else {
        setNotFound(true)
      }
      setLoading(false)
    })
  }, [slug])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conv])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f0ebff] via-[#f8f9fc] to-[#e8e0ff] dark:from-[#0f0d18] dark:via-[#14111e] dark:to-[#1a1726]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#7c5cfc]/20 border-t-[#7c5cfc]" />
      </div>
    )
  }

  if (notFound || !conv) {
    return <NotFoundPage />
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f0ebff] via-[#f8f9fc] to-[#e8e0ff] dark:from-[#0f0d18] dark:via-[#14111e] dark:to-[#1a1726]">
      {/* Header */}
      <header className="border-b border-[#e2e5f1] dark:border-[#2a2540] bg-white dark:bg-[#14111e]">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] shadow-lg shadow-[#7c5cfc]/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">{conv.title}</h1>
              <p className="text-xs text-[#9ca3af]">Shared by {conv.author}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="/chat/new"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/20 transition-all duration-300 hover:shadow-[#7c5cfc]/30 hover:brightness-110 active:scale-[0.98]"
            >
              <span className="text-yellow-300">✦</span> Try NexaChat
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col mx-auto max-w-5xl w-full px-4 py-4">
        {/* Scrollable messages area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 py-4">
          {/* Date badge */}
          {conv.messages.length > 0 && (
            <div className="flex justify-center mb-4">
              <span className="rounded-full bg-[#f0ebff] dark:bg-[#7c5cfc]/10 px-4 py-1 text-xs font-medium text-[#7c5cfc] dark:text-[#8b6fff]">
                {isToday(conv.messages[0].createdAt) ? "Today" : new Date(conv.messages[0].createdAt).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-4">
            {conv.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Assistant icon */}
                {msg.role === "assistant" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] shadow-md shadow-[#7c5cfc]/20">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}

                {/* Message bubble */}
                <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} max-w-[75%]`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] text-white rounded-br-md shadow-lg shadow-[#7c5cfc]/20"
                        : "bg-white dark:bg-[#1a1726] text-[#1a1a2e] dark:text-[#e8e4f0] rounded-bl-md shadow-sm border border-[#e2e5f1] dark:border-[#2a2540]"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="text-sm leading-relaxed">
                        <MarkdownRenderer content={msg.content} />
                      </div>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-[10px] text-[#9ca3af]">{formatTime(msg.createdAt)}</span>
                    {msg.role === "user" && (
                      <span className="text-[10px] text-[#3b82f6]">✓✓</span>
                    )}
                  </div>
                </div>

                {/* User icon */}
                {msg.role === "user" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-[#1a1726] border border-[#e2e5f1] dark:border-[#2a2540]">
                    <User className="h-4 w-4 text-[#6b7280] dark:text-[#9ca3af]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Disabled input */}
        <div className="px-2 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[#e2e5f1] dark:border-[#2a2540] bg-white dark:bg-[#1a1726] px-4 py-3 opacity-60">
              <Lock className="h-4 w-4 text-[#9ca3af] shrink-0" />
              <span className="text-sm text-[#9ca3af]">This is a shared conversation. You can&apos;t send messages.</span>
            </div>
            <button
              disabled
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-[#1a1726] text-[#9ca3af] opacity-50 cursor-not-allowed border border-[#e2e5f1] dark:border-[#2a2540]"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-transparent to-[#f0ebff]/40 dark:to-[#1a1726]/50">
        <div className="mx-auto max-w-5xl px-6 py-4 text-center">
          <p className="text-xs text-[#9ca3af] flex items-center justify-center gap-1.5 mb-1">
            <Shield className="h-3.5 w-3.5" />
            Powered by{" "}
            <Link href="/" className="font-medium text-[#7c5cfc] hover:underline">NexaChat</Link>
          </p>
          <p className="text-[11px] text-[#9ca3af]">Shared conversations are public. Do not share any sensitive information.</p>
        </div>
      </footer>
    </div>
  )
}
