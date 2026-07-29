import { NextRequest } from "next/server"
import env from "@/config/env"
import { verifyAccessToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const OPENROUTER_BASE = "https://openrouter.ai/api/v1"

const ENHANCE_PROMPT = `You are a professional resume writer. Enhance the user's resume content to be more impactful, concise, and ATS-friendly.

Rules:
- Use strong action verbs
- Quantify achievements where possible
- Keep descriptions concise (1-2 lines each)
- Maintain professional tone
- Use industry-standard formatting
- Highlight key skills and accomplishments

Return the enhanced content in the same JSON format as the input.`

async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get(env.ACCESS_COOKIE_NAME)?.value
  if (!token) return null
  return verifyAccessToken(token)
}

async function checkToolAccess(userId: string, featureSlug: string): Promise<boolean> {
  const sub = await prisma.userSubscription.findFirst({
    where: { userId, isActive: true },
    include: { subscription: true },
  })
  if (!sub) return false
  try {
    const features: string[] = JSON.parse(sub.subscription.features)
    return features.includes(featureSlug)
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const hasAccess = await checkToolAccess(user.userId, "resume_builder")
  if (!hasAccess) {
    return Response.json({ error: "This tool requires a Pro plan" }, { status: 403 })
  }

  if (!env.MIMO_API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 })
  }

  const { action, data } = await req.json()

  if (action === "enhance") {
    const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.MIMO_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: ENHANCE_PROMPT },
          { role: "user", content: `Enhance this resume content. Return ONLY valid JSON in the same format:\n\n${JSON.stringify(data, null, 2)}` },
        ],
        stream: false,
        max_tokens: 2048,
      }),
    })

    if (!res.ok) {
      return Response.json({ error: "AI enhancement failed" }, { status: 500 })
    }

    const result = await res.json()
    const content = result.choices?.[0]?.message?.content || ""

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const enhanced = JSON.parse(jsonMatch[0])
        return Response.json({ enhanced })
      }
    } catch {}

    return Response.json({ enhanced: data })
  }

  return Response.json({ error: "Invalid action" }, { status: 400 })
}
