import type { Conversation, Message } from "@/types/chat"

const STORAGE_KEY = "freeai-conversations"

function generateId() {
  return crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveConversations(conversations: Conversation[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
  } catch {}
}

export function createAndSaveConversation(welcomeMessage?: string, modelId = "default"): Conversation {
  const conv: Conversation = {
    id: generateId(),
    title: "New Chat",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    modelId,
  }
  if (welcomeMessage) {
    conv.messages.push({
      id: generateId(),
      role: "assistant",
      content: welcomeMessage,
      createdAt: Date.now(),
    })
  }
  saveConversations([conv])
  return { ...conv, messages: [...conv.messages] }
}

export function addMessage(conversationId: string, role: Message["role"], content: string): Conversation | null {
  const conversations = loadConversations()
  const idx = conversations.findIndex((c) => c.id === conversationId)
  if (idx === -1) return null

  const message: Message = {
    id: generateId(),
    role,
    content,
    createdAt: Date.now(),
  }

  conversations[idx].messages.push(message)
  conversations[idx].updatedAt = Date.now()

  if (conversations[idx].messages.length === 1 && role === "user") {
    conversations[idx].title = content.slice(0, 50) + (content.length > 50 ? "..." : "")
  }

  saveConversations(conversations)
  return conversations[idx]
}

export function getConversations(): Conversation[] {
  return loadConversations()
}

export function getConversation(id: string): Conversation | undefined {
  return loadConversations().find((c) => c.id === id)
}

export function deleteConversation(id: string) {
  const conversations = loadConversations().filter((c) => c.id !== id)
  saveConversations(conversations)
}

export function renameConversation(id: string, title: string) {
  const conversations = loadConversations()
  const idx = conversations.findIndex((c) => c.id === id)
  if (idx !== -1) {
    conversations[idx].title = title
    conversations[idx].updatedAt = Date.now()
    saveConversations(conversations)
  }
}
