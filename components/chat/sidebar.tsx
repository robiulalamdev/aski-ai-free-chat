"use client"

import { useState } from "react"
import { Plus, Trash2, Pencil, Check, X, MessageSquare, Settings, Brain, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/types/chat"

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
  user?: { name: string; email: string; plan: string } | null
  onLogout?: () => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt)
  const userName = user?.name || "User"
  const userInitial = userName.charAt(0).toUpperCase()
  const userPlan = user?.plan === "pro" ? "Pro Plan" : "Free Plan"

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-[#13101c] transition-all duration-300",
        open ? "w-72 border-r border-[#2e2840]" : "w-0 overflow-hidden"
      )}
    >
      <div className="flex items-center gap-2.5 px-5 pt-5 pb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
          <Brain className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-semibold text-white">FreeAI</span>
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
                ? "bg-[#2a2438] text-white"
                : "text-zinc-400 hover:bg-[#231e30] hover:text-zinc-200"
            )}
          >
            <MessageSquare className="h-4 w-4 shrink-0 opacity-50" />

            {editingId === conv.id ? (
              <div className="flex flex-1 items-center gap-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-7 text-xs bg-[#1e1929] border-[#2e2840] text-white"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onRename(conv.id, editValue)
                      setEditingId(null)
                    }
                    if (e.key === "Escape") setEditingId(null)
                  }}
                />
                <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white" onClick={() => { onRename(conv.id, editValue); setEditingId(null) }}>
                  <Check className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-white" onClick={() => setEditingId(null)}>
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

      <div className="border-t border-[#2e2840] p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-semibold text-white">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-[11px] text-zinc-500">{userPlan}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-300" title="Settings">
            <Settings className="h-4 w-4" />
          </Button>
          {onLogout && (
            <Button variant="ghost" size="icon" onClick={onLogout} className="h-8 w-8 text-zinc-500 hover:text-red-400" title="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
