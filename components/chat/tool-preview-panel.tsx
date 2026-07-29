"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Eye, EyeOff, Download, FileText, Loader2, CheckCircle2, ChevronDown, Printer, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Message } from "@/types/chat"

function extractHtmlFromText(text: string): string {
  const regex = /```html\s*\n([\s\S]*?)```/
  const match = text.match(regex)
  if (match) return match[1].trim()

  const codeRegex = /```\s*\n([\s\S]*?)```/
  const codeMatch = text.match(codeRegex)
  if (codeMatch) {
    const inner = codeMatch[1].trim()
    if (inner.includes("<!DOCTYPE") || inner.includes("<html") || inner.includes("<div")) {
      return inner
    }
  }

  if (text.includes("<!DOCTYPE html") || text.includes("<html")) {
    const startIdx = text.indexOf("<!DOCTYPE") !== -1 ? text.indexOf("<!DOCTYPE") : text.indexOf("<html")
    if (startIdx !== -1) return text.slice(startIdx)
  }

  return ""
}

function extractCodeBlocks(text: string): string {
  const regex = /```(?:html|css|javascript|js)?\s*\n([\s\S]*?)```/g
  const matches: string[] = []
  let match
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1].trim())
  }
  if (matches.length > 0) return matches.join("\n\n")
  return ""
}

function ResumeGeneratingUI() {
  const [step, setStep] = useState(0)
  const steps = [
    "Analyzing your information...",
    "Building resume structure...",
    "Designing layout...",
    "Adding professional styling...",
    "Finalizing your resume...",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
    }, 1200)
    return () => clearInterval(timer)
  }, [steps.length])

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-[var(--background)] to-[var(--surface)]">
      <div className="relative mb-6">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center animate-pulse">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <Loader2 className="absolute -bottom-1 -right-1 h-5 w-5 text-violet-400 animate-spin" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Building Your Resume</h3>
      <div className="space-y-2 mt-4">
        {steps.map((s, i) => (
          <div key={i} className={cn("flex items-center gap-2 text-sm transition-all duration-300", i <= step ? "text-[var(--foreground)]" : "text-zinc-600")}>
            {i < step ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : i === step ? (
              <Loader2 className="h-4 w-4 text-violet-400 animate-spin" />
            ) : (
              <div className="h-4 w-4 rounded-full border border-zinc-700" />
            )}
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CodeGeneratingUI() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative mb-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center animate-pulse">
          <Loader2 className="h-6 w-6 text-white animate-spin" />
        </div>
      </div>
      <p className="text-sm text-zinc-400">Generating code...</p>
    </div>
  )
}

async function exportToPdf(html: string, filename: string) {
  // Open in new window and use browser print
  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    alert("Please allow popups to export PDF")
    return
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${filename}</title>
      <script src="https://cdn.tailwindcss.com"><\/script>
      <style>
        @media print {
          body { margin: 0; }
          @page { margin: 10mm; }
        }
      </style>
    </head>
    <body>
      ${html}
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 1000);
        };
      <\/script>
    </body>
    </html>
  `)
  printWindow.document.close()
}

export function ToolPreviewPanel({
  toolType,
  messages,
  streamingText,
  isGenerating,
  isOpen,
  onToggle,
}: {
  toolType: string
  messages: Message[]
  streamingText?: string
  isGenerating: boolean
  isOpen: boolean
  onToggle: () => void
}) {
  const [exporting, setExporting] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState(0)
  const [showVersionMenu, setShowVersionMenu] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const isResume = toolType === "resume_builder"

  // Extract versions from ALL assistant messages
  const versions = useMemo(() => {
    const assistantMessages = messages.filter((m) => m.role === "assistant")
    const versionList: { html: string; messageIndex: number }[] = []

    assistantMessages.forEach((msg, idx) => {
      const html = isResume ? extractHtmlFromText(msg.content) : extractCodeBlocks(msg.content)
      if (html) {
        versionList.push({ html, messageIndex: idx })
      }
    })

    return versionList
  }, [messages, isResume])

  // Current streaming HTML
  const streamingHtml = useMemo(() => {
    if (!streamingText) return ""
    return isResume ? extractHtmlFromText(streamingText) : extractCodeBlocks(streamingText)
  }, [streamingText, isResume])

  const latestVersion = versions.length
  const hasStreamedVersion = streamingHtml.length > 0

  // Current displayed HTML
  const currentHtml = useMemo(() => {
    if (isGenerating && streamingHtml) return streamingHtml
    if (versions.length > 0 && selectedVersion > 0) {
      return versions[selectedVersion - 1]?.html || ""
    }
    if (versions.length > 0) {
      return versions[versions.length - 1]?.html || ""
    }
    return ""
  }, [isGenerating, streamingHtml, versions, selectedVersion])

  const hasContent = currentHtml.length > 0

  // Auto-select latest only on first version or when a NEW version is added
  const prevVersionCount = useRef(versions.length)
  useEffect(() => {
    if (versions.length > prevVersionCount.current) {
      // New version added - auto-select it
      setSelectedVersion(versions.length)
    }
    prevVersionCount.current = versions.length
  }, [versions.length])

  // Close version menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowVersionMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleExportPdf = async () => {
    if (!currentHtml) return
    setExporting(true)
    try {
      await exportToPdf(currentHtml, "resume")
    } catch (err) {
      console.error("PDF export failed:", err)
    } finally {
      setExporting(false)
    }
  }

  const handleDownloadHtml = () => {
    if (!currentHtml) return
    const blob = new Blob([currentHtml], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "resume.html"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleViewFull = () => {
    if (!currentHtml) return
    const win = window.open("", "_blank")
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script><title>Resume</title></head><body>${currentHtml}</body></html>`)
    win.document.close()
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
    <div className={cn("flex flex-col border-l border-[var(--border-custom)] bg-[var(--background)]", "w-1/2")}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-custom)]">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[var(--foreground)]">
            {isResume ? "Resume Preview" : "Code Preview"}
          </span>

          {/* Version selector */}
          {isResume && (versions.length > 0 || hasStreamedVersion) && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowVersionMenu(!showVersionMenu)}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--surface)] border border-[var(--border-custom)] text-xs text-zinc-400 hover:text-[var(--foreground)] transition-colors"
              >
                {isGenerating && hasStreamedVersion ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    building...
                  </span>
                ) : (
                  <>
                    v{selectedVersion}
                    {selectedVersion === latestVersion && latestVersion > 0 && (
                      <span className="text-[10px] px-1 py-0.5 rounded bg-green-600/20 text-green-400 ml-1">latest</span>
                    )}
                  </>
                )}
                <ChevronDown className="h-3 w-3" />
              </button>

              {showVersionMenu && (
                <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-[var(--border-custom)] bg-[var(--surface)] shadow-xl z-50 py-1 max-h-60 overflow-y-auto">
                  {/* Show streaming version if generating */}
                  {isGenerating && hasStreamedVersion && (
                    <button
                      onClick={() => {
                        setShowVersionMenu(false)
                      }}
                      className="flex items-center w-full px-3 py-2 text-xs text-zinc-400 hover:bg-[var(--surface-light)] hover:text-[var(--foreground)] transition-colors"
                    >
                      <Loader2 className="h-3 w-3 animate-spin mr-2" />
                      <span>Building new version...</span>
                    </button>
                  )}

                  {/* Show saved versions (newest first) */}
                  {[...versions].reverse().map((_, idx) => {
                    const versionNum = versions.length - idx
                    return (
                      <button
                        key={versionNum}
                        onClick={() => {
                          setSelectedVersion(versionNum)
                          setShowVersionMenu(false)
                        }}
                        className={cn(
                          "flex items-center w-full px-3 py-2 text-xs transition-colors",
                          selectedVersion === versionNum
                            ? "bg-violet-600/10 text-violet-400"
                            : "text-zinc-400 hover:bg-[var(--surface-light)] hover:text-[var(--foreground)]"
                        )}
                      >
                        <span>Version {versionNum}</span>
                        {versionNum === latestVersion && (
                          <span className="ml-auto text-[10px] px-1 py-0.5 rounded bg-green-600/20 text-green-400">latest</span>
                        )}
                      </button>
                    )
                  })}

                  {versions.length === 0 && !isGenerating && (
                    <div className="px-3 py-2 text-xs text-zinc-600">No versions yet</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {isResume && hasContent ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-zinc-400 hover:text-[var(--foreground)] gap-1"
                onClick={handleViewFull}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-zinc-400 hover:text-[var(--foreground)] gap-1"
                onClick={handleExportPdf}
                disabled={exporting}
              >
                {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Printer className="h-3.5 w-3.5" />}
                PDF
              </Button>
            </>
          ) : hasContent ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-400 hover:text-[var(--foreground)]"
              onClick={handleDownloadHtml}
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
          ) : null}
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

      {/* Preview content */}
      <div className="flex-1 overflow-auto bg-white">
        {isGenerating && !hasContent ? (
          isResume ? <ResumeGeneratingUI /> : <CodeGeneratingUI />
        ) : hasContent ? (
          <iframe
            key={`${selectedVersion}-${currentHtml.slice(0, 50)}`}
            ref={iframeRef}
            srcDoc={`<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script></head><body>${currentHtml.includes("<body") ? "" : currentHtml}</body></html>`}
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-scripts"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-zinc-500">
            {isResume ? "Describe your experience to build your resume..." : "Describe what you want to build..."}
          </div>
        )}
      </div>
    </div>
  )
}
