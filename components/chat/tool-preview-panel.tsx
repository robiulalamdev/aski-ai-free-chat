"use client"

import { useState, useEffect, useRef } from "react"
import { Eye, EyeOff, Download, FileText, FileImage, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function extractHtmlFromResponse(content: string): string {
  // Try markdown code block first
  const htmlBlockRegex = /```html\s*\n([\s\S]*?)```/
  const htmlMatch = content.match(htmlBlockRegex)
  if (htmlMatch) return htmlMatch[1].trim()

  // Try generic code block
  const codeBlockRegex = /```\s*\n([\s\S]*?)```/
  const codeMatch = content.match(codeBlockRegex)
  if (codeMatch) {
    const inner = codeMatch[1].trim()
    if (inner.includes("<html") || inner.includes("<!DOCTYPE") || inner.includes("<div")) {
      return inner
    }
  }

  // Try to find raw HTML (doctype, html tag, or substantial HTML)
  if (content.includes("<!DOCTYPE html") || content.includes("<html")) {
    const startIdx = content.indexOf("<!DOCTYPE") !== -1 ? content.indexOf("<!DOCTYPE") : content.indexOf("<html")
    if (startIdx !== -1) return content.slice(startIdx)
  }

  return ""
}

function extractCodeBlocks(content: string): string {
  const codeBlockRegex = /```(?:html|css|javascript|js)?\s*\n([\s\S]*?)```/g
  const matches: string[] = []
  let match
  while ((match = codeBlockRegex.exec(content)) !== null) {
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

async function exportToDoc(html: string, filename: string) {
  const docx = await import("docx")
  const { saveAs } = await import("file-saver")

  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = html

  const paragraphs: InstanceType<typeof docx.Paragraph>[] = []

  const processElement = (el: Element) => {
    const tag = el.tagName?.toLowerCase()
    const text = el.textContent?.trim() || ""
    if (!text) return

    if (tag === "h1") {
      paragraphs.push(new docx.Paragraph({
        children: [new docx.TextRun({ text, bold: true, size: 32, font: "Calibri" })],
        heading: docx.HeadingLevel.HEADING_1,
        alignment: docx.AlignmentType.CENTER,
        spacing: { after: 200 },
      }))
    } else if (tag === "h2") {
      paragraphs.push(new docx.Paragraph({
        children: [new docx.TextRun({ text, bold: true, size: 24, font: "Calibri" })],
        heading: docx.HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }))
    } else if (tag === "h3" || tag === "h4") {
      paragraphs.push(new docx.Paragraph({
        children: [new docx.TextRun({ text, bold: true, size: 22, font: "Calibri" })],
        spacing: { before: 100, after: 50 },
      }))
    } else if (tag === "p" || tag === "li") {
      const runs: InstanceType<typeof docx.TextRun>[] = []
      el.childNodes.forEach((child) => {
        if (child.nodeType === 3) {
          const t = child.textContent?.trim()
          if (t) runs.push(new docx.TextRun({ text: t, size: 20, font: "Calibri" }))
        } else if (child.nodeType === 1) {
          const childEl = child as Element
          const t = childEl.textContent?.trim()
          if (t) {
            runs.push(new docx.TextRun({
              text: t,
              bold: childEl.tagName === "STRONG" || childEl.tagName === "B",
              size: 20,
              font: "Calibri",
            }))
          }
        }
      })
      if (runs.length > 0) {
        paragraphs.push(new docx.Paragraph({ children: runs, spacing: { after: 80 } }))
      }
    }
  }

  tempDiv.querySelectorAll("h1, h2, h3, h4, p, li").forEach(processElement)

  if (paragraphs.length === 0) {
    paragraphs.push(new docx.Paragraph({
      children: [new docx.TextRun({ text: tempDiv.textContent || "Resume", size: 20, font: "Calibri" })],
    }))
  }

  const doc = new docx.Document({
    sections: [{ properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } }, children: paragraphs }],
  })

  const blob = await docx.Packer.toBlob(doc)
  saveAs(blob, `${filename}.docx`)
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
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const isResume = toolType === "resume_builder"
  const html = isResume ? extractHtmlFromResponse(content) : extractCodeBlocks(content)
  const hasContent = html.length > 0

  // Debug: log extracted HTML
  useEffect(() => {
    if (isResume && content) {
      console.log("[Resume Preview] Content length:", content.length)
      console.log("[Resume Preview] Extracted HTML length:", html.length)
      console.log("[Resume Preview] HTML preview:", html.slice(0, 200))
    }
  }, [content, html, isResume])

  const handleExportPdf = async () => {
    if (!html) return
    setExporting(true)
    try {
      await exportToPdf(html, "resume")
    } catch (err) {
      console.error("PDF export failed:", err)
    } finally {
      setExporting(false)
    }
  }

  const handleExportDoc = async () => {
    if (!html) return
    setExporting(true)
    try {
      await exportToDoc(html, "resume")
    } catch (err) {
      console.error("DOC export failed:", err)
    } finally {
      setExporting(false)
    }
  }

  const handleDownloadHtml = () => {
    if (!html) return
    const blob = new Blob([html], { type: "text/html" })
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
        <span className="text-sm font-medium text-[var(--foreground)]">
          {isResume ? "Resume Preview" : "Code Preview"}
        </span>
        <div className="flex items-center gap-1">
          {isResume && hasContent ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-zinc-400 hover:text-[var(--foreground)] gap-1"
                onClick={handleExportPdf}
                disabled={exporting}
              >
                {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileImage className="h-3.5 w-3.5" />}
                PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-zinc-400 hover:text-[var(--foreground)] gap-1"
                onClick={handleExportDoc}
                disabled={exporting}
              >
                {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                DOC
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
            ref={iframeRef}
            srcDoc={html}
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
