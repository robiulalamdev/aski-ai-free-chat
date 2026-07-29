export type AgentResponse = {
  type: "answer"
  content: string
}

export class AIAgent {
  private generateFn: (messages: { role: string; content: string }[], onToken?: (token: string) => void) => Promise<string>

  constructor(generateFn: (messages: { role: string; content: string }[], onToken?: (token: string) => void) => Promise<string>) {
    this.generateFn = generateFn
  }

  async processMessage(
    messages: { role: string; content: string }[],
    onToken?: (token: string) => void
  ): Promise<AgentResponse> {
    const content = await this.generateFn(messages, onToken)
    return { type: "answer", content }
  }
}