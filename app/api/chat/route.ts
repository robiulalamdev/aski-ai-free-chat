import { NextRequest } from "next/server"
import env from "@/config/env"
import { verifyAccessToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const OPENROUTER_BASE = "https://openrouter.ai/api/v1"

async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get(env.ACCESS_COOKIE_NAME)?.value
  if (!token) return null
  return verifyAccessToken(token)
}

async function checkAndUpdateTokenUsage(userId: string): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } })
  if (!user) return { allowed: false, remaining: 0, limit: 0 }

  const sub = await prisma.subscription.findUnique({ where: { slug: user.plan } })
  if (!sub) return { allowed: false, remaining: 0, limit: 0 }

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  let userSub = await prisma.userSubscription.findFirst({
    where: { userId, isActive: true },
    orderBy: { startDate: "desc" },
  })

  if (!userSub) {
    userSub = await prisma.userSubscription.create({
      data: {
        userId,
        subscriptionId: sub.id,
        tokensUsedToday: 0,
        lastResetAt: todayStart,
      },
    })
  }

  const lastReset = new Date(userSub.lastResetAt)
  const needsReset = lastReset < todayStart

  if (needsReset) {
    await prisma.userSubscription.update({
      where: { id: userSub.id },
      data: { tokensUsedToday: 0, lastResetAt: todayStart },
    })
    userSub.tokensUsedToday = 0
  }

  const remaining = sub.maxTokensPerDay - userSub.tokensUsedToday
  if (remaining <= 0) {
    return { allowed: false, remaining: 0, limit: sub.maxTokensPerDay }
  }

  return { allowed: true, remaining, limit: sub.maxTokensPerDay }
}

async function incrementTokenUsage(userId: string, tokens: number) {
  const userSub = await prisma.userSubscription.findFirst({
    where: { userId, isActive: true },
    orderBy: { startDate: "desc" },
  })

  if (userSub) {
    await prisma.userSubscription.update({
      where: { id: userSub.id },
      data: { tokensUsedToday: { increment: tokens } },
    })
  }
}

export async function POST(req: NextRequest) {
  if (!env.MIMO_API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 })
  }

  const user = await getUserFromRequest(req)
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { allowed, remaining, limit } = await checkAndUpdateTokenUsage(user.userId)
  if (!allowed) {
    return Response.json(
      { error: `Daily token limit reached (${limit.toLocaleString()} tokens/day). Upgrade your plan for more.`, limitReached: true },
      { status: 429 }
    )
  }

  const { messages, toolType } = await req.json()

  const systemPrompts: Record<string, string> = {
    code_generator: `You are an expert web developer specializing in HTML, CSS, and JavaScript.

IMPORTANT RULES:
1. If the user has NOT specified whether they want plain CSS or Tailwind CSS, you MUST ask them first before generating any code. Example: "Would you like me to build this with plain CSS or Tailwind CSS?"
2. If the user HAS specified (e.g., "use tailwind" or "plain css" or "with tailwind css"), proceed with their preference.
3. For the first message, if it's just a description without CSS preference, ask about it.

When generating code:
- Always wrap code in markdown code blocks with html tag
- For plain CSS: use modern CSS (flexbox, grid, custom properties, etc.)
- For Tailwind CSS: use Tailwind utility classes, include the CDN script tag
- Make designs responsive and visually appealing
- Use clean JavaScript when needed
- When the user asks for changes, provide the COMPLETE updated code
- Always include all necessary code - never provide partial updates`,
    resume_builder: `You are a professional resume writer and HTML/CSS expert. Create beautiful, ATS-friendly resumes using Tailwind CSS.

IMPORTANT RULES:
1. Always use Tailwind CSS CDN (script tag) for styling
2. Generate a complete, self-contained HTML file with inline Tailwind classes
3. Make the design modern, clean, and professional
4. Include proper sections: Header (name, contact, links), Professional Summary, Work Experience, Education, Skills, Projects if relevant
5. Use appropriate typography, spacing, and visual hierarchy
6. Make it printer-friendly with proper page breaks
7. When the user asks for changes, provide the COMPLETE updated resume HTML
8. Always wrap your HTML output in a markdown code block with html tag
9. The resume should look like a real professional document, not a basic text layout

The HTML should include:
- Tailwind CSS CDN script tag
- Proper meta tags
- Clean semantic HTML
- Responsive design that prints well`,
  }

  const defaultPrompt = "You are Aria, a helpful AI assistant. Respond naturally and concisely."

  const body = JSON.stringify({
    model: "deepseek/deepseek-chat",
    messages: [
      { role: "system", content: systemPrompts[toolType] || defaultPrompt },
      ...messages,
    ],
    stream: true,
    max_tokens: Math.min(4096, remaining),
  })

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.MIMO_API_KEY}`,
    },
    body,
  })

  if (!res.ok) {
    const err = await res.text()
    return Response.json({ error: `OpenRouter error (${res.status}): ${err}` }, { status: res.status })
  }

  const reader = res.body?.getReader()
  if (!reader) {
    return Response.json({ error: "No response body" }, { status: 500 })
  }

  const encoder = new TextEncoder()
  let totalTokens = 0

  const stream = new ReadableStream({
    async start(controller) {
      const decoder = new TextDecoder()
      let buffer = ""

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") continue
              try {
                const parsed = JSON.parse(data)
                const usage = parsed.usage
                if (usage) {
                  totalTokens = usage.total_tokens || 0
                }
              } catch {}
              controller.enqueue(encoder.encode(line + "\n"))
            }
          }
        }
      } catch {
      } finally {
        if (totalTokens > 0) {
          await incrementTokenUsage(user.userId, totalTokens)
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
