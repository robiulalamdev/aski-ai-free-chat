"use client"

import { Sparkles, Menu, PanelLeftClose, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExportChat } from "./export-chat"
import { ShareButton } from "./share-button"
import { ThemeToggle } from "@/components/providers/theme-toggle"
import type { Conversation } from "@/types/chat"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ChatHeader({
  title,
  onToggleSidebar,
  sidebarOpen,
  conversations,
  activeConversationId,
}: {
  title: string
  onToggleSidebar: () => void
  sidebarOpen: boolean
  conversations?: Conversation[]
  activeConversationId?: string | null
}) {
  const activeConversation = conversations?.find((c) => c.id === activeConversationId)
  const hasMessages = activeConversation && activeConversation.messages.length > 0
  const isResume = activeConversation?.toolType === "resume_builder"

  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--border-custom)] bg-[var(--background)] px-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="h-8 w-8 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-light)] lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="hidden lg:flex h-8 w-8 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-light)]">
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <span className="text-sm font-semibold text-[var(--foreground)]">NexaChat</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        {activeConversationId && (
          <ShareButton conversationId={activeConversationId} />
        )}
        {hasMessages && !isResume && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                title="Export chat history"
                className="h-8 w-8 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-light)]"
              >
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8}>
              <ExportChat conversations={activeConversation ? [activeConversation] : []} />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
