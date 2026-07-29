"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { ChatHeader } from "./chat-header"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"
import { Sidebar } from "./sidebar"
import { AIProvider, useAI } from "@/components/providers/ai-provider"
import { AuthProvider, useAuth } from "@/components/providers/auth-provider"
import type { Conversation, Message } from "@/types/chat"
import {
  createConversation,
  getUserConversations,
  getConversationById,
  addMessageToConversation,
  updateConversationTitle,
  deleteUserConversation,
} from "@/app/actions/conversations"

async function generateAITitle(message: string): Promise<string> {
  try {
    const res = await fetch("/api/title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
    if (!res.ok) return message.slice(0, 50)
    const data = await res.json()
    return data.title || message.slice(0, 50)
  } catch {
    return message.slice(0, 50)
  }
}

function makeMsg(role: "user" | "assistant", content: string): Message {
  return { id: crypto.randomUUID(), role, content, createdAt: Date.now() }
}

function ChatContent() {
  const pathname = usePathname()
  const [initialized, setInitialized] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const { processMessage, cancel } = useAI()
  const { user, logout } = useAuth()

  const activeIdRef = useRef<string | null>(null)
  const [displayMessages, setDisplayMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loadingConversation, setLoadingConversation] = useState(false)

  const activeConversation = conversations.find((c) => c.id === activeIdRef.current)
  const isNewChat = !activeIdRef.current

  // Load conversations on mount
  useEffect(() => {
    getUserConversations().then((convs) => {
      setConversations(convs)
      setInitialized(true)
    })
  }, [])

  // Load conversation from URL (only on direct navigation)
  useEffect(() => {
    if (!initialized) return
    const parts = pathname.split("/")
    const urlId = parts[2]
    if (urlId && parts[1] === "c" && !activeIdRef.current) {
      activeIdRef.current = urlId
      setLoadingConversation(true)
      getConversationById(urlId).then((conv) => {
        if (conv) {
          setConversations((prev) => {
            const exists = prev.find((c) => c.id === conv.id)
            if (exists) return prev
            return [conv, ...prev.filter((c) => c.id !== conv.id)]
          })
          setDisplayMessages(conv.messages)
        }
        setLoadingConversation(false)
      })
    }
  }, [pathname, initialized]) // eslint-disable-line

  const syncConversations = useCallback(async () => {
    const convs = await getUserConversations()
    setConversations(convs)
  }, [])

  const handleNew = useCallback(() => {
    activeIdRef.current = null
    setDisplayMessages([])
    setStreamingText("")
    setIsGenerating(false)
    window.history.replaceState(null, "", "/chat/new")
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }, [])

  const handleSelect = useCallback((id: string) => {
    activeIdRef.current = id
    const conv = conversations.find((c) => c.id === id)
    setDisplayMessages(conv?.messages || [])
    setStreamingText("")
    setIsGenerating(false)
    window.history.replaceState(null, "", `/c/${id}`)
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }, [conversations])

  const handleDelete = useCallback(async (id: string) => {
    await deleteUserConversation(id)
    if (activeIdRef.current === id) {
      activeIdRef.current = null
      setDisplayMessages([])
      window.history.replaceState(null, "", "/chat/new")
    }
    await syncConversations()
  }, [syncConversations])

  const handleRename = useCallback(async (id: string, title: string) => {
    await updateConversationTitle(id, title)
    await syncConversations()
  }, [syncConversations])

  const handleSend = useCallback(async (content: string) => {
    const userMsg = makeMsg("user", content)
    const isFirstMessage = displayMessages.length === 0

    // Show user message instantly
    setDisplayMessages((prev) => [...prev, userMsg])
    setIsGenerating(true)
    setStreamingText("")

    try {
      let currentId = activeIdRef.current
      let isNewConversation = false

      // Create conversation if needed
      if (!currentId) {
        const conv = await createConversation()
        if (!conv) {
          setIsGenerating(false)
          setDisplayMessages((prev) => prev.filter((m) => m.id !== userMsg.id))
          return
        }
        currentId = conv.id
        activeIdRef.current = conv.id
        isNewConversation = true
        setConversations((prev) => [conv, ...prev.filter((c) => c.id !== conv.id)])
      }

      // Save user message to DB
      const updatedConv = await addMessageToConversation(currentId, "user", content)
      if (updatedConv) {
        setConversations((prev) => [updatedConv, ...prev.filter((c) => c.id !== updatedConv.id)])
      }

      // Generate AI title in background (non-blocking)
      if (isFirstMessage) {
        generateAITitle(content).then((title) => {
          updateConversationTitle(currentId, title).then(() => syncConversations())
        })
      }

      // Stream AI response
      const messagesForAI = [...displayMessages, userMsg]
      let fullResponse = ""
      try {
        fullResponse = await processMessage(messagesForAI, (token) => {
          setStreamingText((prev) => prev + token)
        })
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Sorry, an error occurred."
        fullResponse = message.includes("Daily token limit reached")
          ? "⚠️ " + message
          : "Sorry, an error occurred while generating the response."
      }

      // AI done - show response and change URL
      setStreamingText("")
      const aiMsg = makeMsg("assistant", fullResponse)
      setDisplayMessages((prev) => [...prev, aiMsg])

      if (isNewConversation) {
        window.history.replaceState(null, "", `/c/${currentId}`)
      }

      const finalConv = await addMessageToConversation(currentId, "assistant", fullResponse)
      if (finalConv) {
        setConversations((prev) => [finalConv, ...prev.filter((c) => c.id !== finalConv.id)])
      }
    } finally {
      setIsGenerating(false)
    }
  }, [displayMessages, processMessage, syncConversations])

  const handleRegenerate = useCallback(async () => {
    if (displayMessages.length < 2) return

    const lastAssistantIdx = [...displayMessages].reverse().findIndex((m) => m.role === "assistant")
    if (lastAssistantIdx === -1) return

    const msgsForAI = displayMessages.slice(0, -(lastAssistantIdx + 1))

    setIsGenerating(true)
    setStreamingText("")

    let fullResponse = ""
    try {
      fullResponse = await processMessage(msgsForAI, (token) => {
        setStreamingText((prev) => prev + token)
      })
    } catch (err) {
      fullResponse = "Sorry, an error occurred while generating the response."
    }

    setStreamingText("")
    const aiMsg = makeMsg("assistant", fullResponse)
    setDisplayMessages((prev) => [...prev.slice(0, -(lastAssistantIdx + 1)), aiMsg])

    if (activeIdRef.current) {
      const finalConv = await addMessageToConversation(activeIdRef.current, "assistant", fullResponse)
      if (finalConv) {
        setConversations((prev) => [finalConv, ...prev.filter((c) => c.id !== finalConv.id)])
      }
    }
    setIsGenerating(false)
  }, [displayMessages, processMessage])

  const handleStop = useCallback(() => {
    cancel()
    if (streamingText && activeIdRef.current) {
      const aiMsg = makeMsg("assistant", streamingText)
      setDisplayMessages((prev) => [...prev, aiMsg])
      addMessageToConversation(activeIdRef.current!, "assistant", streamingText).then((conv) => {
        if (conv) setConversations((prev) => [conv, ...prev.filter((c) => c.id !== conv.id)])
      })
    }
    setStreamingText("")
    setIsGenerating(false)
  }, [cancel, streamingText])

  if (!initialized || loadingConversation) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[var(--background)]">
      <Sidebar
        conversations={conversations}
        activeId={activeIdRef.current}
        onNew={handleNew}
        onSelect={handleSelect}
        onDelete={handleDelete}
        onRename={handleRename}
        open={sidebarOpen}
        user={user}
        onLogout={logout}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <ChatHeader
          title={activeConversation?.title || "New Chat"}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          conversations={conversations}
          activeConversationId={activeIdRef.current}
        />

        {isNewChat && displayMessages.length === 0 && !isGenerating ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 mb-4">
                <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                  <path d="M12 12 2.1 9.3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">How can I help you today?</h3>
              <p className="mt-2 text-sm text-zinc-500">Ask me anything — I&apos;m powered by AI.</p>
            </div>
          </div>
        ) : (
          <ChatMessages
            messages={displayMessages}
            isGenerating={isGenerating}
            streamingText={streamingText}
            onRegenerate={displayMessages.length >= 2 ? handleRegenerate : undefined}
          />
        )}

        <ChatInput onSend={handleSend} isGenerating={isGenerating} onStop={handleStop} />
      </div>
    </div>
  )
}

export function ChatLayout() {
  return (
    <AuthProvider>
      <AIProvider>
        <ChatContent />
      </AIProvider>
    </AuthProvider>
  )
}
