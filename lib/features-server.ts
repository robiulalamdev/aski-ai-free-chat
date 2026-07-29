"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import type { FeatureSlug } from "@/lib/features"

export async function getUserFeatures(): Promise<FeatureSlug[]> {
  const user = await getCurrentUser()
  if (!user) return []

  const sub = await prisma.userSubscription.findFirst({
    where: { userId: user.userId, isActive: true },
    include: { subscription: true },
  })

  if (!sub) return []

  try {
    const features: string[] = JSON.parse(sub.subscription.features)
    return features as FeatureSlug[]
  } catch {
    return []
  }
}

export async function hasFeature(featureSlug: string): Promise<boolean> {
  const features = await getUserFeatures()
  return features.includes(featureSlug as FeatureSlug)
}

export async function requireFeature(featureSlug: FeatureSlug): Promise<{ allowed: boolean; error?: string }> {
  const user = await getCurrentUser()
  if (!user) return { allowed: false, error: "Not authenticated" }

  const has = await hasFeature(featureSlug)
  if (!has) {
    return {
      allowed: false,
      error: `This feature requires a paid plan. Please upgrade to access ${featureSlug.replace(/_/g, " ")}.`,
    }
  }

  return { allowed: true }
}

export async function getUserPlan() {
  const user = await getCurrentUser()
  if (!user) return null

  const sub = await prisma.userSubscription.findFirst({
    where: { userId: user.userId, isActive: true },
    include: { subscription: true },
  })

  if (!sub) return { name: "Free", slug: "free", maxTokensPerDay: 50000, features: [] as FeatureSlug[] }

  try {
    const features: string[] = JSON.parse(sub.subscription.features)
    return {
      name: sub.subscription.name,
      slug: sub.subscription.slug,
      maxTokensPerDay: sub.subscription.maxTokensPerDay,
      features: features as FeatureSlug[],
    }
  } catch {
    return { name: sub.subscription.name, slug: sub.subscription.slug, maxTokensPerDay: sub.subscription.maxTokensPerDay, features: [] as FeatureSlug[] }
  }
}
