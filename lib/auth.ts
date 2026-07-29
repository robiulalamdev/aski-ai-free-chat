import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const ACCESS_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET)
const REFRESH_SECRET = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET)
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || "HS256"

const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || "1h"
const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"

const ACCESS_COOKIE = process.env.ACCESS_COOKIE_NAME || "freeai_access_token"
const REFRESH_COOKIE = process.env.REFRESH_COOKIE_NAME || "freeai_refresh_token"
const ACCESS_COOKIE_MAX_AGE = parseInt(process.env.ACCESS_COOKIE_MAX_AGE || "3600", 10)
const REFRESH_COOKIE_MAX_AGE = parseInt(process.env.REFRESH_COOKIE_MAX_AGE || "604800", 10)

const COOKIE_SECURE = process.env.COOKIE_SECURE === "true"
const COOKIE_HTTP_ONLY = process.env.COOKIE_HTTP_ONLY !== "false"
const COOKIE_SAME_SITE = (process.env.COOKIE_SAME_SITE || "lax") as "lax" | "strict" | "none"

export interface TokenPayload {
  userId: string
  email: string
  firstName: string
  lastName: string
}

export async function createAccessToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRES)
    .sign(ACCESS_SECRET)
}

export async function createRefreshToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRES)
    .sign(REFRESH_SECRET)
}

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET, { algorithms: [JWT_ALGORITHM] })
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET, { algorithms: [JWT_ALGORITHM] })
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies()
  cookieStore.set(ACCESS_COOKIE, accessToken, {
    httpOnly: COOKIE_HTTP_ONLY,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAME_SITE,
    path: "/",
    maxAge: ACCESS_COOKIE_MAX_AGE,
  })
  cookieStore.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: COOKIE_HTTP_ONLY,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAME_SITE,
    path: "/",
    maxAge: REFRESH_COOKIE_MAX_AGE,
  })
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.set(ACCESS_COOKIE, "", { maxAge: 0, path: "/" })
  cookieStore.set(REFRESH_COOKIE, "", { maxAge: 0, path: "/" })
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(ACCESS_COOKIE)?.value || null
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(REFRESH_COOKIE)?.value || null
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  const token = await getAccessToken()
  if (!token) return null
  return verifyAccessToken(token)
}
