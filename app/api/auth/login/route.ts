import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { createToken, setSessionCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })
    await setSessionCookie(token)

    return Response.json({
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, plan: user.plan },
    })
  } catch (err) {
    console.error("Login error:", err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
