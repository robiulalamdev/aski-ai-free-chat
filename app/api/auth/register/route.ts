import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { createToken, setSessionCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await req.json()

    if (!firstName || !lastName || !email || !password) {
      return Response.json({ error: "First name, last name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return Response.json({ error: "Email already in use" }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: hashed },
    })

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
    console.error("Register error:", err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
