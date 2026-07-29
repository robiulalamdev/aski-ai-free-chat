import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || "HS256"

const ACCESS_COOKIE = "freeai_access_token"
const REFRESH_COOKIE = "freeai_refresh_token"

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
    .setExpirationTime("1h")
    .sign(JWT_SECRET)
}

export async function createRefreshToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] })
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
    maxAge: 60 * 60, // 1 hour
  })
  cookieStore.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: COOKIE_HTTP_ONLY,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAME_SITE,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
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
  return verifyToken(token)
}
