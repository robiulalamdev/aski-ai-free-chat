"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function updateProfileAction(data: {
  firstName?: string
  lastName?: string
  bio?: string
}) {
  const payload = await getCurrentUser()
  if (!payload) return { error: "Not authenticated" }

  await prisma.user.update({
    where: { id: payload.userId },
    data,
  })

  return { success: true }
}

export async function updatePreferencesAction(data: {
  systemPrompt?: string
  theme?: string
}) {
  const payload = await getCurrentUser()
  if (!payload) return { error: "Not authenticated" }

  await prisma.user.update({
    where: { id: payload.userId },
    data,
  })

  return { success: true }
}

export async function getProfileAction() {
  const payload = await getCurrentUser()
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      bio: true,
      systemPrompt: true,
      theme: true,
      plan: true,
      createdAt: true,
    },
  })

  return user
}

export async function getSubscriptionAction() {
  const payload = await getCurrentUser()
  if (!payload) return null

  const sub = await prisma.userSubscription.findFirst({
    where: { userId: payload.userId, isActive: true },
    include: { subscription: true },
  })

  return sub
}
