import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || "HS256"

const COOKIE_NAME = process.env.COOKIE_NAME || "freeai_session_token"
const COOKIE_MAX_AGE = parseInt(process.env.COOKIE_MAX_AGE || "604800", 10)
const COOKIE_SECURE = process.env.COOKIE_SECURE === "true"
const COOKIE_HTTP_ONLY = process.env.COOKIE_HTTP_ONLY !== "false"
const COOKIE_SAME_SITE = (process.env.COOKIE_SAME_SITE || "lax") as "lax" | "strict" | "none"

export interface JWTPayload {
  userId: string
  email: string
  firstName: string
  lastName: string
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
    })
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: COOKIE_HTTP_ONLY,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAME_SITE,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  })
}

export async function getSessionCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value || null
}

export async function removeSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: COOKIE_HTTP_ONLY,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAME_SITE,
    path: "/",
    maxAge: 0,
  })
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getSessionCookie()
  if (!token) return null
  return verifyToken(token)
}
