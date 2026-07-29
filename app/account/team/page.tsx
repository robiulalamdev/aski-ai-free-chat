"use client"

import { useState, useEffect } from "react"
import { Loader2, Users, Plus, Trash2, Shield, X } from "lucide-react"
import { getTeamMembers, inviteTeamMember, removeTeamMember, updateTeamMemberRole } from "@/app/actions/team"

interface TeamMember {
  id: string
  role: string
  isActive: boolean
  createdAt: Date
  user: { id: string; firstName: string; lastName: string; email: string }
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvite, setShowInvite] = useState(false)
  const [email, setEmail] = useState("")
  const [inviting, setInviting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const load = async () => {
    const data = await getTeamMembers()
    setMembers(data as TeamMember[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleInvite = async () => {
    if (!email.trim()) return
    setInviting(true)
    setError("")
    const result = await inviteTeamMember(email)
    if (result?.error) setError(result.error)
    else { setSuccess("Member invited!"); setEmail(""); setShowInvite(false); await load() }
    setInviting(false)
    setTimeout(() => { setSuccess(""); setError("") }, 3000)
  }

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this member?")) return
    await removeTeamMember(id)
    await load()
  }

  const handleRoleChange = async (id: string, role: string) => {
    await updateTeamMemberRole(id, role)
    await load()
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-violet-500" /></div>
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Team Management</h1>
          <p className="mt-1 text-sm text-zinc-500">Invite and manage team members</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Invite Member
        </button>
      </div>

      {success && <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">{success}</div>}
      {error && <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--foreground)]">Invite Member</h2>
              <button onClick={() => setShowInvite(false)} className="text-zinc-400 hover:text-[var(--foreground)]"><X className="h-5 w-5" /></button>
            </div>
            <p className="mb-4 text-sm text-zinc-500">Enter the email of the user you want to invite. They must already have a NexaChat account.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full rounded-xl border border-[var(--border-custom)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-violet-500/50"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowInvite(false)} className="rounded-xl border border-[var(--border-custom)] px-4 py-2.5 text-sm text-zinc-400 hover:bg-[var(--surface-light)]">Cancel</button>
              <button onClick={handleInvite} disabled={inviting || !email.trim()} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50">
                {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="space-y-3">
        {members.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
            <p className="text-sm text-zinc-500">No team members yet. Invite someone to get started.</p>
          </div>
        ) : (
          members.map((member) => (
            <div key={member.id} className="flex items-center justify-between rounded-2xl border border-[var(--border-custom)] bg-[var(--surface)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white">
                  {member.user.firstName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{member.user.firstName} {member.user.lastName}</p>
                  <p className="text-xs text-zinc-500">{member.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.id, e.target.value)}
                  className="rounded-lg border border-[var(--border-custom)] bg-[var(--input-bg)] px-3 py-1.5 text-xs text-[var(--foreground)] outline-none"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <button onClick={() => handleRemove(member.id)} className="text-zinc-400 hover:text-red-400 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
