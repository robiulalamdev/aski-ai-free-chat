import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import env from "@/config/env"

const ADMIN_ACCESS_SECRET = new TextEncoder().encode(env.ADMIN_ACCESS_TOKEN_SECRET)
const ADMIN_REFRESH_SECRET = new TextEncoder().encode(env.ADMIN_REFRESH_TOKEN_SECRET)

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "MODERATOR"

export interface AdminTokenPayload {
  adminId: string
  email: string
  firstName: string
  lastName: string
  role: AdminRole
}

export async function createAdminAccessToken(payload: AdminTokenPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: env.JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(env.ADMIN_ACCESS_TOKEN_EXPIRES_IN)
    .sign(ADMIN_ACCESS_SECRET)
}

export async function createAdminRefreshToken(payload: AdminTokenPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: env.JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(env.ADMIN_REFRESH_TOKEN_EXPIRES_IN)
    .sign(ADMIN_REFRESH_SECRET)
}

export async function verifyAdminAccessToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_ACCESS_SECRET, { algorithms: [env.JWT_ALGORITHM] })
    return payload as unknown as AdminTokenPayload
  } catch {
    return null
  }
}

export async function verifyAdminRefreshToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_REFRESH_SECRET, { algorithms: [env.JWT_ALGORITHM] })
    return payload as unknown as AdminTokenPayload
  } catch {
    return null
  }
}

export async function setAdminAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies()
  cookieStore.set(env.ADMIN_ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: env.COOKIE_HTTP_ONLY,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: "/",
    maxAge: env.ADMIN_ACCESS_COOKIE_MAX_AGE,
  })
  cookieStore.set(env.ADMIN_REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: env.COOKIE_HTTP_ONLY,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: "/",
    maxAge: env.ADMIN_REFRESH_COOKIE_MAX_AGE,
  })
}

export async function clearAdminAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.set(env.ADMIN_ACCESS_COOKIE_NAME, "", { maxAge: 0, path: "/" })
  cookieStore.set(env.ADMIN_REFRESH_COOKIE_NAME, "", { maxAge: 0, path: "/" })
}

export async function getAdminAccessToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(env.ADMIN_ACCESS_COOKIE_NAME)?.value || null
}

export async function getAdminRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(env.ADMIN_REFRESH_COOKIE_NAME)?.value || null
}

export async function getCurrentAdmin(): Promise<AdminTokenPayload | null> {
  const token = await getAdminAccessToken()
  if (!token) return null
  return verifyAdminAccessToken(token)
}

const ROLE_HIERARCHY: Record<AdminRole, number> = {
  SUPER_ADMIN: 3,
  ADMIN: 2,
  MODERATOR: 1,
}

export function hasRole(userRole: AdminRole, requiredRole: AdminRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}
