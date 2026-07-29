import { NextRequest } from "next/server"
import env from "@/config/env"
import { verifyAccessToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const OPENROUTER_BASE = "https://openrouter.ai/api/v1"

const SYSTEM_PROMPT = `You are an expert web developer. Generate clean, modern HTML/CSS/JS code.

Rules:
- Always return complete, runnable code
- Use semantic HTML5
- Use modern CSS (flexbox, grid, variables)
- Use vanilla JavaScript (no frameworks unless specifically requested)
- Make designs responsive and mobile-friendly
- Use a clean, modern design style
- Include proper meta tags and viewport settings
- Use CSS variables for colors and spacing

When generating code, ALWAYS return it in this exact format:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Name</title>
  <style>
    /* All CSS here */
  </style>
</head>
<body>
  <!-- HTML content here -->
  <script>
    // All JavaScript here
  </script>
</body>
</html>
\`\`\`

Return ONLY the code block. No explanations, no extra text.`

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

  const hasAccess = await checkToolAccess(user.userId, "code_generator")
  if (!hasAccess) {
    return Response.json({ error: "This tool requires a Pro plan" }, { status: 403 })
  }

  if (!env.MIMO_API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 })
  }

  const { prompt } = await req.json()
  if (!prompt) {
    return Response.json({ error: "Prompt is required" }, { status: 400 })
  }

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.MIMO_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      stream: true,
      max_tokens: 4096,
    }),
  })

  if (!res.ok) {
    return Response.json({ error: "AI request failed" }, { status: 500 })
  }

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const stream = new ReadableStream({
    async start(controller) {
      let fullContent = ""
      const reader = res.body?.getReader()
      if (!reader) {
        controller.close()
        return
      }

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") continue
              try {
                const json = JSON.parse(data)
                const content = json.choices?.[0]?.delta?.content
                if (content) {
                  fullContent += content
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                }
              } catch {}
            }
          }
        }

        // Extract code blocks from the response
        const codeMatch = fullContent.match(/```html\s*([\s\S]*?)```/) || fullContent.match(/```\s*([\s\S]*?)```/)
        const code = codeMatch ? codeMatch[1].trim() : fullContent

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, code })}\n\n`))
      } catch (error) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`))
      } finally {
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
