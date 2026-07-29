"use server"

import { prisma } from "@/lib/prisma"
import { verifyAccessToken } from "@/lib/auth"
import { cookies } from "next/headers"

async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("freeai_access_token")?.value
  if (!token) return null
  try {
    const payload = await verifyAccessToken(token)
    return payload as { userId: string; email: string }
  } catch {
    return null
  }
}

export async function createConversation(title?: string, toolType?: string) {
  const user = await getUser()
  if (!user) return null

  const conv = await prisma.conversation.create({
    data: {
      userId: user.userId,
      title: title || "New Chat",
      toolType: toolType || null,
    },
    include: { messages: true },
  })

  return {
    id: conv.id,
    title: conv.title,
    toolType: conv.toolType,
    messages: conv.messages.map((m) => ({ id: m.id, role: m.role as "user" | "assistant", content: m.content, createdAt: m.createdAt.getTime() })),
    createdAt: conv.createdAt.getTime(),
    updatedAt: conv.updatedAt.getTime(),
    modelId: "default",
  }
}

export async function getUserConversations() {
  const user = await getUser()
  if (!user) return []

  const convs = await prisma.conversation.findMany({
    where: { userId: user.userId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
    orderBy: { updatedAt: "desc" },
  })

  return convs.map((c) => ({
    id: c.id,
    title: c.title,
    toolType: c.toolType,
    messages: c.messages.map((m) => ({ id: m.id, role: m.role as "user" | "assistant", content: m.content, createdAt: m.createdAt.getTime() })),
    createdAt: c.createdAt.getTime(),
    updatedAt: c.updatedAt.getTime(),
    modelId: "default",
  }))
}

export async function getConversationById(id: string) {
  const user = await getUser()
  if (!user) return null

  const conv = await prisma.conversation.findFirst({
    where: { id, userId: user.userId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  })

  if (!conv) return null

  return {
    id: conv.id,
    title: conv.title,
    toolType: conv.toolType,
    messages: conv.messages.map((m) => ({ id: m.id, role: m.role as "user" | "assistant", content: m.content, createdAt: m.createdAt.getTime() })),
    createdAt: conv.createdAt.getTime(),
    updatedAt: conv.updatedAt.getTime(),
    modelId: "default",
  }
}

export async function addMessageToConversation(conversationId: string, role: string, content: string) {
  const user = await getUser()
  if (!user) return null

  const conv = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: user.userId },
    include: { messages: true },
  })

  if (!conv) return null

  const message = await prisma.message.create({
    data: { conversationId, role, content },
  })

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  })

  return {
    id: conv.id,
    title: conv.title,
    toolType: conv.toolType,
    messages: [...conv.messages, message].map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content: m.content,
      createdAt: m.createdAt.getTime(),
    })),
    createdAt: conv.createdAt.getTime(),
    updatedAt: Date.now(),
    modelId: "default",
  }
}

export async function updateConversationTitle(id: string, title: string) {
  const user = await getUser()
  if (!user) return null

  await prisma.conversation.updateMany({
    where: { id, userId: user.userId },
    data: { title },
  })

  return { success: true }
}

export async function deleteUserConversation(id: string) {
  const user = await getUser()
  if (!user) return null

  await prisma.conversation.deleteMany({
    where: { id, userId: user.userId },
  })

  return { success: true }
}
