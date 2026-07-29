"use client"

import { useState, useRef } from "react"
import { Eye, EyeOff, Download, FileText, FileImage } from "lucide-react"
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
  if (content.includes("<") && content.includes(">")) {
    return content
  }
  return ""
}

function extractResumeHtml(content: string): string {
  const htmlMatch = content.match(/```html\s*\n([\s\S]*?)```/)
  if (htmlMatch) return htmlMatch[1]

  const codeMatch = content.match(/```\s*\n([\s\S]*?)```/)
  if (codeMatch) return codeMatch[1]

  if (content.includes("<html") || content.includes("<div") || content.includes("<section")) {
    return content
  }

  return ""
}

async function exportToPdf(html: string, filename: string) {
  const html2pdf = (await import("html2pdf.js")).default
  const container = document.createElement("div")
  container.innerHTML = html
  container.style.position = "fixed"
  container.style.left = "-9999px"
  container.style.top = "0"
  container.style.width = "210mm"
  document.body.appendChild(container)

  await html2pdf()
    .set({
      margin: 0,
      filename: `${filename}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
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

  const processElement = (el: Element, indent = 0) => {
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
    } else if (tag === "p" || tag === "li" || tag === "span") {
      if (el.children.length > 0) {
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
                italics: childEl.tagName === "EM" || childEl.tagName === "I",
                size: 20,
                font: "Calibri",
              }))
            }
          }
        })
        if (runs.length > 0) {
          paragraphs.push(new docx.Paragraph({
            children: runs,
            spacing: { after: 80 },
          }))
        }
      } else if (text) {
        paragraphs.push(new docx.Paragraph({
          children: [new docx.TextRun({ text, size: 20, font: "Calibri" })],
          spacing: { after: 80 },
        }))
      }
    }
  }

  const allElements = tempDiv.querySelectorAll("h1, h2, h3, h4, p, li, span, div, section")
  allElements.forEach((el) => processElement(el))

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
  isOpen,
  onToggle,
}: {
  toolType: string
  content: string
  isOpen: boolean
  onToggle: () => void
}) {
  const [exporting, setExporting] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const isResume = toolType === "resume_builder"
  const code = isResume ? extractResumeHtml(content) : extractCodeBlocks(content)

  const handleExportPdf = async () => {
    if (!code) return
    setExporting(true)
    try {
      await exportToPdf(code, "resume")
    } catch (err) {
      console.error("PDF export failed:", err)
    } finally {
      setExporting(false)
    }
  }

  const handleExportDoc = async () => {
    if (!code) return
    setExporting(true)
    try {
      await exportToDoc(code, "resume")
    } catch (err) {
      console.error("DOC export failed:", err)
    } finally {
      setExporting(false)
    }
  }

  const handleDownloadHtml = () => {
    if (!code) return
    const blob = new Blob([code], { type: "text/html" })
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
    <div className={cn("flex flex-col border-l border-[var(--border-custom)] bg-[var(--background)]", isResume ? "w-1/2" : "w-1/2")}>
      {/* Header with actions */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-custom)]">
        <span className="text-sm font-medium text-[var(--foreground)]">
          {isResume ? "Resume Preview" : "Code Preview"}
        </span>
        <div className="flex items-center gap-1">
          {isResume && code ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-zinc-400 hover:text-[var(--foreground)] gap-1"
                onClick={handleExportPdf}
                disabled={exporting}
              >
                <FileImage className="h-3.5 w-3.5" />
                PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-zinc-400 hover:text-[var(--foreground)] gap-1"
                onClick={handleExportDoc}
                disabled={exporting}
              >
                <FileText className="h-3.5 w-3.5" />
                DOC
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-400 hover:text-[var(--foreground)]"
              onClick={handleDownloadHtml}
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
          )}
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

      {/* Preview area */}
      <div className="flex-1 overflow-auto bg-white">
        {code ? (
          <iframe
            ref={iframeRef}
            srcDoc={code}
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-scripts"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-zinc-500">
            {isResume ? "Start describing your experience to build your resume..." : "Start chatting to see preview..."}
          </div>
        )}
      </div>
    </div>
  )
}
