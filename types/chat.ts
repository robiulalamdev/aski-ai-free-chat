export type Role = "user" | "assistant"

export type Message = {
  id: string
  role: Role
  content: string
  createdAt: number
}

export type Conversation = {
  id: string
  title: string
  toolType?: string | null
  messages: Message[]
  createdAt: number
  updatedAt: number
  modelId: string
}

export type AIModel = {
  id: string
  name: string
  description: string
  size: string
}
