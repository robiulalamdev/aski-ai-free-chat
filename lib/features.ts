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
  | "code_generator"
  | "resume_builder"

// Reusable constants - use these instead of raw strings
export const FEATURES = {
  CUSTOM_PROMPTS: "custom_prompts" as FeatureSlug,
  EXPORT_DATA: "export_data" as FeatureSlug,
  SHARE_CHAT: "share_chat" as FeatureSlug,
  PRIORITY_SUPPORT: "priority_support" as FeatureSlug,
  TEAM_MANAGEMENT: "team_management" as FeatureSlug,
  DEDICATED_SUPPORT: "dedicated_support" as FeatureSlug,
  CUSTOM_INTEGRATIONS: "custom_integrations" as FeatureSlug,
  ADVANCED_ANALYTICS: "advanced_analytics" as FeatureSlug,
  CUSTOM_THEME: "custom_theme" as FeatureSlug,
  CODE_GENERATOR: "code_generator" as FeatureSlug,
  RESUME_BUILDER: "resume_builder" as FeatureSlug,
} as const

export interface Feature {
  slug: FeatureSlug
  name: string
  description: string
}

export const ALL_FEATURES: Feature[] = [
  { slug: FEATURES.CUSTOM_PROMPTS, name: "Custom System Prompts", description: "Set your own AI instructions" },
  { slug: FEATURES.EXPORT_DATA, name: "Export Chat History", description: "Download your conversations" },
  { slug: FEATURES.SHARE_CHAT, name: "Share Conversations", description: "Share chats via public links" },
  { slug: FEATURES.PRIORITY_SUPPORT, name: "Priority Support", description: "Faster response times" },
  { slug: FEATURES.TEAM_MANAGEMENT, name: "Team Management", description: "Invite and manage team members" },
  { slug: FEATURES.DEDICATED_SUPPORT, name: "Dedicated Support", description: "Direct line to our team" },
  { slug: FEATURES.CUSTOM_INTEGRATIONS, name: "Custom Integrations", description: "Connect with your tools" },
  { slug: FEATURES.ADVANCED_ANALYTICS, name: "Advanced Analytics", description: "Detailed usage insights" },
  { slug: FEATURES.CUSTOM_THEME, name: "Custom Theme", description: "Full UI customization" },
  { slug: FEATURES.CODE_GENERATOR, name: "Code Generator", description: "Generate HTML/CSS/JS projects with live preview" },
  { slug: FEATURES.RESUME_BUILDER, name: "Resume Builder", description: "Build professional resumes, export as PDF/DOC" },
]

export const FEATURE_MAP: Record<string, string> = Object.fromEntries(
  ALL_FEATURES.map((f) => [f.slug, f.name])
)
