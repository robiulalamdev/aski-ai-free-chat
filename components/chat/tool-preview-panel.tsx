"use client"

import { useState } from "react"
import { Eye, EyeOff, Download, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function extractCodeBlocks(content: string): string {
  const codeBlockRegex = /```(?:html|css|javascript|js)?\s*\n([\s\S]*?)```/g
  const matches: string[] = []
  let match
  while ((match = codeBlockRegex.exec(content)) !== null) {
    matches.push(match[1].trim())
  }
  if (matches.length > 0) {
    return matches.join("\n\n")
  }
  // If no code blocks, try to find HTML-like content
  if (content.includes("<") && content.includes(">")) {
    return content
  }
  return ""
}

function extractResumeFromAI(content: string): string {
  // Try to find HTML content in AI response
  const htmlMatch = content.match(/```html\s*\n([\s\S]*?)```/)
  if (htmlMatch) return htmlMatch[1]

  const codeMatch = content.match(/```\s*\n([\s\S]*?)```/)
  if (codeMatch) return codeMatch[1]

  // If response contains HTML tags, use as-is
  if (content.includes("<html") || content.includes("<div") || content.includes("<section")) {
    return content
  }

  // Generate a basic resume template from the AI content
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px; }
    .resume { max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #2d3748; border-bottom: 2px solid #4a5568; padding-bottom: 10px; margin-bottom: 20px; }
    h2 { color: #4a5568; margin: 20px 0 10px; font-size: 1.1em; text-transform: uppercase; letter-spacing: 1px; }
    .contact { display: flex; gap: 20px; margin-bottom: 20px; color: #718096; font-size: 0.9em; }
    .section { margin-bottom: 20px; }
    .section p { color: #4a5568; line-height: 1.6; }
    ul { padding-left: 20px; color: #4a5568; }
    li { margin-bottom: 5px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="resume">
    <h1>Your Name</h1>
    <div class="contact">
      <span>📧 email@example.com</span>
      <span>📱 (555) 123-4567</span>
      <span>📍 City, State</span>
    </div>
    <div class="section">
      <h2>Summary</h2>
      <p>${content.replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 500)}</p>
    </div>
  </div>
</body>
</html>`
}

export function ToolPreviewPanel({
  toolType,
  content,
  isOpen,
  onToggle,
}: {
  toolType: string
  content: string
  isOpen: boolean
  onToggle: () => void
}) {
  const [copied, setCopied] = useState(false)

  const code = toolType === "code_generator"
    ? extractCodeBlocks(content)
    : extractResumeFromAI(content)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const ext = toolType === "code_generator" ? "html" : "html"
    const blob = new Blob([code], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${toolType === "code_generator" ? "code" : "resume"}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 m-2 rounded-lg bg-[var(--surface)] border border-[var(--border-custom)] text-sm text-zinc-400 hover:text-[var(--foreground)] transition-colors"
      >
        <Eye className="h-4 w-4" />
        Show Preview
      </button>
    )
  }

  return (
    <div className="flex flex-col w-1/2 border-l border-[var(--border-custom)] bg-[var(--background)]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-custom)]">
        <span className="text-sm font-medium text-[var(--foreground)]">
          {toolType === "code_generator" ? "Code Preview" : "Resume Preview"}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-[var(--foreground)]"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-[var(--foreground)]"
            onClick={handleDownload}
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-[var(--foreground)]"
            onClick={onToggle}
          >
            <EyeOff className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-white">
        {code ? (
          <iframe
            srcDoc={code}
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-scripts"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-zinc-500">
            Start chatting to see preview...
          </div>
        )}
      </div>
    </div>
  )
}
