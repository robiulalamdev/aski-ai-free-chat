import type { AIStatus } from "@/types/ai"

type ProgressCallback = (status: AIStatus, text: string) => void

class AIRuntimeService {
  private status: AIStatus = "idle"
  private listeners: Set<ProgressCallback> = new Set()
  private abortController: AbortController | null = null

  subscribe(callback: ProgressCallback): () => void {
    this.listeners.add(callback)
    return () => { this.listeners.delete(callback) }
  }

  private notify(text: string) {
    this.listeners.forEach((cb) => cb(this.status, text))
  }

  cancel() {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }

  async processMessage(
    messages: { role: string; content: string }[],
    onToken?: (token: string) => void,
    toolType?: string | null
  ): Promise<string> {
    this.abortController = new AbortController()

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        toolType: toolType || undefined,
      }),
      signal: this.abortController.signal,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown error" }))
      throw new Error(err.error || `Server error (${res.status})`)
    }

    const reader = res.body?.getReader()
    if (!reader) throw new Error("No response body")

    const decoder = new TextDecoder()
    let fullText = ""
    let buffer = ""

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
            const content = parsed.choices?.[0]?.delta?.content || ""
            if (content) {
              fullText += content
              if (onToken) onToken(content)
            }
          } catch {}
        }
      }
    }

    this.abortController = null
    return fullText
  }

  getStatus() {
    return this.status
  }
}

export const aiRuntime = new AIRuntimeService()