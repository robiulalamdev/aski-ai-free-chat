"use client"

import { useState } from "react"
import { Plus, Trash2, Pencil, Check, X, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/types/chat"

export function Sidebar({
  conversations,
  activeId,
  onNew,
  onSelect,
  onDelete,
  onRename,
  open,
}: {
  conversations: Conversation[]
  activeId: string | null
  onNew: () => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
  open: boolean
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-zinc-200 bg-zinc-50 transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900",
        open ? "w-72" : "w-0 overflow-hidden"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
        <span className="text-sm font-medium">Conversations</span>
        <Button variant="ghost" size="icon" onClick={onNew}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sorted.length === 0 && (
          <p className="px-3 py-8 text-center text-xs text-zinc-400">No conversations yet</p>
        )}

        {sorted.map((conv) => (
          <div
            key={conv.id}
            className={cn(
              "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              conv.id === activeId
                ? "bg-violet-100 text-violet-900 dark:bg-violet-900/30 dark:text-violet-100"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" />

            {editingId === conv.id ? (
              <div className="flex flex-1 items-center gap-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-7 text-xs"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onRename(conv.id, editValue)
                      setEditingId(null)
                    }
                    if (e.key === "Escape") setEditingId(null)
                  }}
                />
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { onRename(conv.id, editValue); setEditingId(null) }}>
                  <Check className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingId(null)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <button onClick={() => onSelect(conv.id)} className="flex-1 truncate text-left">
                {conv.title}
              </button>
            )}

            {editingId !== conv.id && (
              <div className="hidden items-center gap-0.5 group-hover:flex">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setEditingId(conv.id); setEditValue(conv.title) }}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => onDelete(conv.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
