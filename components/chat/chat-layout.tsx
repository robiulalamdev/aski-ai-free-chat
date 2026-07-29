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
import type { Conversation } from "@/types/chat"
import {
  createConversation,
  getUserConversations,
  getConversationById,
  addMessageToConversation,
  updateConversationTitle,
  deleteUserConversation,
} from "@/app/actions/conversations"

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

  const [state, setState] = useState<{ conversations: Conversation[]; activeId: string | null }>({
    conversations: [],
    activeId: null,
  })

  const { conversations, activeId } = state
  const activeConversation = conversations.find((c) => c.id === activeId)
  const messages = activeConversation?.messages || []

  // Load conversations from DB on mount
  useEffect(() => {
    getUserConversations().then((convs) => {
      if (convs.length > 0) {
        setState({ conversations: convs, activeId: convs[0].id })
      }
      setInitialized(true)
    })
  }, [])

  // Sync URL with active conversation
  useEffect(() => {
    if (activeId && pathname !== `/c/${activeId}`) {
      router.replace(`/c/${activeId}`, { scroll: false })
    }
  }, [activeId, pathname, router])

  // Load specific conversation if URL has ID
  useEffect(() => {
    const parts = pathname.split("/")
    const urlId = parts[2] // /c/{id}
    if (urlId && urlId !== activeId && state.conversations.length > 0) {
      const exists = state.conversations.find((c) => c.id === urlId)
      if (exists) {
        setState((prev) => ({ ...prev, activeId: urlId }))
      } else {
        // Load from DB
        getConversationById(urlId).then((conv) => {
          if (conv) {
            setState((prev) => ({
              conversations: [conv, ...prev.conversations.filter((c) => c.id !== conv.id)],
              activeId: conv.id,
            }))
          }
        })
      }
    }
  }, [pathname, state.conversations])

  const refresh = useCallback(async () => {
    const convs = await getUserConversations()
    setState((prev) => ({
      conversations: convs.length > 0 ? convs : prev.conversations,
      activeId: prev.activeId,
    }))
  }, [])

  const handleNew = useCallback(async () => {
    const conv = await createConversation()
    if (conv) {
      setState((prev) => ({
        conversations: [conv, ...prev.conversations.filter((c) => c.id !== conv.id)],
        activeId: conv.id,
      }))
      router.push("/c", { scroll: false })
    }
  }, [router])

  const handleSelect = useCallback((id: string) => {
    setState((prev) => ({ ...prev, activeId: id }))
    router.push(`/c/${id}`, { scroll: false })
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }, [router])

  const handleDelete = useCallback(async (id: string) => {
    await deleteUserConversation(id)
    const convs = await getUserConversations()
    setState((prev) => ({
      conversations: convs,
      activeId: prev.activeId === id ? (convs.length > 0 ? convs[0].id : null) : prev.activeId,
    }))
  }, [])

  const handleRename = useCallback(async (id: string, title: string) => {
    await updateConversationTitle(id, title)
    await refresh()
  }, [refresh])

  const handleSend = useCallback(async (content: string) => {
    const currentId = state.activeId
    if (!currentId) return
    setIsGenerating(true)
    setStreamingText("")

    // Add user message to DB
    await addMessageToConversation(currentId, "user", content)

    // Reload conversations to get updated messages
    const convs = await getUserConversations()
    const updatedActive = convs.find((c) => c.id === currentId)
    const isFirstMessage = !updatedActive || updatedActive.messages.length <= 1

    setState({ conversations: convs, activeId: currentId })

    // Generate smart title from first message
    if (isFirstMessage) {
      const smartTitle = generateSmartTitle(content)
      await updateConversationTitle(currentId, smartTitle)
      const refreshedConvs = await getUserConversations()
      setState({ conversations: refreshedConvs, activeId: currentId })
    }

    const convForAI = convs.find((c) => c.id === currentId)
    if (!convForAI) {
      setIsGenerating(false)
      return
    }

    let fullResponse = ""
    try {
      fullResponse = await processMessage(convForAI.messages, (token) => {
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
    await addMessageToConversation(currentId, "assistant", fullResponse)
    await refresh()
    setIsGenerating(false)
  }, [state.activeId, refresh, processMessage])

  const handleRegenerate = useCallback(async () => {
    const currentId = state.activeId
    if (!currentId) return

    const conv = state.conversations.find((c) => c.id === currentId)
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
    await addMessageToConversation(currentId, "assistant", fullResponse)
    await refresh()
    setIsGenerating(false)
  }, [state.activeId, state.conversations, refresh, processMessage])

  const handleStop = useCallback(() => {
    cancel()
    if (streamingText) {
      const currentId = state.activeId
      if (currentId) {
        addMessageToConversation(currentId, "assistant", streamingText).then(() => refresh())
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
