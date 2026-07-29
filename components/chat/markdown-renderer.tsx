import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Copy, Check } from "lucide-react"
import { useState, type ReactElement } from "react"
import { Button } from "@/components/ui/button"

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const language = className?.replace("language-", "") || ""

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative my-3 overflow-hidden rounded-xl border border-[#2e2840] bg-[#13101c]">
      {language ? (
        <div className="flex items-center justify-between border-b border-[#2e2840] bg-[#1a1625] px-4 py-2 text-xs text-zinc-400">
          <span>{language}</span>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-[#2a2438] opacity-0 group-hover:opacity-100 transition-opacity">
            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy code"}
          </Button>
        </div>
      ) : (
        <div className="flex justify-end border-b border-[#2e2840] bg-[#1a1625] px-4 py-1">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-[#2a2438] opacity-0 group-hover:opacity-100 transition-opacity">
            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy code"}
          </Button>
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="text-zinc-300">{children}</code>
      </pre>
    </div>
  )
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-semibold prose-headings:text-white prose-p:text-zinc-200 prose-code:rounded-md prose-code:bg-[#1a1625] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-violet-300 prose-code:text-sm prose-pre:bg-transparent prose-pre:p-0 prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-li:text-zinc-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            const child = (Array.isArray(children) ? children[0] : children) as ReactElement<{ className?: string; children?: string }> | undefined
            if (child?.props?.className?.startsWith("language-")) {
              return <CodeBlock className={child.props.className}>{child.props.children || ""}</CodeBlock>
            }
            const code = child?.props?.children || ""
            return <CodeBlock>{code}</CodeBlock>
          },
          code({ className, children, ...props }) {
            if (!className) {
              return (
                <code className="rounded-md bg-[#1a1625] px-1.5 py-0.5 text-sm text-violet-300" {...props}>
                  {children}
                </code>
              )
            }
            return <code className={className} {...props}>{children}</code>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}