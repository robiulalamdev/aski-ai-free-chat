"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"

const ChatLayout = dynamic(() => import("@/components/chat/chat-layout").then((m) => m.ChatLayout), {
  ssr: false,
})

export default function ChatPage() {
  useEffect(() => {
    document.title = "Chat | FreeAI Chat"
  }, [])

  return <ChatLayout />
}
