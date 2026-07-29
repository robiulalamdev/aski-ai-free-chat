import { NextRequest } from "next/server"
import env from "@/config/env"
import { verifyAccessToken } from "@/lib/auth"

const OPENROUTER_BASE = "https://openrouter.ai/api/v1"

async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get(env.ACCESS_COOKIE_NAME)?.value
  if (!token) return null
  return verifyAccessToken(token)
}

export async function POST(req: NextRequest) {
  if (!env.MIMO_API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 })
  }

  const user = await getUserFromRequest(req)
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { message } = await req.json()

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.MIMO_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat",
      messages: [
        { role: "system", content: "Generate a very short conversation title (max 5 words) from the user's first message. Reply with ONLY the title, no quotes, no period." },
        { role: "user", content: message },
      ],
      stream: false,
      max_tokens: 20,
    }),
  })

  if (!res.ok) {
    return Response.json({ title: message.slice(0, 50) })
  }

  const data = await res.json()
  const title = data.choices?.[0]?.message?.content?.trim() || message.slice(0, 50)

  return Response.json({ title })
}
