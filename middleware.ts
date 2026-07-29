import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || "HS256"

interface TokenPayload {
  userId: string
  email: string
  firstName: string
  lastName: string
}

async function verifyToken(token: string): Promise<{ valid: boolean; expired: boolean; payload?: TokenPayload }> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] })
    return { valid: true, expired: false, payload: payload as unknown as TokenPayload }
  } catch (err: unknown) {
    const isExpired = err instanceof Error && err.name === "JWTExpired"
    return { valid: false, expired: isExpired }
  }
}

async function createAccessToken(payload: TokenPayload): Promise<string> {
  const { SignJWT } = await import("jose")
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(JWT_SECRET)
}

async function createRefreshToken(payload: TokenPayload): Promise<string> {
  const { SignJWT } = await import("jose")
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("freeai_access_token")?.value
  const refreshToken = request.cookies.get("freeai_refresh_token")?.value

  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const isChatPage = pathname.startsWith("/chat")
  const isLanding = pathname === "/"

  // Landing page always allowed
  if (isLanding) {
    return NextResponse.next()
  }

  // Auth pages
  if (isAuthPage) {
    // Already logged in? Redirect to chat
    if (accessToken) {
      const { valid } = await verifyToken(accessToken)
      if (valid) {
        return NextResponse.redirect(new URL("/chat", request.url))
      }
    }
    // Try refresh token
    if (refreshToken) {
      const refreshResult = await verifyToken(refreshToken)
      if (refreshResult.valid && refreshResult.payload) {
        const newAccessToken = await createAccessToken(refreshResult.payload)
        const newRefreshToken = await createRefreshToken(refreshResult.payload)
        const response = NextResponse.redirect(new URL("/chat", request.url))
        response.cookies.set("freeai_access_token", newAccessToken, {
          httpOnly: true,
          secure: process.env.COOKIE_SECURE === "true",
          sameSite: (process.env.COOKIE_SAME_SITE || "lax") as "lax" | "strict" | "none",
          path: "/",
          maxAge: 60 * 60,
        })
        response.cookies.set("freeai_refresh_token", newRefreshToken, {
          httpOnly: true,
          secure: process.env.COOKIE_SECURE === "true",
          sameSite: (process.env.COOKIE_SAME_SITE || "lax") as "lax" | "strict" | "none",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        })
        return response
      }
    }
    return NextResponse.next()
  }

  // Chat pages — require auth
  if (isChatPage) {
    // Access token valid — let through
    if (accessToken) {
      const { valid } = await verifyToken(accessToken)
      if (valid) {
        return NextResponse.next()
      }
    }

    // Access token expired — try refresh
    if (refreshToken) {
      const refreshResult = await verifyToken(refreshToken)
      if (refreshResult.valid && refreshResult.payload) {
        const newAccessToken = await createAccessToken(refreshResult.payload)
        const newRefreshToken = await createRefreshToken(refreshResult.payload)
        const response = NextResponse.next()
        response.cookies.set("freeai_access_token", newAccessToken, {
          httpOnly: true,
          secure: process.env.COOKIE_SECURE === "true",
          sameSite: (process.env.COOKIE_SAME_SITE || "lax") as "lax" | "strict" | "none",
          path: "/",
          maxAge: 60 * 60,
        })
        response.cookies.set("freeai_refresh_token", newRefreshToken, {
          httpOnly: true,
          secure: process.env.COOKIE_SECURE === "true",
          sameSite: (process.env.COOKIE_SAME_SITE || "lax") as "lax" | "strict" | "none",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        })
        return response
      }
    }

    // Both tokens invalid — redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/chat/:path*", "/login", "/signup"],
}
