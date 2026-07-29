"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { ChatHeader } from "./chat-header"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"
import { Sidebar } from "./sidebar"
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
  const pathname = usePathname()
  const [initialized, setInitialized] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const { processMessage, cancel } = useAI()
  const { user, logout } = useAuth()
  const isSending = useRef(false)

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
        setState({ conversations: convs, activeId: null })
      }
      setInitialized(true)
    })
  }, [])

  // Load conversation from URL if on /c/{id} (deep link on page load)
  useEffect(() => {
    if (!initialized) return
    const parts = pathname.split("/")
    const urlId = parts[2]
    if (urlId && parts[1] === "c" && urlId !== activeId) {
      const exists = state.conversations.find((c) => c.id === urlId)
      if (exists) {
        setState((prev) => ({ ...prev, activeId: urlId }))
      } else {
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
  }, [pathname, initialized]) // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = useCallback(async () => {
    const convs = await getUserConversations()
    setState((prev) => ({
      conversations: convs.length > 0 ? convs : prev.conversations,
      activeId: prev.activeId,
    }))
  }, [])

  const handleNew = useCallback(() => {
    setState((prev) => ({ ...prev, activeId: null }))
    window.history.replaceState(null, "", "/chat/new")
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }, [])

  const handleSelect = useCallback((id: string) => {
    setState((prev) => ({ ...prev, activeId: id }))
    window.history.replaceState(null, "", `/c/${id}`)
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    await deleteUserConversation(id)
    const convs = await getUserConversations()
    setState((prev) => ({
      conversations: convs,
      activeId: prev.activeId === id ? null : prev.activeId,
    }))
    window.history.replaceState(null, "", "/chat/new")
  }, [])

  const handleRename = useCallback(async (id: string, title: string) => {
    await updateConversationTitle(id, title)
    await refresh()
  }, [refresh])

  const handleSend = useCallback(async (content: string) => {
    if (isSending.current) return
    isSending.current = true
    setIsGenerating(true)
    setStreamingText("")

    try {
      let currentId = state.activeId

      // Create conversation if new chat
      if (!currentId) {
        const conv = await createConversation()
        if (!conv) {
          setIsGenerating(false)
          isSending.current = false
          return
        }
        currentId = conv.id
        // Update URL immediately without unmounting
        window.history.replaceState(null, "", `/c/${conv.id}`)
      }

      // Add user message to DB
      const updatedConv = await addMessageToConversation(currentId, "user", content)

      // NOW set state with conversation that includes user message
      if (updatedConv) {
        setState((prev) => ({
          conversations: [updatedConv, ...prev.conversations.filter((c) => c.id !== updatedConv.id)],
          activeId: updatedConv.id,
        }))
      }

      // Generate smart title from first message
      const currentConv = state.conversations.find((c) => c.id === currentId)
      if (!currentConv || currentConv.messages.length === 0) {
        const smartTitle = generateSmartTitle(content)
        await updateConversationTitle(currentId, smartTitle)
      }

      if (!updatedConv) {
        setIsGenerating(false)
        isSending.current = false
        return
      }

      // Stream AI response
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

      // Save AI response
      setStreamingText("")
      const finalConv = await addMessageToConversation(currentId, "assistant", fullResponse)
      if (finalConv) {
        setState((prev) => ({
          conversations: [finalConv, ...prev.conversations.filter((c) => c.id !== finalConv.id)],
          activeId: finalConv.id,
        }))
      }
    } finally {
      setIsGenerating(false)
      isSending.current = false
    }
  }, [state.activeId, state.conversations, processMessage])

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
    const finalConv = await addMessageToConversation(currentId, "assistant", fullResponse)
    if (finalConv) {
      setState((prev) => ({
        conversations: [finalConv, ...prev.conversations.filter((c) => c.id !== finalConv.id)],
        activeId: finalConv.id,
      }))
    }
    setIsGenerating(false)
  }, [state.activeId, state.conversations, processMessage])

  const handleStop = useCallback(() => {
    cancel()
    if (streamingText) {
      const currentId = state.activeId
      if (currentId) {
        addMessageToConversation(currentId, "assistant", streamingText).then((finalConv) => {
          if (finalConv) {
            setState((prev) => ({
              conversations: [finalConv, ...prev.conversations.filter((c) => c.id !== finalConv.id)],
              activeId: finalConv.id,
            }))
          }
        })
      }
      setStreamingText("")
    }
    setIsGenerating(false)
  }, [cancel, streamingText, state.activeId])

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1e1929]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    )
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
          conversations={conversations}
          activeConversationId={activeId}
        />

        <ChatMessages
          messages={messages}
          isGenerating={isGenerating}
          streamingText={streamingText}
          onRegenerate={!activeId && messages.length < 2 ? undefined : handleRegenerate}
        />

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
