"use client"

import { useState, useRef, useCallback } from "react"
import { Send, Loader2, Download, Copy, Check, Eye, Code } from "lucide-react"
import { ToolLayout } from "@/components/tools/tool-layout"
import { FEATURES } from "@/lib/features"

export default function CodeGeneratorPage() {
  const [prompt, setPrompt] = useState("")
  const [code, setCode] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview")
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleGenerate = useCallback(async () => {
    const trimmed = prompt.trim()
    if (!trimmed || isGenerating) return

    setIsGenerating(true)
    setCode("")

    try {
      const res = await fetch("/api/tools/code-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.error || "Failed to generate code")
        setIsGenerating(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) return

      const decoder = new TextDecoder()
      let fullCode = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.content) {
                fullCode += data.content
                setCode(fullCode)
              }
              if (data.done && data.code) {
                setCode(data.code)
              }
              if (data.error) {
                alert(data.error)
              }
            } catch {}
          }
        }
      }
    } finally {
      setIsGenerating(false)
    }
  }, [prompt, isGenerating])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadZip = async () => {
    if (!code) return
    const JSZip = (await import("jszip")).default
    const { saveAs } = await import("file-saver")

    const zip = new JSZip()
    zip.file("index.html", code)
    const blob = await zip.generateAsync({ type: "blob" })
    saveAs(blob, "project.zip")
  }

  const previewHtml = code
    ? `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body>${code.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || code}<style>${code.match(/<style[^>]*>([\s\S]*?)<\/style>/gi)?.map(s => s.replace(/<\/?style[^>]*>/g, "")).join("\n") || ""}</style><script>${code.match(/<script[^>]*>([\s\S]*?)<\/script>/gi)?.map(s => s.replace(/<\/?script[^>]*>/g, "")).join("\n") || ""}</script></body></html>`
    : ""

  return (
    <ToolLayout
      toolName="Code Generator"
      toolSlug="code-generator"
      featureSlug={FEATURES.CODE_GENERATOR}
    >
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Input + Code */}
        <div className="flex flex-col w-1/2 border-r border-[var(--border-custom)]">
          {/* Input */}
          <div className="border-b border-[var(--border-custom)] p-4">
            <div className="flex gap-2">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe what you want to build... (e.g., 'Create a landing page with hero section and pricing cards')"
                rows={2}
                className="flex-1 resize-none rounded-xl border border-[var(--border-custom)] bg-[var(--surface)] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
                disabled={isGenerating}
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:brightness-110 disabled:opacity-40"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Code + Tabs */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center gap-1 border-b border-[var(--border-custom)] px-4">
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === "code" ? "text-white border-b-2 border-emerald-500" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Code className="h-3.5 w-3.5" />
                Code
              </button>
              <div className="flex-1" />
              {code && (
                <div className="flex items-center gap-1 py-2">
                  <button onClick={copyCode} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-[var(--surface-light)] transition-colors">
                    {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button onClick={downloadZip} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-[var(--surface-light)] transition-colors">
                    <Download className="h-3 w-3" />
                    ZIP
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-auto bg-[var(--sidebar-bg)] p-4">
              {code ? (
                <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-mono">{code}</pre>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-zinc-600">
                  {isGenerating ? "Generating code..." : "Generated code will appear here"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="flex flex-col w-1/2">
          <div className="flex items-center gap-1 border-b border-[var(--border-custom)] px-4">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
                activeTab === "preview" ? "text-white border-b-2 border-emerald-500" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>
          </div>
          <div className="flex-1 bg-white">
            {code ? (
              <iframe
                srcDoc={previewHtml}
                className="h-full w-full border-0"
                sandbox="allow-scripts"
                title="Preview"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                Live preview will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
