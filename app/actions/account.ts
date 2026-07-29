"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function updateAccountAction(data: {
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

export async function getAccountAction() {
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

  if (!user) return null

  const userSub = await prisma.userSubscription.findFirst({
    where: { userId: payload.userId, isActive: true },
    orderBy: { startDate: "desc" },
  })

  return {
    ...user,
    tokensUsedToday: userSub?.tokensUsedToday || 0,
  }
}

export async function hasFeatureAction(featureSlug: string): Promise<boolean> {
  const payload = await getCurrentUser()
  if (!payload) return false

  const sub = await prisma.userSubscription.findFirst({
    where: { userId: payload.userId, isActive: true },
    include: { subscription: true },
  })

  if (!sub) return false

  try {
    const features: string[] = JSON.parse(sub.subscription.features)
    return features.includes(featureSlug)
  } catch {
    return false
  }
}

export async function getSubscriptionAction() {
  try {
    const plans = await prisma.subscription.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    })

    return plans.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      maxTokensPerDay: p.maxTokensPerDay,
      features: (() => {
        try { return JSON.parse(p.features) } catch { return [] }
      })(),
      isActive: p.isActive,
    }))
  } catch {
    return []
  }
}
