"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import {
  createAccessToken,
  createRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  getCurrentUser,
} from "@/lib/auth"

export async function registerAction(formData: {
  firstName: string
  lastName: string
  email: string
  password: string
}) {
  const { firstName, lastName, email, password } = formData

  if (!firstName || !lastName || !email || !password) {
    return { error: "All fields are required" }
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: "Email already in use" }
  }

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { firstName, lastName, email, password: hashed },
  })

  const payload = { userId: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
  const accessToken = await createAccessToken(payload)
  const refreshToken = await createRefreshToken(payload)
  await setAuthCookies(accessToken, refreshToken)

  redirect("/chat")
}

export async function loginAction(formData: {
  email: string
  password: string
}) {
  const { email, password } = formData

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return { error: "Invalid email or password" }
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return { error: "Invalid email or password" }
  }

  const payload = { userId: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
  const accessToken = await createAccessToken(payload)
  const refreshToken = await createRefreshToken(payload)
  await setAuthCookies(accessToken, refreshToken)

  redirect("/chat")
}

export async function logoutAction() {
  await clearAuthCookies()
  redirect("/login")
}

export async function getCurrentUserAction() {
  const payload = await getCurrentUser()
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, firstName: true, lastName: true, email: true, plan: true, createdAt: true },
  })

  return user
}
