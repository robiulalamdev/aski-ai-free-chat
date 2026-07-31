"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Bot, User, Loader2, Brain, ArrowRight } from "lucide-react"
import { MarkdownRenderer } from "@/components/chat/markdown-renderer"
import { getSharedConversation } from "@/app/actions/share"

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

export default function SharedChatPage() {
  const params = useParams()
  const slug = params.slug as string
  const [conv, setConv] = useState<SharedConv | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] dark:bg-[#0f0d18]">
        <Loader2 className="h-6 w-6 animate-spin text-[#7c5cfc]" />
      </div>
    )
  }

  if (notFound || !conv) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] dark:bg-[#0f0d18] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#7c5cfc]/5 blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#7c5cfc]/5 blur-3xl" />
        </div>
        <div className="text-center relative z-10">
          <div className="glass-card rounded-3xl p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] mb-6 shadow-lg shadow-[#7c5cfc]/25">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-[#e8e4f0] mb-2">Chat Not Found</h1>
            <p className="text-[#6b7280] text-sm mb-6">This conversation doesn&apos;t exist or is no longer shared.</p>
            <a href="/chat/new" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/25 transition-all duration-300 hover:shadow-[#7c5cfc]/40 hover:brightness-110 active:scale-[0.98]">
              Try NexaChat
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#0f0d18]">
      <header className="border-b border-[#e2e5f1] dark:border-[#2a2540] bg-white/80 dark:bg-[#1a1726]/80 backdrop-blur-xl px-6 py-4">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] shadow-lg shadow-[#7c5cfc]/20">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">{conv.title}</h1>
              <p className="text-xs text-[#6b7280]">Shared by {conv.author}</p>
            </div>
          </div>
          <a href="/chat/new" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/20 transition-all duration-300 hover:shadow-[#7c5cfc]/30 hover:brightness-110 active:scale-[0.98]">
            Try NexaChat
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        {conv.messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] shadow-lg shadow-[#7c5cfc]/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}

            <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] text-white rounded-br-md shadow-lg shadow-[#7c5cfc]/20"
                  : "glass-card text-[#1a1a2e] dark:text-[#e8e4f0] rounded-bl-md"
              }`}>
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                ) : (
                  <div className="text-sm leading-relaxed">
                    <MarkdownRenderer content={msg.content} />
                  </div>
                )}
              </div>
              <p className="mt-1 text-[10px] text-[#9ca3af]">{new Date(msg.createdAt).toLocaleTimeString()}</p>
            </div>

            {msg.role === "user" && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1f3f9] dark:bg-[#231f35] border border-[#e2e5f1] dark:border-[#2a2540]">
                <User className="h-4 w-4 text-[#6b7280]" />
              </div>
            )}
          </div>
        ))}
      </div>

      <footer className="border-t border-[#e2e5f1] dark:border-[#2a2540] px-6 py-6 text-center bg-white/50 dark:bg-[#1a1726]/50 backdrop-blur-sm">
        <p className="text-xs text-[#9ca3af]">Powered by NexaChat</p>
      </footer>
    </div>
  )
}
