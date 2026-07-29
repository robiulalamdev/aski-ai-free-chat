"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import {
  createAdminAccessToken,
  createAdminRefreshToken,
  setAdminAuthCookies,
  clearAdminAuthCookies,
  getCurrentAdmin,
  type AdminTokenPayload,
  type AdminRole,
} from "@/lib/admin-auth"

export async function adminLoginAction(data: { email: string; password: string }) {
  try {
    const admin = await prisma.admin.findUnique({ where: { email: data.email } })
    if (!admin) return { error: "Invalid email or password" }
    if (!admin.isActive) return { error: "Account is disabled" }

    const valid = await bcrypt.compare(data.password, admin.password)
    if (!valid) return { error: "Invalid email or password" }

    const payload: AdminTokenPayload = {
      adminId: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role as AdminRole,
    }

    const accessToken = await createAdminAccessToken(payload)
    const refreshToken = await createAdminRefreshToken(payload)
    await setAdminAuthCookies(accessToken, refreshToken)

    return { success: true }
  } catch (error) {
    console.error("Admin login error:", error)
    return { error: "Login failed. Please try again." }
  }
}

export async function adminLogoutAction() {
  await clearAdminAuthCookies()
  return { success: true }
}

export async function getAdminAction(): Promise<AdminTokenPayload | null> {
  return getCurrentAdmin()
}

export async function getAdminDashboardStats() {
  try {
    const [totalUsers, totalConversations, totalSubscriptions] = await Promise.all([
      prisma.user.count(),
      prisma.conversation.count(),
      prisma.subscription.count(),
    ])
    return { totalUsers, totalConversations, totalSubscriptions }
  } catch {
    return { totalUsers: 0, totalConversations: 0, totalSubscriptions: 0 }
  }
}

export async function getAllSubscriptions() {
  try {
    return await prisma.subscription.findMany({ orderBy: { price: "asc" } })
  } catch {
    return []
  }
}

export async function createSubscription(data: {
  name: string
  slug: string
  description: string
  price: number
  maxTokensPerDay: number
  features: string[]
}) {
  try {
    const existing = await prisma.subscription.findUnique({ where: { slug: data.slug } })
    if (existing) return { error: "A subscription with this slug already exists" }

    await prisma.subscription.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        maxTokensPerDay: data.maxTokensPerDay,
        features: JSON.stringify(data.features),
      },
    })
    return { success: true }
  } catch (error) {
    console.error("Create subscription error:", error)
    return { error: "Failed to create subscription" }
  }
}

export async function updateSubscription(
  id: string,
  data: {
    name: string
    slug: string
    description: string
    price: number
    maxTokensPerDay: number
    features: string[]
  }
) {
  try {
    await prisma.subscription.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        maxTokensPerDay: data.maxTokensPerDay,
        features: JSON.stringify(data.features),
      },
    })
    return { success: true }
  } catch (error) {
    console.error("Update subscription error:", error)
    return { error: "Failed to update subscription" }
  }
}

export async function deleteSubscription(id: string) {
  try {
    await prisma.subscription.delete({ where: { id } })
    return { success: true }
  } catch (error) {
    console.error("Delete subscription error:", error)
    return { error: "Failed to delete subscription" }
  }
}

export async function toggleSubscriptionActive(id: string) {
  try {
    const sub = await prisma.subscription.findUnique({ where: { id } })
    if (!sub) return { error: "Subscription not found" }

    await prisma.subscription.update({
      where: { id },
      data: { isActive: !sub.isActive },
    })
    return { success: true }
  } catch (error) {
    console.error("Toggle subscription error:", error)
    return { error: "Failed to toggle subscription" }
  }
}

export async function getAllUsers() {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        plan: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })
  } catch {
    return []
  }
}
