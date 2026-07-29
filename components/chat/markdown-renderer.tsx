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
    <div className="group relative my-4 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      {language && (
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <span>{language}</span>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 gap-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  )
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-semibold prose-code:rounded-md prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-pre:bg-transparent prose-pre:p-0 dark:prose-code:bg-zinc-800">
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
                <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800" {...props}>
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
