"use client"

import { useState, useEffect } from "react"
import { Share2, Link2, Copy, Check, Globe, GlobeOff } from "lucide-react"
import { toggleShare, getShareStatus } from "@/app/actions/share"

export function ShareButton({ conversationId }: { conversationId: string }) {
  const [isShared, setIsShared] = useState(false)
  const [shareSlug, setShareSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    getShareStatus(conversationId).then((status) => {
      if (status) {
        setIsShared(status.isShared)
        setShareSlug(status.shareSlug)
      }
    })
  }, [conversationId])

  const handleToggle = async () => {
    setLoading(true)
    const result = await toggleShare(conversationId)
    if (result?.success) {
      setIsShared(result.shared)
      setShareSlug(result.slug || null)
    }
    setLoading(false)
    setShowDropdown(false)
  }

  const shareUrl = shareSlug ? `${typeof window !== "undefined" ? window.location.origin : ""}/shared/${shareSlug}` : ""

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-1.5 rounded-lg border border-[var(--border-custom)] px-3 py-1.5 text-xs font-medium text-zinc-400 hover:bg-[var(--surface-light)] transition-colors"
        title="Share conversation"
      >
        {isShared ? <Globe className="h-3 w-3 text-green-400" /> : <Share2 className="h-3 w-3" />}
        Share
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-[var(--border-custom)] bg-[var(--surface)] p-4 shadow-xl z-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-[var(--foreground)]">Share Conversation</h4>
            <button onClick={() => setShowDropdown(false)} className="text-zinc-500 hover:text-[var(--foreground)]">
              <span className="text-xs">✕</span>
            </button>
          </div>

          {isShared && shareSlug ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2">
                <Globe className="h-4 w-4 text-green-400 shrink-0" />
                <span className="text-xs text-green-400">Publicly shared</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 rounded-lg border border-[var(--border-custom)] bg-[var(--input-bg)] px-3 py-2 text-xs text-[var(--foreground)]"
                />
                <button onClick={copyLink} className="rounded-lg bg-violet-600 px-3 py-2 text-xs text-white hover:brightness-110">
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
              <button
                onClick={handleToggle}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <GlobeOff className="h-3 w-3" />
                Stop Sharing
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-zinc-500">Anyone with the link can view this conversation.</p>
              <button
                onClick={handleToggle}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2 text-xs font-medium text-white hover:brightness-110 transition-all"
              >
                <Link2 className="h-3 w-3" />
                Generate Share Link
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
