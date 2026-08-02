"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { ChatHeader } from "./chat-header"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"
import { Sidebar } from "./sidebar"
import { ToolPreviewPanel } from "./tool-preview-panel"
import { AIProvider, useAI } from "@/components/providers/ai-provider"
import { AuthProvider, useAuth } from "@/components/providers/auth-provider"
import type { Conversation, Message } from "@/types/chat"
import {
  createConversation,
  getUserConversationsPage,
  getConversationById,
  addMessageToConversation,
  updateConversationTitle,
  deleteUserConversation,
} from "@/app/actions/conversations"

const PAGE_SIZE = 20

const TOOL_URL_MAP: Record<string, string> = {
  code_generator: "code-generator",
  resume_builder: "resume-builder",
}

const TOOL_SLUG_MAP: Record<string, string> = {
  "code-generator": "code_generator",
  "resume-builder": "resume_builder",
}

function extractToolAndId(pathname: string): { toolType: string | null; id: string | null } {
  const parts = pathname.split("/")
  if (parts[1] === "t" && parts[2] && parts[3]) {
    return { toolType: TOOL_SLUG_MAP[parts[2]] || parts[2], id: parts[3] }
  }
  return { toolType: null, id: null }
}

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

function toMeta(conv: Conversation): Conversation {
  return { ...conv, messages: [] }
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
  const activeToolRef = useRef<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [displayMessages, setDisplayMessages] = useState<Message[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadingConversation, setLoadingConversation] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(true)

  const isNewChat = !activeId
  const isToolChat = !!activeTool

  // Load conversations on mount
  useEffect(() => {
    getUserConversationsPage().then((res) => {
      setConversations(res.conversations)
      setNextCursor(res.nextCursor)
      setHasMore(res.nextCursor !== null)
      setInitialized(true)
    })
  }, [])

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !nextCursor) return
    setLoadingMore(true)
    try {
      const res = await getUserConversationsPage(nextCursor, PAGE_SIZE)
      setConversations((prev) => {
        const existing = new Set(prev.map((c) => c.id))
        return [...prev, ...res.conversations.filter((c) => !existing.has(c.id))]
      })
      setNextCursor(res.nextCursor)
      setHasMore(res.nextCursor !== null)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, nextCursor])

  // Load conversation from URL (only on direct navigation)
  useEffect(() => {
    if (!initialized) return
    const parts = pathname.split("/")

    // Handle /c/{id} (normal chat)
    if (parts[1] === "c" && parts[2] && !activeIdRef.current) {
      const urlId = parts[2]
      // If id is "new", it's a fresh chat - don't try to load from DB
      if (urlId === "new") {
        activeIdRef.current = null
        activeToolRef.current = null
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveId(null)
        setActiveTool(null)
        setActiveConversation(null)
        setLoadingConversation(false)
      } else {
        activeIdRef.current = urlId
        activeToolRef.current = null
        setActiveId(urlId)
        setActiveTool(null)
        setLoadingConversation(true)
        getConversationById(urlId).then((conv) => {
          if (!conv) {
            activeIdRef.current = null
            activeToolRef.current = null
            setActiveId(null)
            setActiveTool(null)
            setActiveConversation(null)
            window.history.replaceState(null, "", "/chat/new")
            setLoadingConversation(false)
            return
          }
          activeToolRef.current = conv.toolType || null
          setActiveTool(conv.toolType || null)
          setConversations((prev) => {
            const exists = prev.find((c) => c.id === conv.id)
            if (exists) return prev
            return [toMeta(conv), ...prev.filter((c) => c.id !== conv.id)]
          })
          setActiveConversation(conv)
          setDisplayMessages(conv.messages)
          setLoadingConversation(false)
        })
      }
    }
    // Handle /t/{tool}/{id} (tool chat)
    else if (parts[1] === "t" && parts[2] && parts[3] && !activeIdRef.current) {
      const { toolType, id } = extractToolAndId(pathname)
      // If id is "new", it's a fresh tool conversation - don't try to load from DB
      if (id === "new") {
        activeIdRef.current = null
        activeToolRef.current = toolType
        setActiveId(null)
        setActiveTool(toolType)
        setActiveConversation(null)
        setLoadingConversation(false)
      } else {
        activeIdRef.current = id
        activeToolRef.current = toolType
        setActiveId(id)
        setActiveTool(toolType)
        setLoadingConversation(true)
        getConversationById(id!).then((conv) => {
          if (!conv) {
            activeIdRef.current = null
            activeToolRef.current = null
            setActiveId(null)
            setActiveTool(null)
            setActiveConversation(null)
            window.history.replaceState(null, "", "/chat/new")
            setLoadingConversation(false)
            return
          }
          activeToolRef.current = conv.toolType || toolType
          setActiveTool(conv.toolType || toolType)
          setConversations((prev) => {
            const exists = prev.find((c) => c.id === conv.id)
            if (exists) return prev
            return [toMeta(conv), ...prev.filter((c) => c.id !== conv.id)]
          })
          setActiveConversation(conv)
          setDisplayMessages(conv.messages)
          setLoadingConversation(false)
        })
      }
    }
  }, [pathname, initialized])

  const syncConversations = useCallback(async () => {
    const res = await getUserConversationsPage()
    setConversations(res.conversations)
    setNextCursor(res.nextCursor)
    setHasMore(res.nextCursor !== null)
  }, [])

  const handleNew = useCallback(() => {
    activeIdRef.current = null
    activeToolRef.current = null
    setActiveId(null)
    setActiveTool(null)
    setActiveConversation(null)
    setDisplayMessages([])
    setStreamingText("")
    setIsGenerating(false)
    window.history.replaceState(null, "", "/chat/new")
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }, [])

  const handleSelect = useCallback(
    (id: string) => {
      activeIdRef.current = id
      const conv = conversations.find((c) => c.id === id)
      activeToolRef.current = conv?.toolType || null
      setActiveId(id)
      setActiveTool(conv?.toolType || null)
      setActiveConversation(conv ? { ...conv, messages: [] } : null)
      setDisplayMessages([])
      setStreamingText("")
      setIsGenerating(false)

      if (conv?.toolType) {
        const slug = TOOL_URL_MAP[conv.toolType] || conv.toolType
        window.history.replaceState(null, "", `/t/${slug}/${id}`)
      } else {
        window.history.replaceState(null, "", `/c/${id}`)
      }
      if (window.innerWidth < 1024) setSidebarOpen(false)

      setLoadingConversation(true)
      getConversationById(id).then((full) => {
        setLoadingConversation(false)
        if (!full) {
          activeIdRef.current = null
          activeToolRef.current = null
          setActiveId(null)
          setActiveTool(null)
          setActiveConversation(null)
          setDisplayMessages([])
          window.history.replaceState(null, "", "/chat/new")
          return
        }
        activeToolRef.current = full.toolType || null
        setActiveTool(full.toolType || null)
        setActiveConversation(full)
        setDisplayMessages(full.messages)
      })
    },
    [conversations]
  )

  const handleToolSelect = useCallback((toolId: string) => {
    activeIdRef.current = null
    activeToolRef.current = toolId
    setActiveId(null)
    setActiveTool(toolId)
    setActiveConversation(null)
    setDisplayMessages([])
    setStreamingText("")
    setIsGenerating(false)
    const slug = TOOL_URL_MAP[toolId] || toolId
    window.history.replaceState(null, "", `/t/${slug}/new`)
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    await deleteUserConversation(id)
    if (activeIdRef.current === id) {
      activeIdRef.current = null
      activeToolRef.current = null
      setActiveId(null)
      setActiveTool(null)
      setActiveConversation(null)
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
    const currentToolType = activeToolRef.current

    // Show user message instantly
    setDisplayMessages((prev) => [...prev, userMsg])
    setIsGenerating(true)
    setStreamingText("")

    try {
      let currentId = activeIdRef.current
      let isNewConversation = false

      // Create conversation if needed
      if (!currentId) {
        const conv = await createConversation(undefined, currentToolType || undefined)
        if (!conv) {
          setIsGenerating(false)
          setDisplayMessages((prev) => prev.filter((m) => m.id !== userMsg.id))
          return
        }
        currentId = conv.id
        activeIdRef.current = conv.id
        setActiveId(conv.id)
        isNewConversation = true
        setActiveConversation(conv)
        setConversations((prev) => [toMeta(conv), ...prev.filter((c) => c.id !== conv.id)])
      }

      // Save user message to DB
      const updatedConv = await addMessageToConversation(currentId, "user", content)
      if (updatedConv) {
        setActiveConversation(updatedConv)
        setConversations((prev) => [toMeta(updatedConv), ...prev.filter((c) => c.id !== updatedConv.id)])
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
        }, currentToolType)
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
        if (currentToolType) {
          const slug = TOOL_URL_MAP[currentToolType] || currentToolType
          window.history.replaceState(null, "", `/t/${slug}/${currentId}`)
        } else {
          window.history.replaceState(null, "", `/c/${currentId}`)
        }
      }

      const finalConv = await addMessageToConversation(currentId, "assistant", fullResponse)
      if (finalConv) {
        setActiveConversation(finalConv)
        setConversations((prev) => [toMeta(finalConv), ...prev.filter((c) => c.id !== finalConv.id)])
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
      }, activeToolRef.current)
    } catch {
      fullResponse = "Sorry, an error occurred while generating the response."
    }

    setStreamingText("")
    const aiMsg = makeMsg("assistant", fullResponse)
    setDisplayMessages((prev) => [...prev.slice(0, -(lastAssistantIdx + 1)), aiMsg])

    if (activeIdRef.current) {
      const finalConv = await addMessageToConversation(activeIdRef.current, "assistant", fullResponse)
      if (finalConv) {
        setActiveConversation(finalConv)
        setConversations((prev) => [toMeta(finalConv), ...prev.filter((c) => c.id !== finalConv.id)])
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
        if (conv) {
          setActiveConversation(conv)
          setConversations((prev) => [toMeta(conv), ...prev.filter((c) => c.id !== conv.id)])
        }
      })
    }
    setStreamingText("")
    setIsGenerating(false)
  }, [cancel, streamingText])

  if (!initialized || loadingConversation) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f9fc] dark:bg-[#0f0d18]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#7c5cfc] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#f8f9fc] dark:bg-[#0f0d18]">
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
        onToolSelect={handleToolSelect}
        hasMore={hasMore}
        loadingMore={loadingMore}
        onLoadMore={loadMore}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <ChatHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          activeConversation={activeConversation}
          activeConversationId={activeId}
        />

        <div className="flex flex-1 min-h-0">
          {/* Chat Messages */}
          <div className={cn("flex flex-col min-w-0", isToolChat && previewOpen ? "w-1/2" : "flex-1")}>
            {isNewChat && displayMessages.length === 0 && !isGenerating ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] mb-4 shadow-lg shadow-[#7c5cfc]/25">
                    <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                      <path d="M12 12 2.1 9.3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">How can I help you today?</h3>
                  <p className="mt-2 text-sm text-[#6b7280]">Ask me anything — I&apos;m powered by AI.</p>
                  {isToolChat && (
                    <p className="mt-1 text-xs text-[#7c5cfc]">
                      {activeTool === "code_generator" ? "Describe what you want to build" : "Tell me about your experience"}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <ChatMessages
                messages={displayMessages}
                isGenerating={isGenerating}
                streamingText={streamingText}
                onRegenerate={displayMessages.length >= 2 ? handleRegenerate : undefined}
                toolType={activeTool}
              />
            )}

            <ChatInput onSend={handleSend} isGenerating={isGenerating} onStop={handleStop} />
          </div>

          {/* Tool Preview Panel */}
          {isToolChat && (
            <ToolPreviewPanel
              toolType={activeTool!}
              messages={displayMessages}
              streamingText={isGenerating ? streamingText : undefined}
              isGenerating={isGenerating}
              isOpen={previewOpen}
              onToggle={() => setPreviewOpen(!previewOpen)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

import { cn } from "@/lib/utils"

export function ChatLayout() {
  return (
    <AuthProvider>
      <AIProvider>
        <ChatContent />
      </AIProvider>
    </AuthProvider>
  )
}
