"use client"

import { useState } from "react"
import { Download, FileText, FileJson, Check } from "lucide-react"
import type { Conversation } from "@/types/chat"

function formatMarkdown(conv: Conversation): string {
  let md = `# ${conv.title}\n\n`
  md += `*Created: ${new Date(conv.createdAt).toLocaleString()}*\n\n---\n\n`
  for (const msg of conv.messages) {
    const role = msg.role === "user" ? "**You**" : "**Aria**"
    const time = new Date(msg.createdAt).toLocaleTimeString()
    md += `### ${role} *(${time})*\n\n${msg.content}\n\n---\n\n`
  }
  return md
}

function formatJSON(conv: Conversation): string {
  return JSON.stringify({
    title: conv.title,
    createdAt: new Date(conv.createdAt).toISOString(),
    messages: conv.messages.map((m) => ({
      role: m.role,
      content: m.content,
      timestamp: new Date(m.createdAt).toISOString(),
    })),
  }, null, 2)
}

function formatText(conv: Conversation): string {
  let txt = `${conv.title}\n${"=".repeat(conv.title.length)}\n\n`
  for (const msg of conv.messages) {
    const role = msg.role === "user" ? "You" : "Aria"
    const time = new Date(msg.createdAt).toLocaleTimeString()
    txt += `[${time}] ${role}:\n${msg.content}\n\n`
  }
  return txt
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function ExportChat({ conversations }: { conversations: Conversation[] }) {
  const [exported, setExported] = useState<string | null>(null)

  const handleExport = (format: "markdown" | "json" | "text") => {
    if (conversations.length === 0) return

    const timestamp = new Date().toISOString().slice(0, 10)

    if (conversations.length === 1) {
      const conv = conversations[0]
      const ext = format === "markdown" ? "md" : format === "json" ? "json" : "txt"
      const content = format === "markdown" ? formatMarkdown(conv) : format === "json" ? formatJSON(conv) : formatText(conv)
      downloadFile(content, `nexachat-${conv.title.slice(0, 30)}.${ext}`, `text/${format === "json" ? "json" : "plain"}`)
    } else {
      const allConvs = conversations.map((c) => ({
        title: c.title,
        createdAt: new Date(c.createdAt).toISOString(),
        messages: c.messages.map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: new Date(m.createdAt).toISOString(),
        })),
      }))

      if (format === "json") {
        downloadFile(JSON.stringify(allConvs, null, 2), `nexachat-export-${timestamp}.json`, "application/json")
      } else {
        const content = allConvs.map((c) => {
          if (format === "markdown") {
            return formatMarkdown(c as unknown as Conversation)
          }
          return formatText(c as unknown as Conversation)
        }).join("\n\n")
        const ext = format === "markdown" ? "md" : "txt"
        downloadFile(content, `nexachat-export-${timestamp}.${ext}`, "text/plain")
      }
    }

    setExported(format)
    setTimeout(() => setExported(null), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleExport("markdown")}
        className="flex items-center gap-1.5 rounded-lg border border-[var(--border-custom)] px-3 py-1.5 text-xs font-medium text-zinc-400 hover:bg-[var(--surface-light)] transition-colors"
        title="Export as Markdown"
      >
        {exported === "markdown" ? <Check className="h-3 w-3 text-green-400" /> : <FileText className="h-3 w-3" />}
        MD
      </button>
      <button
        onClick={() => handleExport("json")}
        className="flex items-center gap-1.5 rounded-lg border border-[var(--border-custom)] px-3 py-1.5 text-xs font-medium text-zinc-400 hover:bg-[var(--surface-light)] transition-colors"
        title="Export as JSON"
      >
        {exported === "json" ? <Check className="h-3 w-3 text-green-400" /> : <FileJson className="h-3 w-3" />}
        JSON
      </button>
      <button
        onClick={() => handleExport("text")}
        className="flex items-center gap-1.5 rounded-lg border border-[var(--border-custom)] px-3 py-1.5 text-xs font-medium text-zinc-400 hover:bg-[var(--surface-light)] transition-colors"
        title="Export as Text"
      >
        {exported === "text" ? <Check className="h-3 w-3 text-green-400" /> : <Download className="h-3 w-3" />}
        TXT
      </button>
    </div>
  )
}
