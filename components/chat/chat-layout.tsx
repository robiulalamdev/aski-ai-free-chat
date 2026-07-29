"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChatHeader } from "./chat-header"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"
import { Sidebar } from "./sidebar"
import { LoadingScreen } from "./loading-screen"
import { AIProvider, useAI } from "@/components/providers/ai-provider"
import { AuthProvider, useAuth } from "@/components/providers/auth-provider"
import type { Conversation, Message } from "@/types/chat"
import {
  createAndSaveConversation,
  addMessage,
  getConversations,
  getConversation,
  deleteConversation,
  renameConversation,
} from "@/store/chat-store"

function generateSmartTitle(firstMessage: string): string {
  const cleaned = firstMessage.trim()
  if (cleaned.length <= 50) return cleaned

  const words = cleaned.split(/\s+/).slice(0, 8)
  let title = words.join(" ")
  if (title.length > 50) title = title.slice(0, 47) + "..."
  return title
}

function ChatContent() {
  const router = useRouter()
  const pathname = usePathname()
  const [initialized, setInitialized] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const { processMessage, cancel } = useAI()
  const { user, logout } = useAuth()

  const [state, setState] = useState<{ conversations: Conversation[]; activeId: string | null }>(() => {
    if (typeof window === "undefined") {
      return { conversations: [], activeId: null }
    }
    const saved = getConversations()
    if (saved.length > 0) {
      return { conversations: saved, activeId: saved[0].id }
    }
    const conv = createAndSaveConversation()
    return { conversations: [conv], activeId: conv.id }
  })

  const { conversations, activeId } = state
  const activeConversation = conversations.find((c) => c.id === activeId)
  const messages = activeConversation?.messages || []

  // Sync URL with active conversation
  useEffect(() => {
    if (activeId && pathname !== `/c/${activeId}`) {
      router.replace(`/c/${activeId}`, { scroll: false })
    }
  }, [activeId, pathname, router])

  const refresh = useCallback(() => {
    setState((prev) => ({ ...prev, conversations: [...getConversations()] }))
  }, [])

  const handleNew = useCallback(() => {
    const conv = createAndSaveConversation()
    setState((prev) => ({ ...prev, activeId: conv.id, conversations: [...getConversations()] }))
    router.push("/c", { scroll: false })
  }, [router])

  const handleSelect = useCallback((id: string) => {
    setState((prev) => ({ ...prev, activeId: id }))
    router.push(`/c/${id}`, { scroll: false })
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }, [router])

  const handleDelete = useCallback((id: string) => {
    deleteConversation(id)
    const saved = getConversations()
    setState((prev) => ({
      conversations: saved,
      activeId: prev.activeId === id ? (saved.length > 0 ? saved[0].id : null) : prev.activeId,
    }))
  }, [])

  const handleRename = useCallback((id: string, title: string) => {
    renameConversation(id, title)
    refresh()
  }, [refresh])

  const handleSend = useCallback(async (content: string) => {
    const currentId = state.activeId
    if (!currentId) return
    setIsGenerating(true)
    setStreamingText("")

    const conv = getConversation(currentId)
    const isFirstMessage = !conv || conv.messages.length === 0

    addMessage(currentId, "user", content)
    refresh()

    // Generate smart title from first message
    if (isFirstMessage) {
      const smartTitle = generateSmartTitle(content)
      renameConversation(currentId, smartTitle)
      refresh()
    }

    const updatedConv = getConversation(currentId)
    if (!updatedConv) {
      setIsGenerating(false)
      return
    }

    let fullResponse = ""
    try {
      fullResponse = await processMessage(updatedConv.messages, (token) => {
        setStreamingText((prev) => prev + token)
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sorry, an error occurred."
      if (message.includes("Daily token limit reached")) {
        fullResponse = "⚠️ " + message
      } else {
        fullResponse = "Sorry, an error occurred while generating the response."
      }
    }

    setStreamingText("")
    addMessage(currentId, "assistant", fullResponse)
    refresh()
    setIsGenerating(false)
  }, [state.activeId, refresh, processMessage])

  const handleRegenerate = useCallback(async () => {
    const currentId = state.activeId
    if (!currentId) return

    const conv = getConversation(currentId)
    if (!conv || conv.messages.length < 2) return

    const lastAssistantIdx = [...conv.messages].reverse().findIndex((m) => m.role === "assistant")
    if (lastAssistantIdx === -1) return

    setIsGenerating(true)
    setStreamingText("")
    const msgsWithoutLast = conv.messages.slice(0, -(lastAssistantIdx + 1))

    let fullResponse = ""
    try {
      fullResponse = await processMessage(msgsWithoutLast, (token) => {
        setStreamingText((prev) => prev + token)
      })
    } catch (err) {
      fullResponse = "Sorry, an error occurred while generating the response."
    }

    setStreamingText("")
    addMessage(currentId, "assistant", fullResponse)
    refresh()
    setIsGenerating(false)
  }, [state.activeId, refresh, processMessage])

  const handleStop = useCallback(() => {
    cancel()
    if (streamingText) {
      const currentId = state.activeId
      if (currentId) {
        addMessage(currentId, "assistant", streamingText)
        refresh()
      }
      setStreamingText("")
    }
    setIsGenerating(false)
  }, [cancel, streamingText, state.activeId, refresh])

  if (!initialized) {
    return <LoadingScreen onComplete={() => setInitialized(true)} />
  }

  return (
    <div className="flex h-screen bg-[#1e1929]">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
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
          onRegenerate={messages.length >= 2 ? handleRegenerate : undefined}
          conversations={conversations}
          activeConversationId={activeId}
        />

        <ChatMessages messages={messages} isGenerating={isGenerating} streamingText={streamingText} />

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
