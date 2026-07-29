"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Bot, User, Loader2 } from "lucide-react"
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
      <div className="flex min-h-screen items-center justify-center bg-[#1e1929]">
        <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
      </div>
    )
  }

  if (notFound || !conv) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1e1929]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Chat Not Found</h1>
          <p className="text-zinc-500 text-sm">This conversation doesn&apos;t exist or is no longer shared.</p>
          <a href="/c" className="mt-4 inline-block rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:brightness-110 transition-all">
            Try NexaChat
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1e1929]">
      <header className="border-b border-[#2e2840] bg-[#1e1929] px-6 py-4">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">{conv.title}</h1>
            <p className="text-xs text-zinc-500">Shared by {conv.author}</p>
          </div>
          <a href="/c" className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white hover:brightness-110 transition-all">
            Try NexaChat
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        {conv.messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}

            <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-md"
                  : "bg-[#231e30] text-zinc-100 rounded-bl-md"
              }`}>
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                ) : (
                  <div className="text-sm leading-relaxed">
                    <MarkdownRenderer content={msg.content} />
                  </div>
                )}
              </div>
              <p className="mt-1 text-[10px] text-zinc-600">{new Date(msg.createdAt).toLocaleTimeString()}</p>
            </div>

            {msg.role === "user" && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2a2438] border border-[#2e2840]">
                <User className="h-4 w-4 text-zinc-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      <footer className="border-t border-[#2e2840] px-6 py-6 text-center">
        <p className="text-xs text-zinc-600">Powered by NexaChat — AI Chat with DeepSeek</p>
      </footer>
    </div>
  )
}
