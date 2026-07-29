import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify, SignJWT } from "jose"
import env from "@/config/env"

const ACCESS_SECRET = new TextEncoder().encode(env.ACCESS_TOKEN_SECRET)
const REFRESH_SECRET = new TextEncoder().encode(env.REFRESH_TOKEN_SECRET)

interface TokenPayload {
  userId: string
  email: string
  firstName: string
  lastName: string
}

async function verifyAccessToken(token: string): Promise<{ valid: boolean; payload?: TokenPayload }> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET, { algorithms: [env.JWT_ALGORITHM] })
    return { valid: true, payload: payload as unknown as TokenPayload }
  } catch {
    return { valid: false }
  }
}

async function verifyRefreshToken(token: string): Promise<{ valid: boolean; payload?: TokenPayload }> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET, { algorithms: [env.JWT_ALGORITHM] })
    return { valid: true, payload: payload as unknown as TokenPayload }
  } catch {
    return { valid: false }
  }
}

async function mintAccessToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: env.JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(env.ACCESS_TOKEN_EXPIRES_IN)
    .sign(ACCESS_SECRET)
}

async function mintRefreshToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: env.JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(env.REFRESH_TOKEN_EXPIRES_IN)
    .sign(REFRESH_SECRET)
}

function setCookie(response: NextResponse, name: string, value: string, maxAge: number) {
  response.cookies.set(name, value, {
    httpOnly: env.COOKIE_HTTP_ONLY,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: "/",
    maxAge,
  })
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get(env.ACCESS_COOKIE_NAME)?.value
  const refreshToken = request.cookies.get(env.REFRESH_COOKIE_NAME)?.value

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
        setCookie(response, env.ACCESS_COOKIE_NAME, await mintAccessToken(result.payload), env.ACCESS_COOKIE_MAX_AGE)
        setCookie(response, env.REFRESH_COOKIE_NAME, await mintRefreshToken(result.payload), env.REFRESH_COOKIE_MAX_AGE)
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
        setCookie(response, env.ACCESS_COOKIE_NAME, await mintAccessToken(result.payload), env.ACCESS_COOKIE_MAX_AGE)
        setCookie(response, env.REFRESH_COOKIE_NAME, await mintRefreshToken(result.payload), env.REFRESH_COOKIE_MAX_AGE)
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
