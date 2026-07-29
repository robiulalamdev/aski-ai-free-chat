"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export type FeatureSlug =
  | "custom_prompts"
  | "export_data"
  | "priority_support"
  | "api_access"
  | "team_management"
  | "dedicated_support"
  | "custom_integrations"
  | "advanced_analytics"
  | "custom_theme"

export interface Feature {
  slug: FeatureSlug
  name: string
  description: string
}

export const ALL_FEATURES: Feature[] = [
  { slug: "custom_prompts", name: "Custom System Prompts", description: "Set your own AI instructions" },
  { slug: "export_data", name: "Export Chat History", description: "Download your conversations" },
  { slug: "priority_support", name: "Priority Support", description: "Faster response times" },
  { slug: "api_access", name: "API Access", description: "Access NexaChat via API" },
  { slug: "team_management", name: "Team Management", description: "Invite and manage team members" },
  { slug: "dedicated_support", name: "Dedicated Support", description: "Direct line to our team" },
  { slug: "custom_integrations", name: "Custom Integrations", description: "Connect with your tools" },
  { slug: "advanced_analytics", name: "Advanced Analytics", description: "Detailed usage insights" },
  { slug: "custom_theme", name: "Custom Theme", description: "Full UI customization" },
]

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

export async function hasFeature(featureSlug: FeatureSlug): Promise<boolean> {
  const features = await getUserFeatures()
  return features.includes(featureSlug)
}
