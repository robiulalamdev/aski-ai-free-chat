# FreeAI Chat - Implementation Tasks

## Phase 1: User Profile & Preferences ✅ IN PROGRESS
- [ ] Update Prisma schema (User: bio, avatar, systemPrompt, theme)
- [ ] Profile page (/chat/profile) - edit name, email, bio, avatar URL
- [ ] System prompt preferences per user
- [ ] Theme toggle (dark/light) with localStorage persistence
- [ ] Server actions: updateProfile, updatePreferences

## Phase 2: Subscriptions & Limits
- [ ] Subscription model (name, price, maxTokens, maxImages, features)
- [ ] UserSubscription model (userId, subscriptionId, startDate, endDate, active)
- [ ] Seed default packages: Free, Pro, Enterprise
- [ ] Server action: checkLimits, getSubscription
- [ ] Enforce limits in chat API (max tokens per day)

## Phase 3: Image Input
- [ ] Image upload in chat input (only .jpg, .png, .webp, .gif)
- [ ] Preview uploaded images before send
- [ ] Free plan: max 5 images/day
- [ ] Pro plan: max 50 images/day
- [ ] Enterprise: unlimited images
- [ ] Store image URL in message (base64 or upload service)

## Phase 4: Admin Panel (NEXT TIME)
- [ ] Admin model (email encrypted with secret key)
- [ ] Admin login separate from user
- [ ] Create/edit/delete subscription packages
- [ ] Manage users, view usage
- [ ] Dynamic package management from admin

## Phase 5: Stripe Integration (NEXT TIME)
- [ ] Stripe checkout for subscription purchase
- [ ] Webhook for payment confirmation
- [ ] Auto-activate subscription on payment

---
Created: 2026-07-29
Last updated: 2026-07-29
