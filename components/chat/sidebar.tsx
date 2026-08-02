"use client"

import { useRef, useState } from "react"
import { Plus, Trash2, Pencil, Check, X, MessageSquare, LogOut, User, Settings, ChevronUp, Code, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { Conversation } from "@/types/chat"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FEATURES } from "@/lib/features"

const TOOL_ITEMS = [
  { id: FEATURES.CODE_GENERATOR, label: "Code Generator", icon: Code, color: "from-emerald-500 to-teal-500", bg: "#dcfce7" },
  { id: FEATURES.RESUME_BUILDER, label: "Resume Builder", icon: FileText, color: "from-orange-500 to-amber-500", bg: "#ffedd5" },
]

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60000) return "Just now"
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

export function Sidebar({
  conversations,
  activeId,
  onNew,
  onSelect,
  onDelete,
  onRename,
  open,
  user,
  onLogout,
  onToolSelect,
  hasMore,
  loadingMore,
  onLoadMore,
}: {
  conversations: Conversation[]
  activeId: string | null
  onNew: () => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
  open: boolean
  user?: { firstName: string; lastName: string; email: string; plan: string; features: string[] } | null
  onLogout?: () => void
  onToolSelect?: (toolId: string) => void
  hasMore?: boolean
  loadingMore?: boolean
  onLoadMore?: () => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt)
  const fullName = user ? `${user.firstName} ${user.lastName}` : "User"
  const userInitial = user ? user.firstName.charAt(0).toUpperCase() : "U"

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) {
      onLoadMore?.()
    }
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-white dark:bg-[#14111e] transition-all duration-300 border-r border-[#e2e5f1] dark:border-[#2a2540]",
        open ? "w-72" : "w-0 overflow-hidden"
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-2">
        <img src="/logo.png" alt="NexaChat" className="h-9 w-9 object-contain" />
        <span className="text-lg font-bold text-[#1a1a2e] dark:text-[#e8e4f0]">NexaChat</span>
      </div>

      {/* New Chat Button */}
      <div className="px-3 py-3">
        <button
          onClick={onNew}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#6d4ce6] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#7c5cfc]/25 transition-all duration-300 hover:shadow-[#7c5cfc]/40 hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {/* Conversations Header */}
      <div className="px-4 pb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">Conversations</span>
      </div>

      {/* Conversations List (normal + tool chats mixed) */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {sorted.length === 0 && (
          <p className="px-3 py-4 text-center text-xs text-[#9ca3af]">No conversations yet</p>
        )}

        {sorted.map((conv) => {
          const toolDef = conv.toolType ? TOOL_ITEMS.find((t) => t.id === conv.toolType) : undefined
          const Icon = toolDef?.icon || MessageSquare
          const isTool = !!conv.toolType
          return (
            <div
              key={conv.id}
              className={cn(
                "group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 cursor-pointer",
                conv.id === activeId
                  ? "bg-[#f0ebff] text-[#7c5cfc] dark:bg-[#7c5cfc]/10 dark:text-[#8b6fff]"
                  : "text-[#6b7280] hover:bg-[#f1f3f9] hover:text-[#1a1a2e] dark:hover:bg-[#231f35] dark:hover:text-[#e8e4f0]"
              )}
            >
              {isTool ? (
                <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br shadow-sm", toolDef?.color)}>
                  <Icon className="h-3 w-3 text-white" />
                </div>
              ) : (
                <MessageSquare className="h-4 w-4 shrink-0 opacity-50" />
              )}

              {editingId === conv.id ? (
                <div className="flex flex-1 items-center gap-1">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-7 text-xs bg-white/50 dark:bg-[#231f35]/50 border-[#e2e5f1] dark:border-[#2a2540] text-[#1a1a2e] dark:text-[#e8e4f0]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onRename(conv.id, editValue)
                        setEditingId(null)
                      }
                      if (e.key === "Escape") setEditingId(null)
                    }}
                  />
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-[#6b7280] hover:text-[#7c5cfc]" onClick={() => { onRename(conv.id, editValue); setEditingId(null) }}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-[#6b7280] hover:text-red-500" onClick={() => setEditingId(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <button onClick={() => onSelect(conv.id)} className="flex-1 truncate text-left">
                  {conv.title || "New Chat"}
                </button>
              )}

              {editingId !== conv.id && (
                <div className="hidden items-center gap-0.5 group-hover:flex">
                  <span className="text-[10px] text-[#9ca3af] mr-1">{timeAgo(conv.updatedAt)}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-[#9ca3af] hover:text-[#7c5cfc]" onClick={() => { setEditingId(conv.id); setEditValue(conv.title) }}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-[#9ca3af] hover:text-red-500" onClick={() => onDelete(conv.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )
        })}

        {/* Load more */}
        {hasMore && (
          <div className="flex items-center justify-center py-3">
            <div
              className={cn(
                "h-4 w-4 animate-spin rounded-full border-2 border-[#7c5cfc]/30 border-t-[#7c5cfc]",
                !loadingMore && "opacity-0"
              )}
            />
          </div>
        )}
        {!hasMore && sorted.length > 0 && (
          <p className="py-3 text-center text-[11px] text-[#9ca3af]">End of history</p>
        )}
      </div>

      {/* AI Tools Section */}
      <div className="border-t border-[#e2e5f1] dark:border-[#2a2540] px-3 py-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af] px-1">AI Tools</span>
        <div className="mt-2 space-y-1">
          {TOOL_ITEMS.map((tool) => {
            const Icon = tool.icon
            const hasAccess = user?.features?.includes(tool.id) || false
            return (
              <button
                key={tool.id}
                onClick={() => {
                  if (hasAccess) {
                    onToolSelect?.(tool.id)
                  } else {
                    window.location.href = "/account/subscription"
                  }
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[#6b7280] hover:bg-[#f1f3f9] hover:text-[#1a1a2e] dark:hover:bg-[#231f35] dark:hover:text-[#e8e4f0] transition-all duration-200"
              >
                <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br", tool.color)}>
                  <Icon className="h-3.5 w-3.5 text-white" />
                </div>
                <span>{tool.label}</span>
                {!hasAccess && (
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-[#f0ebff] text-[#7c5cfc] font-medium dark:bg-[#7c5cfc]/10">Pro</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* User Menu */}
      <div className="border-t border-[#e2e5f1] dark:border-[#2a2540] p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-[#f1f3f9] dark:hover:bg-[#231f35]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#6d4ce6] text-sm font-semibold text-white shadow-md shadow-[#7c5cfc]/20">
                {userInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1a1a2e] dark:text-[#e8e4f0] truncate">{fullName}</p>
                <p className="text-[11px] text-[#9ca3af]">{user?.plan === "pro" ? "Pro Plan" : "Free Plan"}</p>
              </div>
              <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" sideOffset={8} className="w-[calc(100%-1rem)] glass-card">
            <DropdownMenuItem asChild>
              <Link href="/account" className="text-[#6b7280] hover:text-[#1a1a2e] dark:hover:text-[#e8e4f0]">
                <User className="h-4 w-4" />
                Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/settings" className="text-[#6b7280] hover:text-[#1a1a2e] dark:hover:text-[#e8e4f0]">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onLogout?.()} className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/20">
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
