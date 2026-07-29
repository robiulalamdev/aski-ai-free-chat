# NexaChat - Implementation Tasks

## Phase 1: User Profile & Preferences ✅
- [x] Prisma schema (User: bio, systemPrompt, theme)
- [x] Profile page (/account) - edit name, email, bio
- [x] System prompt preferences per user
- [x] Theme toggle (dark/light) with localStorage persistence
- [x] Server actions: updateProfile, updatePreferences

## Phase 2: Subscriptions & Limits ✅
- [x] Subscription model (name, price, maxTokens, features)
- [x] UserSubscription model (userId, subscriptionId, startDate, endDate, active)
- [x] Seed default packages: Free, Pro, Enterprise
- [x] Server actions: checkLimits, getSubscription
- [x] Token limit enforcement in chat API

## Phase 3: Authentication ✅
- [x] Manual JWT auth with jose (access + refresh tokens)
- [x] httpOnly cookies for token storage
- [x] Auth middleware for protected routes
- [x] Login/Signup pages
- [x] Auto-redirect on auth state

## Phase 4: Chat System ✅
- [x] ChatGPT-style streaming chat
- [x] Optimistic UI for instant messages
- [x] Smart title generation (AI-powered)
- [x] URL changes after AI response completes
- [x] Conversation history in PostgreSQL
- [x] Regenerate AI responses
- [x] Export chats (MD/JSON/TXT)
- [x] Share conversations via public links

## Phase 5: Admin Panel ✅
- [x] Admin model with roles (SUPER_ADMIN, ADMIN, MODERATOR)
- [x] Separate admin auth (JWT + cookies)
- [x] Admin dashboard (/dashboard)
- [x] User management
- [x] Subscription management
- [x] Admin user management

## Phase 6: Stripe Integration ✅
- [x] Stripe checkout for subscriptions
- [x] Webhook for payment confirmation
- [x] Auto-activate subscription on payment
- [x] Billing portal for existing subscribers

## Phase 7: AI Tools ✅
- [x] Feature system with typed slugs
- [x] Plan-gated tool access (Pro/Enterprise)
- [x] /tools index page with tool cards
- [x] Code Generator (HTML/CSS/JS + live preview + ZIP download)
- [x] Resume Builder (form + AI enhance + PDF/DOC export)
- [x] Tool layout + upgrade prompt components
- [x] SEO metadata for tool pages

## Phase 8: SEO & Landing Page ✅
- [x] Root layout metadata (OG, Twitter, keywords)
- [x] Sitemap with all public pages
- [x] Robots.txt
- [x] PWA manifest
- [x] Landing page (Hero, Features, Pricing, FAQ, CTA, Footer)
- [x] Developer info in footer
- [x] 404 page

---

## Future Features (Not Yet Implemented)

### High Priority
- [ ] Password reset flow (email-based)
- [ ] Email verification
- [ ] Image upload in chat (vision AI)
- [ ] Voice input (speech-to-text)
- [ ] Multiple AI model selection

### Medium Priority
- [ ] Chat folders/organization
- [ ] Pin important conversations
- [ ] Message search across all chats
- [ ] Custom system prompts per conversation
- [ ] AI memory across conversations

### Low Priority
- [ ] Profile picture upload
- [ ] Two-factor authentication (2FA)
- [ ] Session management (view/revoke devices)
- [ ] Usage-based pricing (pay per token)
- [ ] Invoice generation
- [ ] Coupon/promo code system

### Integrations
- [ ] Slack/Discord bot
- [ ] API key management for developers
- [ ] Webhook builder
- [ ] Public chat discovery/explore page

---

Created: 2026-07-29
Last updated: 2026-07-30
