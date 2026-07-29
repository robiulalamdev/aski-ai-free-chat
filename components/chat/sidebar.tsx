"use client"

import { useState } from "react"
import { Plus, Trash2, Pencil, Check, X, MessageSquare, Brain, LogOut, User, Settings, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { Conversation } from "@/types/chat"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
}: {
  conversations: Conversation[]
  activeId: string | null
  onNew: () => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
  open: boolean
  user?: { firstName: string; lastName: string; email: string; plan: string } | null
  onLogout?: () => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt)
  const fullName = user ? `${user.firstName} ${user.lastName}` : "User"
  const userInitial = user ? user.firstName.charAt(0).toUpperCase() : "U"

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-[var(--sidebar-bg)] transition-all duration-300 border-r border-[var(--border-custom)]",
        open ? "w-72" : "w-0 overflow-hidden"
      )}
    >
      <div className="flex items-center gap-2.5 px-5 pt-5 pb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
          <Brain className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-semibold text-[var(--foreground)]">NexaChat</span>
      </div>

      <div className="px-3 py-3">
        <button
          onClick={onNew}
          className="flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:shadow-violet-600/30 hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      <div className="px-4 pb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">Conversations</span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {sorted.length === 0 && (
          <p className="px-3 py-8 text-center text-xs text-zinc-600">No conversations yet</p>
        )}

        {sorted.map((conv) => (
          <div
            key={conv.id}
            className={cn(
              "group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors cursor-pointer",
              conv.id === activeId
                ? "bg-[var(--surface-light)] text-[var(--foreground)]"
                : "text-zinc-400 hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
            )}
          >
            <MessageSquare className="h-4 w-4 shrink-0 opacity-50" />

            {editingId === conv.id ? (
              <div className="flex flex-1 items-center gap-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-7 text-xs bg-[var(--background)] border-[var(--border-custom)] text-[var(--foreground)]"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onRename(conv.id, editValue)
                      setEditingId(null)
                    }
                    if (e.key === "Escape") setEditingId(null)
                  }}
                />
                <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-[var(--foreground)]" onClick={() => { onRename(conv.id, editValue); setEditingId(null) }}>
                  <Check className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-[var(--foreground)]" onClick={() => setEditingId(null)}>
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
                <span className="text-[10px] text-zinc-600 mr-1">{timeAgo(conv.updatedAt)}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-600 hover:text-zinc-300" onClick={() => { setEditingId(conv.id); setEditValue(conv.title) }}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-600 hover:text-red-400" onClick={() => onDelete(conv.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User Menu */}
      <div className="border-t border-[var(--border-custom)] p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[var(--surface)]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-semibold text-white">
                {userInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)] truncate">{fullName}</p>
                <p className="text-[11px] text-zinc-500">{user?.plan === "pro" ? "Pro Plan" : "Free Plan"}</p>
              </div>
              <ChevronUp className="h-4 w-4 text-zinc-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" sideOffset={8} className="w-[calc(100%-1rem)]">
            <DropdownMenuItem asChild>
              <Link href="/account">
                <User className="h-4 w-4" />
                Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/settings">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onLogout?.()} className="text-red-400 focus:text-red-400 focus:bg-red-500/10">
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
