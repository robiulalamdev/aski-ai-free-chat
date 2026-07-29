import { NextRequest } from "next/server"
import env from "@/config/env"

const OPENROUTER_BASE = "https://openrouter.ai/api/v1"

export async function POST(req: NextRequest) {
  if (!env.MIMO_API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 })
  }

  const { messages } = await req.json()

  const body = JSON.stringify({
    model: "deepseek/deepseek-chat",
    messages: [
      { role: "system", content: "You are FreeAI, a helpful AI assistant. Respond naturally and concisely." },
      ...messages,
    ],
    stream: true,
    max_tokens: 4096,
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
              controller.enqueue(encoder.encode(line + "\n"))
            }
          }
        }
      } catch {
      } finally {
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
