import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import env from "@/config/env"

const ACCESS_SECRET = new TextEncoder().encode(env.ACCESS_TOKEN_SECRET)
const REFRESH_SECRET = new TextEncoder().encode(env.REFRESH_TOKEN_SECRET)

export interface TokenPayload {
  userId: string
  email: string
  firstName: string
  lastName: string
}

export async function createAccessToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: env.JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(env.ACCESS_TOKEN_EXPIRES_IN)
    .sign(ACCESS_SECRET)
}

export async function createRefreshToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: env.JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(env.REFRESH_TOKEN_EXPIRES_IN)
    .sign(REFRESH_SECRET)
}

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET, { algorithms: [env.JWT_ALGORITHM] })
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET, { algorithms: [env.JWT_ALGORITHM] })
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies()
  cookieStore.set(env.ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: env.COOKIE_HTTP_ONLY,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: "/",
    maxAge: env.ACCESS_COOKIE_MAX_AGE,
  })
  cookieStore.set(env.REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: env.COOKIE_HTTP_ONLY,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: "/",
    maxAge: env.REFRESH_COOKIE_MAX_AGE,
  })
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.set(env.ACCESS_COOKIE_NAME, "", { maxAge: 0, path: "/" })
  cookieStore.set(env.REFRESH_COOKIE_NAME, "", { maxAge: 0, path: "/" })
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(env.ACCESS_COOKIE_NAME)?.value || null
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(env.REFRESH_COOKIE_NAME)?.value || null
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  const token = await getAccessToken()
  if (!token) return null
  return verifyAccessToken(token)
}
