"use client"

import { useState } from "react"
import { Wand2, Download, FileText, Loader2 } from "lucide-react"
import { ToolLayout } from "@/components/tools/tool-layout"
import { FEATURES } from "@/lib/features"

interface ResumeData {
  fullName: string
  email: string
  phone: string
  location: string
  website: string
  summary: string
  experience: { company: string; role: string; dates: string; description: string }[]
  education: { school: string; degree: string; dates: string }[]
  skills: string[]
}

const emptyResume: ResumeData = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  summary: "",
  experience: [{ company: "", role: "", dates: "", description: "" }],
  education: [{ school: "", degree: "", dates: "" }],
  skills: [],
}

export default function ResumeBuilderPage() {
  const [resume, setResume] = useState<ResumeData>(emptyResume)
  const [skillInput, setSkillInput] = useState("")
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form")

  const updateField = (field: keyof ResumeData, value: string) => {
    setResume((prev) => ({ ...prev, [field]: value }))
  }

  const updateExperience = (index: number, field: keyof ResumeData["experience"][0], value: string) => {
    setResume((prev) => {
      const exp = [...prev.experience]
      exp[index] = { ...exp[index], [field]: value }
      return { ...prev, experience: exp }
    })
  }

  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [...prev.experience, { company: "", role: "", dates: "", description: "" }],
    }))
  }

  const removeExperience = (index: number) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))
  }

  const updateEducation = (index: number, field: keyof ResumeData["education"][0], value: string) => {
    setResume((prev) => {
      const edu = [...prev.education]
      edu[index] = { ...edu[index], [field]: value }
      return { ...prev, education: edu }
    })
  }

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [...prev.education, { school: "", degree: "", dates: "" }],
    }))
  }

  const removeEducation = (index: number) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const addSkill = () => {
    const skill = skillInput.trim()
    if (skill && !resume.skills.includes(skill)) {
      setResume((prev) => ({ ...prev, skills: [...prev.skills, skill] }))
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    setResume((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }))
  }

  const enhanceWithAI = async () => {
    setIsEnhancing(true)
    try {
      const res = await fetch("/api/tools/resume-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enhance", data: resume }),
      })
      if (res.ok) {
        const result = await res.json()
        if (result.enhanced) setResume(result.enhanced)
      }
    } finally {
      setIsEnhancing(false)
    }
  }

  const exportPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default
    const element = document.getElementById("resume-print")
    if (!element) return
    html2pdf().set({ margin: 0.5, filename: `${resume.fullName || "resume"}.pdf`, html2canvas: { scale: 2 }, jsPDF: { unit: "in", format: "letter" } }).from(element).save()
  }

  const exportDOCX = async () => {
    const docx = await import("docx")
    const { saveAs } = await import("file-saver")

    const children: InstanceType<typeof docx.Paragraph>[] = []

    children.push(new docx.Paragraph({ children: [new docx.TextRun({ text: resume.fullName, bold: true, size: 32 })], alignment: docx.AlignmentType.CENTER }))
    children.push(new docx.Paragraph({ children: [new docx.TextRun({ text: `${resume.email} | ${resume.phone} | ${resume.location}`, size: 20 })], alignment: docx.AlignmentType.CENTER }))
    if (resume.website) children.push(new docx.Paragraph({ children: [new docx.TextRun({ text: resume.website, size: 20 })], alignment: docx.AlignmentType.CENTER }))
    children.push(new docx.Paragraph({ text: "" }))

    if (resume.summary) {
      children.push(new docx.Paragraph({ children: [new docx.TextRun({ text: "SUMMARY", bold: true, size: 24 })], heading: docx.HeadingLevel.HEADING_2 }))
      children.push(new docx.Paragraph({ children: [new docx.TextRun({ text: resume.summary, size: 20 })] }))
    }

    if (resume.experience.some((e) => e.company)) {
      children.push(new docx.Paragraph({ children: [new docx.TextRun({ text: "EXPERIENCE", bold: true, size: 24 })], heading: docx.HeadingLevel.HEADING_2 }))
      for (const exp of resume.experience) {
        if (!exp.company) continue
        children.push(new docx.Paragraph({ children: [new docx.TextRun({ text: `${exp.role} at ${exp.company}`, bold: true, size: 20 })] }))
        children.push(new docx.Paragraph({ children: [new docx.TextRun({ text: exp.dates, italics: true, size: 18 })] }))
        children.push(new docx.Paragraph({ children: [new docx.TextRun({ text: exp.description, size: 20 })] }))
      }
    }

    if (resume.education.some((e) => e.school)) {
      children.push(new docx.Paragraph({ children: [new docx.TextRun({ text: "EDUCATION", bold: true, size: 24 })], heading: docx.HeadingLevel.HEADING_2 }))
      for (const edu of resume.education) {
        if (!edu.school) continue
        children.push(new docx.Paragraph({ children: [new docx.TextRun({ text: `${edu.degree} - ${edu.school}`, bold: true, size: 20 })] }))
        children.push(new docx.Paragraph({ children: [new docx.TextRun({ text: edu.dates, italics: true, size: 18 })] }))
      }
    }

    if (resume.skills.length > 0) {
      children.push(new docx.Paragraph({ children: [new docx.TextRun({ text: "SKILLS", bold: true, size: 24 })], heading: docx.HeadingLevel.HEADING_2 }))
      children.push(new docx.Paragraph({ children: [new docx.TextRun({ text: resume.skills.join(", "), size: 20 })] }))
    }

    const doc = new docx.Document({ sections: [{ children }] })
    const blob = await docx.Packer.toBlob(doc)
    saveAs(blob, `${resume.fullName || "resume"}.docx`)
  }

  return (
    <ToolLayout
      toolName="Resume Builder"
      toolSlug="resume-builder"
      featureSlug={FEATURES.RESUME_BUILDER}
    >
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Form */}
        <div className="flex flex-col w-1/2 border-r border-[var(--border-custom)] overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[var(--border-custom)] px-4 py-2">
            <button
              onClick={() => setActiveTab("form")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === "form" ? "bg-[var(--surface-light)] text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Form
            </button>
            <div className="flex-1" />
            <button
              onClick={enhanceWithAI}
              disabled={isEnhancing}
              className="flex items-center gap-1.5 rounded-lg bg-violet-600/10 border border-violet-500/20 px-3 py-1.5 text-xs text-violet-400 hover:bg-violet-600/20 transition-colors disabled:opacity-50"
            >
              {isEnhancing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
              AI Enhance
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Personal Info */}
            <div>
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Personal Info</h3>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Full Name" value={resume.fullName} onChange={(e) => updateField("fullName", e.target.value)} className="rounded-lg border border-[var(--border-custom)] bg-[var(--surface)] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50" />
                <input placeholder="Email" value={resume.email} onChange={(e) => updateField("email", e.target.value)} className="rounded-lg border border-[var(--border-custom)] bg-[var(--surface)] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50" />
                <input placeholder="Phone" value={resume.phone} onChange={(e) => updateField("phone", e.target.value)} className="rounded-lg border border-[var(--border-custom)] bg-[var(--surface)] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50" />
                <input placeholder="Location" value={resume.location} onChange={(e) => updateField("location", e.target.value)} className="rounded-lg border border-[var(--border-custom)] bg-[var(--surface)] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50" />
                <input placeholder="Website (optional)" value={resume.website} onChange={(e) => updateField("website", e.target.value)} className="col-span-2 rounded-lg border border-[var(--border-custom)] bg-[var(--surface)] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50" />
              </div>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Summary</h3>
              <textarea placeholder="Brief professional summary..." value={resume.summary} onChange={(e) => updateField("summary", e.target.value)} rows={3} className="w-full resize-none rounded-lg border border-[var(--border-custom)] bg-[var(--surface)] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50" />
            </div>

            {/* Experience */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Experience</h3>
                <button onClick={addExperience} className="text-xs text-violet-400 hover:text-violet-300">+ Add</button>
              </div>
              {resume.experience.map((exp, i) => (
                <div key={i} className="mb-3 rounded-lg border border-[var(--border-custom)] bg-[var(--surface)] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-600">#{i + 1}</span>
                    {resume.experience.length > 1 && (
                      <button onClick={() => removeExperience(i)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} className="rounded-lg border border-[var(--border-custom)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50" />
                    <input placeholder="Role" value={exp.role} onChange={(e) => updateExperience(i, "role", e.target.value)} className="rounded-lg border border-[var(--border-custom)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50" />
                  </div>
                  <input placeholder="Dates (e.g., Jan 2020 - Present)" value={exp.dates} onChange={(e) => updateExperience(i, "dates", e.target.value)} className="w-full rounded-lg border border-[var(--border-custom)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50" />
                  <textarea placeholder="Key achievements and responsibilities..." value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} rows={2} className="w-full resize-none rounded-lg border border-[var(--border-custom)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50" />
                </div>
              ))}
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Education</h3>
                <button onClick={addEducation} className="text-xs text-violet-400 hover:text-violet-300">+ Add</button>
              </div>
              {resume.education.map((edu, i) => (
                <div key={i} className="mb-3 rounded-lg border border-[var(--border-custom)] bg-[var(--surface)] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-600">#{i + 1}</span>
                    {resume.education.length > 1 && (
                      <button onClick={() => removeEducation(i)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="School" value={edu.school} onChange={(e) => updateEducation(i, "school", e.target.value)} className="rounded-lg border border-[var(--border-custom)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50" />
                    <input placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} className="rounded-lg border border-[var(--border-custom)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50" />
                  </div>
                  <input placeholder="Dates (e.g., Sep 2016 - Jun 2020)" value={edu.dates} onChange={(e) => updateEducation(i, "dates", e.target.value)} className="w-full rounded-lg border border-[var(--border-custom)] bg-[var(--background)] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50" />
                </div>
              ))}
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Skills</h3>
              <div className="flex gap-2 mb-2">
                <input
                  placeholder="Add a skill..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill() } }}
                  className="flex-1 rounded-lg border border-[var(--border-custom)] bg-[var(--surface)] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
                />
                <button onClick={addSkill} className="rounded-lg bg-[var(--surface-light)] px-3 py-2 text-sm text-zinc-400 hover:text-white">Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1 rounded-lg bg-violet-600/10 border border-violet-500/20 px-2.5 py-1 text-xs text-violet-400">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="ml-0.5 text-violet-500 hover:text-violet-300">&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="flex flex-col w-1/2">
          <div className="flex items-center gap-2 border-b border-[var(--border-custom)] px-4 py-2">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === "preview" ? "bg-[var(--surface-light)] text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Preview
            </button>
            <div className="flex-1" />
            <button onClick={exportPDF} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-[var(--surface-light)] transition-colors">
              <Download className="h-3 w-3" />
              PDF
            </button>
            <button onClick={exportDOCX} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-[var(--surface-light)] transition-colors">
              <FileText className="h-3 w-3" />
              DOCX
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-white p-8">
            <div id="resume-print" className="max-w-[600px] mx-auto text-black">
              {resume.fullName && <h1 className="text-2xl font-bold text-center">{resume.fullName}</h1>}
              <p className="text-center text-sm text-gray-600 mt-1">
                {[resume.email, resume.phone, resume.location, resume.website].filter(Boolean).join(" | ")}
              </p>

              {resume.summary && (
                <div className="mt-4">
                  <h2 className="text-sm font-bold border-b border-gray-300 pb-1 mb-2 uppercase tracking-wider">Summary</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">{resume.summary}</p>
                </div>
              )}

              {resume.experience.some((e) => e.company) && (
                <div className="mt-4">
                  <h2 className="text-sm font-bold border-b border-gray-300 pb-1 mb-2 uppercase tracking-wider">Experience</h2>
                  {resume.experience.filter((e) => e.company).map((exp, i) => (
                    <div key={i} className="mb-3">
                      <div className="flex justify-between items-baseline">
                        <p className="text-sm font-semibold">{exp.role}</p>
                        <p className="text-xs text-gray-500">{exp.dates}</p>
                      </div>
                      <p className="text-sm text-gray-600 italic">{exp.company}</p>
                      {exp.description && <p className="text-sm text-gray-700 mt-1 leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}

              {resume.education.some((e) => e.school) && (
                <div className="mt-4">
                  <h2 className="text-sm font-bold border-b border-gray-300 pb-1 mb-2 uppercase tracking-wider">Education</h2>
                  {resume.education.filter((e) => e.school).map((edu, i) => (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between items-baseline">
                        <p className="text-sm font-semibold">{edu.degree}</p>
                        <p className="text-xs text-gray-500">{edu.dates}</p>
                      </div>
                      <p className="text-sm text-gray-600 italic">{edu.school}</p>
                    </div>
                  ))}
                </div>
              )}

              {resume.skills.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-sm font-bold border-b border-gray-300 pb-1 mb-2 uppercase tracking-wider">Skills</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {resume.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {!resume.fullName && !resume.summary && !resume.experience.some((e) => e.company) && (
                <div className="flex h-64 items-center justify-center text-sm text-gray-400">
                  Fill in the form to see your resume preview
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
