import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify, SignJWT } from "jose"

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

interface TokenPayload {
  userId: string
  email: string
  firstName: string
  lastName: string
}

async function verifyAccessToken(token: string): Promise<{ valid: boolean; payload?: TokenPayload }> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET, { algorithms: [JWT_ALGORITHM] })
    return { valid: true, payload: payload as unknown as TokenPayload }
  } catch {
    return { valid: false }
  }
}

async function verifyRefreshToken(token: string): Promise<{ valid: boolean; payload?: TokenPayload }> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET, { algorithms: [JWT_ALGORITHM] })
    return { valid: true, payload: payload as unknown as TokenPayload }
  } catch {
    return { valid: false }
  }
}

async function mintAccessToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRES)
    .sign(ACCESS_SECRET)
}

async function mintRefreshToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRES)
    .sign(REFRESH_SECRET)
}

function setCookie(response: NextResponse, name: string, value: string, maxAge: number) {
  response.cookies.set(name, value, {
    httpOnly: COOKIE_HTTP_ONLY,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAME_SITE,
    path: "/",
    maxAge,
  })
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value

  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const isChatPage = pathname.startsWith("/chat")
  const isLanding = pathname === "/"

  if (isLanding) return NextResponse.next()

  // Auth pages — redirect to chat if already logged in
  if (isAuthPage) {
    if (accessToken) {
      const { valid } = await verifyAccessToken(accessToken)
      if (valid) return NextResponse.redirect(new URL("/chat", request.url))
    }
    if (refreshToken) {
      const result = await verifyRefreshToken(refreshToken)
      if (result.valid && result.payload) {
        const response = NextResponse.redirect(new URL("/chat", request.url))
        setCookie(response, ACCESS_COOKIE, await mintAccessToken(result.payload), ACCESS_COOKIE_MAX_AGE)
        setCookie(response, REFRESH_COOKIE, await mintRefreshToken(result.payload), REFRESH_COOKIE_MAX_AGE)
        return response
      }
    }
    return NextResponse.next()
  }

  // Chat pages — require auth
  if (isChatPage) {
    if (accessToken) {
      const { valid } = await verifyAccessToken(accessToken)
      if (valid) return NextResponse.next()
    }

    if (refreshToken) {
      const result = await verifyRefreshToken(refreshToken)
      if (result.valid && result.payload) {
        const response = NextResponse.next()
        setCookie(response, ACCESS_COOKIE, await mintAccessToken(result.payload), ACCESS_COOKIE_MAX_AGE)
        setCookie(response, REFRESH_COOKIE, await mintRefreshToken(result.payload), REFRESH_COOKIE_MAX_AGE)
        return response
      }
    }

    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/chat/:path*", "/login", "/signup"],
}
