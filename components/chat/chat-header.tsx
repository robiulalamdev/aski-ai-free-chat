"use client"

import { Sparkles, Menu, PanelLeftClose, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExportChat } from "./export-chat"
import { ShareButton } from "./share-button"
import type { Conversation } from "@/types/chat"
import { useState } from "react"

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
  const [showExport, setShowExport] = useState(false)

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#2e2840] bg-[#1e1929] px-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-[#2a2438] lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="hidden lg:flex h-8 w-8 text-zinc-400 hover:text-white hover:bg-[#2a2438]">
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <span className="text-sm font-semibold text-white">NexaChat</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {activeConversationId && (
          <ShareButton conversationId={activeConversationId} />
        )}
        {conversations && conversations.length > 0 && (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowExport(!showExport)}
              title="Export chat history"
              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-[#2a2438]"
            >
              <Download className="h-4 w-4" />
            </Button>
            {showExport && (
              <div className="absolute right-0 top-10 z-50 rounded-xl border border-[#2e2840] bg-[#231e30] p-3 shadow-xl">
                <ExportChat conversations={conversations} />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
