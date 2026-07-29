export type FeatureSlug =
  | "custom_prompts"
  | "export_data"
  | "share_chat"
  | "priority_support"
  | "team_management"
  | "dedicated_support"
  | "custom_integrations"
  | "advanced_analytics"
  | "custom_theme"

export interface Feature {
  slug: FeatureSlug
  name: string
  description: string
}

export const ALL_FEATURES: Feature[] = [
  { slug: "custom_prompts", name: "Custom System Prompts", description: "Set your own AI instructions" },
  { slug: "export_data", name: "Export Chat History", description: "Download your conversations" },
  { slug: "share_chat", name: "Share Conversations", description: "Share chats via public links" },
  { slug: "priority_support", name: "Priority Support", description: "Faster response times" },
  { slug: "team_management", name: "Team Management", description: "Invite and manage team members" },
  { slug: "dedicated_support", name: "Dedicated Support", description: "Direct line to our team" },
  { slug: "custom_integrations", name: "Custom Integrations", description: "Connect with your tools" },
  { slug: "advanced_analytics", name: "Advanced Analytics", description: "Detailed usage insights" },
  { slug: "custom_theme", name: "Custom Theme", description: "Full UI customization" },
]

export const FEATURE_MAP: Record<string, string> = Object.fromEntries(
  ALL_FEATURES.map((f) => [f.slug, f.name])
)
