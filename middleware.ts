import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("freeai-token")?.value
  const { pathname } = request.nextUrl

  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const isChatPage = pathname.startsWith("/chat")
  const isApiAuth = pathname.startsWith("/api/auth")
  const isLanding = pathname === "/"

  if (isApiAuth) {
    return NextResponse.next()
  }

  if (isLanding) {
    return NextResponse.next()
  }

  if (isChatPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/chat", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/chat/:path*", "/login", "/signup"],
}
