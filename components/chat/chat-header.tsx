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
    <header className="flex h-14 items-center justify-between border-b border-[#e2e5f1] dark:border-[#2a2540] bg-white/80 dark:bg-[#14111e]/80 backdrop-blur-xl px-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="h-8 w-8 text-[#6b7280] hover:text-[#1a1a2e] hover:bg-[#f1f3f9] dark:hover:text-[#e8e4f0] dark:hover:bg-[#231f35] lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="hidden lg:flex h-8 w-8 text-[#6b7280] hover:text-[#1a1a2e] hover:bg-[#f1f3f9] dark:hover:text-[#e8e4f0] dark:hover:bg-[#231f35]">
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#7c5cfc]" />
          <span className="text-sm font-semibold text-[#1a1a2e] dark:text-[#e8e4f0]">NexaChat</span>
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
                className="h-8 w-8 text-[#6b7280] hover:text-[#1a1a2e] hover:bg-[#f1f3f9] dark:hover:text-[#e8e4f0] dark:hover:bg-[#231f35]"
              >
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="glass-card">
              <ExportChat conversations={activeConversation ? [activeConversation] : []} />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
