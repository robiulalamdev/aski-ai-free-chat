import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify, SignJWT } from "jose"
import env from "@/config/env"

const ACCESS_SECRET = new TextEncoder().encode(env.ACCESS_TOKEN_SECRET)
const REFRESH_SECRET = new TextEncoder().encode(env.REFRESH_TOKEN_SECRET)
const ADMIN_ACCESS_SECRET = new TextEncoder().encode(env.ADMIN_ACCESS_TOKEN_SECRET)
const ADMIN_REFRESH_SECRET = new TextEncoder().encode(env.ADMIN_REFRESH_TOKEN_SECRET)

interface TokenPayload {
  userId: string
  email: string
  firstName: string
  lastName: string
}

interface AdminTokenPayload {
  adminId: string
  email: string
  firstName: string
  lastName: string
  role: string
}

async function verify(token: string, secret: Uint8Array): Promise<{ valid: boolean; payload?: TokenPayload | AdminTokenPayload }> {
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: [env.JWT_ALGORITHM] })
    return { valid: true, payload: payload as unknown as TokenPayload | AdminTokenPayload }
  } catch {
    return { valid: false }
  }
}

async function mint(payload: Record<string, unknown>, secret: Uint8Array, expiresIn: string): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: env.JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret)
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

  // ── Admin routes ──
  const isAdminLogin = pathname === "/dashboard/login"
  const isAdminProtected = pathname.startsWith("/dashboard") && !isAdminLogin

  if (isAdminLogin || isAdminProtected) {
    const accessToken = request.cookies.get(env.ADMIN_ACCESS_COOKIE_NAME)?.value
    const refreshToken = request.cookies.get(env.ADMIN_REFRESH_COOKIE_NAME)?.value

    if (isAdminLogin) {
      if (accessToken) {
        const { valid } = await verify(accessToken, ADMIN_ACCESS_SECRET)
        if (valid) return NextResponse.redirect(new URL("/dashboard", request.url))
      }
      if (refreshToken) {
        const result = await verify(refreshToken, ADMIN_REFRESH_SECRET)
        if (result.valid && result.payload) {
          const response = NextResponse.redirect(new URL("/dashboard", request.url))
          setCookie(response, env.ADMIN_ACCESS_COOKIE_NAME, await mint(result.payload as unknown as Record<string, unknown>, ADMIN_ACCESS_SECRET, env.ADMIN_ACCESS_TOKEN_EXPIRES_IN), env.ADMIN_ACCESS_COOKIE_MAX_AGE)
          setCookie(response, env.ADMIN_REFRESH_COOKIE_NAME, await mint(result.payload as unknown as Record<string, unknown>, ADMIN_REFRESH_SECRET, env.ADMIN_REFRESH_TOKEN_EXPIRES_IN), env.ADMIN_REFRESH_COOKIE_MAX_AGE)
          return response
        }
      }
      return NextResponse.next()
    }

    if (isAdminProtected) {
      if (accessToken) {
        const { valid } = await verify(accessToken, ADMIN_ACCESS_SECRET)
        if (valid) return NextResponse.next()
      }
      if (refreshToken) {
        const result = await verify(refreshToken, ADMIN_REFRESH_SECRET)
        if (result.valid && result.payload) {
          const response = NextResponse.next()
          setCookie(response, env.ADMIN_ACCESS_COOKIE_NAME, await mint(result.payload as unknown as Record<string, unknown>, ADMIN_ACCESS_SECRET, env.ADMIN_ACCESS_TOKEN_EXPIRES_IN), env.ADMIN_ACCESS_COOKIE_MAX_AGE)
          setCookie(response, env.ADMIN_REFRESH_COOKIE_NAME, await mint(result.payload as unknown as Record<string, unknown>, ADMIN_REFRESH_SECRET, env.ADMIN_REFRESH_TOKEN_EXPIRES_IN), env.ADMIN_REFRESH_COOKIE_MAX_AGE)
          return response
        }
      }
      return NextResponse.redirect(new URL("/dashboard/login", request.url))
    }
  }

  // ── User routes ──
  const isLanding = pathname === "/"
  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const isProtected = pathname.startsWith("/c") || pathname.startsWith("/account") || pathname.startsWith("/t")

  if (isLanding) return NextResponse.next()

  const accessToken = request.cookies.get(env.ACCESS_COOKIE_NAME)?.value
  const refreshToken = request.cookies.get(env.REFRESH_COOKIE_NAME)?.value

  if (isAuthPage) {
    if (accessToken) {
      const { valid } = await verify(accessToken, ACCESS_SECRET)
      if (valid) return NextResponse.redirect(new URL("/chat/new", request.url))
    }
    if (refreshToken) {
      const result = await verify(refreshToken, REFRESH_SECRET)
      if (result.valid && result.payload) {
        const response = NextResponse.redirect(new URL("/chat/new", request.url))
        setCookie(response, env.ACCESS_COOKIE_NAME, await mint(result.payload as unknown as Record<string, unknown>, ACCESS_SECRET, env.ACCESS_TOKEN_EXPIRES_IN), env.ACCESS_COOKIE_MAX_AGE)
        setCookie(response, env.REFRESH_COOKIE_NAME, await mint(result.payload as unknown as Record<string, unknown>, REFRESH_SECRET, env.REFRESH_TOKEN_EXPIRES_IN), env.REFRESH_COOKIE_MAX_AGE)
        return response
      }
    }
    return NextResponse.next()
  }

  if (isProtected) {
    if (accessToken) {
      const { valid } = await verify(accessToken, ACCESS_SECRET)
      if (valid) return NextResponse.next()
    }
    if (refreshToken) {
      const result = await verify(refreshToken, REFRESH_SECRET)
      if (result.valid && result.payload) {
        const response = NextResponse.next()
        setCookie(response, env.ACCESS_COOKIE_NAME, await mint(result.payload as unknown as Record<string, unknown>, ACCESS_SECRET, env.ACCESS_TOKEN_EXPIRES_IN), env.ACCESS_COOKIE_MAX_AGE)
        setCookie(response, env.REFRESH_COOKIE_NAME, await mint(result.payload as unknown as Record<string, unknown>, REFRESH_SECRET, env.REFRESH_TOKEN_EXPIRES_IN), env.REFRESH_COOKIE_MAX_AGE)
        return response
      }
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/chat/:path*", "/c/:path*", "/t/:path*", "/account/:path*", "/login", "/signup", "/dashboard/:path*"],
}
