"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { requireFeature } from "@/lib/features-server"
import { FEATURES } from "@/lib/features"

export async function getTeamMembers() {
  const user = await getCurrentUser()
  if (!user) return []

  const members = await prisma.teamMember.findMany({
    where: { teamOwnerId: user.userId },
    include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })

  return members.map((m) => ({
    id: m.id,
    role: m.role,
    isActive: m.isActive,
    createdAt: m.createdAt,
    user: m.user,
  }))
}

export async function inviteTeamMember(email: string) {
  const user = await getCurrentUser()
  if (!user) return { error: "Not authenticated" }

  const planCheck = await requireFeature(FEATURES.TEAM_MANAGEMENT)
  if (!planCheck.allowed) return { error: planCheck.error }

  const targetUser = await prisma.user.findUnique({ where: { email } })
  if (!targetUser) return { error: "User not found with this email" }
  if (targetUser.id === user.userId) return { error: "You cannot invite yourself" }

  const existing = await prisma.teamMember.findUnique({
    where: { userId_teamOwnerId: { userId: targetUser.id, teamOwnerId: user.userId } },
  })
  if (existing) return { error: "User is already in your team" }

  const memberCount = await prisma.teamMember.count({ where: { teamOwnerId: user.userId } })
  if (memberCount >= 5) return { error: "Team limit reached (max 5 members on current plan)" }

  await prisma.teamMember.create({
    data: {
      userId: targetUser.id,
      teamOwnerId: user.userId,
      role: "member",
    },
  })

  return { success: true }
}

export async function removeTeamMember(memberId: string) {
  const user = await getCurrentUser()
  if (!user) return { error: "Not authenticated" }

  const planCheck = await requireFeature(FEATURES.TEAM_MANAGEMENT)
  if (!planCheck.allowed) return { error: planCheck.error }

  const member = await prisma.teamMember.findUnique({ where: { id: memberId } })
  if (!member || member.teamOwnerId !== user.userId) return { error: "Not found" }

  await prisma.teamMember.delete({ where: { id: memberId } })
  return { success: true }
}

export async function updateTeamMemberRole(memberId: string, role: string) {
  const user = await getCurrentUser()
  if (!user) return { error: "Not authenticated" }

  const planCheck = await requireFeature(FEATURES.TEAM_MANAGEMENT)
  if (!planCheck.allowed) return { error: planCheck.error }

  const member = await prisma.teamMember.findUnique({ where: { id: memberId } })
  if (!member || member.teamOwnerId !== user.userId) return { error: "Not found" }

  if (!["admin", "member"].includes(role)) return { error: "Invalid role" }

  await prisma.teamMember.update({ where: { id: memberId }, data: { role } })
  return { success: true }
}
