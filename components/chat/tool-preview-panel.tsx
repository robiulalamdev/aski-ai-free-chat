"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Eye, EyeOff, Download, FileText, Loader2, CheckCircle2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function extractAllCodeBlocks(content: string): string[] {
  const regex = /```(?:html|css|javascript|js)?\s*\n([\s\S]*?)```/g
  const blocks: string[] = []
  let match
  while ((match = regex.exec(content)) !== null) {
    blocks.push(match[1].trim())
  }
  return blocks
}

function extractLatestHtml(content: string): string {
  const blocks = extractAllCodeBlocks(content)
  if (blocks.length > 0) return blocks[blocks.length - 1]

  if (content.includes("<!DOCTYPE html") || content.includes("<html")) {
    const startIdx = content.indexOf("<!DOCTYPE") !== -1 ? content.indexOf("<!DOCTYPE") : content.indexOf("<html")
    if (startIdx !== -1) return content.slice(startIdx)
  }
  return ""
}

function extractCodeBlocks(content: string): string {
  return extractAllCodeBlocks(content).join("\n\n")
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
  const html2pdf = (await import("html2pdf.js")).default

  const container = document.createElement("div")
  container.innerHTML = html
  container.style.position = "absolute"
  container.style.left = "-9999px"
  container.style.top = "0"
  container.style.width = "210mm"
  container.style.background = "white"
  document.body.appendChild(container)

  await new Promise((resolve) => setTimeout(resolve, 500))

  await html2pdf()
    .set({
      margin: 10,
      filename: `${filename}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(container)
    .save()

  document.body.removeChild(container)
}

export function ToolPreviewPanel({
  toolType,
  content,
  isGenerating,
  isOpen,
  onToggle,
}: {
  toolType: string
  content: string
  isGenerating: boolean
  isOpen: boolean
  onToggle: () => void
}) {
  const [exporting, setExporting] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<number>(0)
  const [showVersionMenu, setShowVersionMenu] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const isResume = toolType === "resume_builder"

  // Extract all versions (code blocks)
  const versions = useMemo(() => {
    if (isResume) {
      return extractAllCodeBlocks(content)
    }
    return []
  }, [content, isResume])

  const latestVersion = versions.length
  const currentHtml = isResume
    ? (versions[selectedVersion - 1] || extractLatestHtml(content))
    : extractCodeBlocks(content)
  const hasContent = currentHtml.length > 0

  // Auto-select latest version when new content arrives
  useEffect(() => {
    if (versions.length > 0 && selectedVersion === 0) {
      setSelectedVersion(versions.length)
    } else if (versions.length > selectedVersion) {
      setSelectedVersion(versions.length)
    }
  }, [versions.length, selectedVersion])

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
    a.download = isResume ? "resume.html" : "code.html"
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
    <div className={cn("flex flex-col border-l border-[var(--border-custom)] bg-[var(--background)]", "w-1/2")}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-custom)]">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[var(--foreground)]">
            {isResume ? "Resume Preview" : "Code Preview"}
          </span>

          {/* Version selector for resume */}
          {isResume && versions.length > 0 && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowVersionMenu(!showVersionMenu)}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--surface)] border border-[var(--border-custom)] text-xs text-zinc-400 hover:text-[var(--foreground)] transition-colors"
              >
                v{selectedVersion}
                {selectedVersion === latestVersion && (
                  <span className="text-[10px] px-1 py-0.5 rounded bg-green-600/20 text-green-400 ml-1">latest</span>
                )}
                <ChevronDown className="h-3 w-3" />
              </button>

              {showVersionMenu && (
                <div className="absolute top-full left-0 mt-1 w-40 rounded-lg border border-[var(--border-custom)] bg-[var(--surface)] shadow-xl z-50 py-1">
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
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {isResume && hasContent ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-zinc-400 hover:text-[var(--foreground)] gap-1"
              onClick={handleExportPdf}
              disabled={exporting}
            >
              {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
              PDF
            </Button>
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
            ref={iframeRef}
            srcDoc={currentHtml}
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
