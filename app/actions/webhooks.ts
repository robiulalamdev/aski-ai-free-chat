"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { requireFeature } from "@/lib/features-server"
import crypto from "crypto"

export async function getWebhooks() {
  const user = await getCurrentUser()
  if (!user) return []

  const webhooks = await prisma.webhook.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: "desc" },
  })

  return webhooks.map((w) => ({
    id: w.id,
    url: w.url,
    events: (() => { try { return JSON.parse(w.events) } catch { return [] } })(),
    isActive: w.isActive,
    createdAt: w.createdAt,
  }))
}

export async function createWebhook(url: string, events: string[]) {
  const user = await getCurrentUser()
  if (!user) return { error: "Not authenticated" }

  const planCheck = await requireFeature("custom_integrations")
  if (!planCheck.allowed) return { error: planCheck.error }

  if (!url.startsWith("http")) return { error: "Invalid URL" }
  if (events.length === 0) return { error: "Select at least one event" }

  const count = await prisma.webhook.count({ where: { userId: user.userId } })
  if (count >= 5) return { error: "Webhook limit reached (max 5)" }

  const secret = crypto.randomBytes(32).toString("hex")

  await prisma.webhook.create({
    data: {
      userId: user.userId,
      url,
      events: JSON.stringify(events),
      secret,
    },
  })

  return { success: true, secret }
}

export async function deleteWebhook(id: string) {
  const user = await getCurrentUser()
  if (!user) return { error: "Not authenticated" }

  const planCheck = await requireFeature("custom_integrations")
  if (!planCheck.allowed) return { error: planCheck.error }

  const webhook = await prisma.webhook.findUnique({ where: { id } })
  if (!webhook || webhook.userId !== user.userId) return { error: "Not found" }

  await prisma.webhook.delete({ where: { id } })
  return { success: true }
}

export async function toggleWebhook(id: string) {
  const user = await getCurrentUser()
  if (!user) return { error: "Not authenticated" }

  const planCheck = await requireFeature("custom_integrations")
  if (!planCheck.allowed) return { error: planCheck.error }

  const webhook = await prisma.webhook.findUnique({ where: { id } })
  if (!webhook || webhook.userId !== user.userId) return { error: "Not found" }

  await prisma.webhook.update({ where: { id }, data: { isActive: !webhook.isActive } })
  return { success: true }
}
