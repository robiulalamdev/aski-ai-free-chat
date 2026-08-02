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
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const [
      totalUsers,
      totalConversations,
      totalMessages,
      totalSubscriptions,
      paidUsers,
      activeSubscriptions,
      usersByPlan,
      recentUsers,
      signups,
      userSubscriptions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.conversation.count(),
      prisma.message.count(),
      prisma.subscription.count(),
      prisma.user.count({ where: { plan: { not: "free" } } }),
      prisma.userSubscription.count({ where: { isActive: true } }),
      prisma.user.groupBy({ by: ["plan"], _count: { _all: true } }),
      prisma.user.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: { id: true, firstName: true, lastName: true, email: true, plan: true, createdAt: true },
      }),
      prisma.user.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true } }),
      prisma.userSubscription.findMany({ where: { isActive: true }, include: { subscription: true } }),
    ])

    const weeklySignups = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(sevenDaysAgo)
      day.setDate(day.getDate() + i)
      return {
        date: day.toLocaleDateString("en-US", { weekday: "short" }),
        full: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: 0,
      }
    })
    for (const signup of signups) {
      const idx = Math.floor((signup.createdAt.getTime() - sevenDaysAgo.getTime()) / 86400000)
      if (idx >= 0 && idx < 7) weeklySignups[idx].count++
    }

    const monthlyRevenue = userSubscriptions.reduce((sum, us) => sum + us.subscription.price, 0)

    return {
      totalUsers,
      totalConversations,
      totalMessages,
      totalSubscriptions,
      paidUsers,
      activeSubscriptions,
      monthlyRevenue,
      planDistribution: usersByPlan.map((p) => ({ plan: p.plan, count: p._count._all })),
      recentUsers,
      weeklySignups,
    }
  } catch (error) {
    console.error("getAdminDashboardStats error:", error)
    return {
      totalUsers: 0,
      totalConversations: 0,
      totalMessages: 0,
      totalSubscriptions: 0,
      paidUsers: 0,
      activeSubscriptions: 0,
      monthlyRevenue: 0,
      planDistribution: [],
      recentUsers: [],
      weeklySignups: [],
    }
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
        _count: { select: { conversations: true } },
      },
      orderBy: { createdAt: "desc" },
    })
  } catch {
    return []
  }
}

export async function getAllAdmins() {
  try {
    return await prisma.admin.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })
  } catch {
    return []
  }
}
