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
