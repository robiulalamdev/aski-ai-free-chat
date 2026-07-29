"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function getAnalytics() {
  const tokenUser = await getCurrentUser()
  if (!tokenUser) return null

  const user = await prisma.user.findUnique({ where: { id: tokenUser.userId }, select: { plan: true, createdAt: true } })
  if (!user) return null

  const userSub = await prisma.userSubscription.findFirst({
    where: { userId: tokenUser.userId, isActive: true },
    include: { subscription: true },
    orderBy: { startDate: "desc" },
  })

  const plan = await prisma.subscription.findUnique({ where: { slug: user.plan } })

  const conversations = await prisma.conversation.findMany({
    where: { userId: tokenUser.userId },
    include: { messages: true },
    orderBy: { createdAt: "desc" },
  })

  const totalMessages = conversations.reduce((acc, c) => acc + c.messages.length, 0)
  const userMessages = conversations.reduce((acc, c) => acc + c.messages.filter((m) => m.role === "user").length, 0)
  const assistantMessages = totalMessages - userMessages

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const messagesThisWeek = conversations.reduce((acc, c) => {
    return acc + c.messages.filter((m) => new Date(m.createdAt) >= weekAgo).length
  }, 0)

  const messagesThisMonth = conversations.reduce((acc, c) => {
    return acc + c.messages.filter((m) => new Date(m.createdAt) >= monthAgo).length
  }, 0)

  const dailyUsage: { date: string; count: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
    const count = conversations.reduce((acc, c) => {
      return acc + c.messages.filter((m) => {
        const d = new Date(m.createdAt)
        return d >= dayStart && d < dayEnd
      }).length
    }, 0)
    dailyUsage.push({
      date: dayStart.toLocaleDateString("en", { weekday: "short" }),
      count,
    })
  }

  const topConversations = conversations
    .sort((a, b) => b.messages.length - a.messages.length)
    .slice(0, 5)
    .map((c) => ({
      title: c.title,
      messageCount: c.messages.length,
      createdAt: c.createdAt,
    }))

  return {
    plan: plan?.name || "Free",
    tokensUsedToday: userSub?.tokensUsedToday || 0,
    tokensLimit: plan?.maxTokensPerDay || 50000,
    totalConversations: conversations.length,
    totalMessages,
    userMessages,
    assistantMessages,
    messagesThisWeek,
    messagesThisMonth,
    dailyUsage,
    topConversations,
    memberSince: user.createdAt,
  }
}
