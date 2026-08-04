# NexaChat

<img width="1920" height="805" alt="Screenshot 2026-08-04 at 10 13 34 PM" src="https://github.com/user-attachments/assets/4af0aa80-527d-44a5-b301-9a1576fcea9d" />


<p align="center">
  AI-powered chat application with subscription plans, in-chat AI tools, an admin dashboard, and Stripe-powered payments.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61dafb" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4-06b6d4" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Prisma-7-2d3748" alt="Prisma 7" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-336791" alt="PostgreSQL (Neon)" />
  <img src="https://img.shields.io/badge/Payments-Stripe-635bff" alt="Stripe" />
</p>

---

## Overview

NexaChat is a full-featured, production-oriented AI chat platform built on the Next.js App Router. It combines a ChatGPT-style streaming chat experience with a multi-tier subscription model, built-in AI tools (code generator and resume builder), conversation sharing, and a role-based admin dashboard.

The application is designed for real-world deployment: JWT-based authentication with httpOnly cookies, Stripe Checkout with webhook-driven subscription management, feature gating tied to subscription plans, and a fully server-rendered, SEO-friendly front end.

## Features

### Core Chat Experience
- **Streaming chat** with optimistic UI and Markdown rendering (GFM + syntax highlighting)
- **AI-generated conversation titles**
- **Regenerate responses** for alternative answers
- **Export conversations** as Markdown, JSON, or plain text
- **Share conversations** via public links (`/shared/{slug}`)

### AI Tools (in-chat)
- **Code Generator** — builds HTML/CSS/JS with a live preview panel and ZIP download
- **Resume Builder** — ATS-optimized resume creation with PDF/DOC export

### Monetization & Access Control
- **Subscription plans** — Free / Pro / Enterprise with daily token quotas
- **Feature gating** — tools, team management, integrations, analytics, and more are unlocked by plan
- **Stripe Checkout + Webhooks** for payments and subscription lifecycle

### Administration
- **Admin dashboard** (`/dashboard`) with role-based access (Super Admin, Admin, Moderator)
- Manage **users**, **subscriptions**, and **admins**

### Platform
- **PWA manifest**, dynamic **sitemap**, and **robots.txt**
- **Dark purple theme** with shadcn-style components and animated dropdowns
- Public pages: About, Privacy Policy, and Terms of Service

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4, Radix UI, Lucide Icons |
| **Database** | PostgreSQL (Neon) via Prisma 7 (`@prisma/adapter-pg`) |
| **Authentication** | JWT (jose) with httpOnly cookies, bcryptjs password hashing |
| **Payments** | Stripe (Checkout + Webhooks) |
| **AI** | DeepSeek via the OpenRouter API |
| **Document generation** | `docx`, `html2pdf.js`, `jszip`, `file-saver` |

## Getting Started

### Prerequisites

- **Node.js** 18+ (npm included)
- **PostgreSQL** database (Neon recommended)
- **Stripe** account — for payments, checkout, and webhooks
- **OpenRouter** API key — for AI model access

### Environment Variables

Create a `.env` file in the `myapp/` directory. A complete template is shown below:

```env
# ── Database ─────────────────────────────────────────────────────────────
DATABASE_URL="postgresql://user:password@host/database"

# ── JWT Authentication ───────────────────────────────────────────────────
ACCESS_TOKEN_SECRET="your-access-secret"
REFRESH_TOKEN_SECRET="your-refresh-secret"
JWT_ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRES_IN="1h"
REFRESH_TOKEN_EXPIRES_IN="7d"

# ── Cookie Settings ──────────────────────────────────────────────────────
ACCESS_COOKIE_NAME="freeai_access_token"
REFRESH_COOKIE_NAME="freeai_refresh_token"
ACCESS_COOKIE_MAX_AGE="3600"
REFRESH_COOKIE_MAX_AGE="604800"
COOKIE_SECURE=false
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE="lax"

# ── Admin ────────────────────────────────────────────────────────────────
ADMIN_ACCESS_TOKEN_SECRET="your-admin-access-secret"
ADMIN_REFRESH_TOKEN_SECRET="your-admin-refresh-secret"
ADMIN_ACCESS_TOKEN_EXPIRES_IN="1h"
ADMIN_REFRESH_TOKEN_EXPIRES_IN="7d"
ADMIN_ACCESS_COOKIE_NAME="nexachat_admin_access"
ADMIN_REFRESH_COOKIE_NAME="nexachat_admin_refresh"
ADMIN_ACCESS_COOKIE_MAX_AGE="3600"
ADMIN_REFRESH_COOKIE_MAX_AGE="604800"
ADMIN_EMAIL="admin@nexachat.com"
ADMIN_PASSWORD="Admin@123"

# ── Stripe ───────────────────────────────────────────────────────────────
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# ── AI ───────────────────────────────────────────────────────────────────
MIMO_API_KEY="your-openrouter-api-key"

# ── Application ──────────────────────────────────────────────────────────
SITE_URL="http://localhost:3000"
```

> **Note:** `MIMO_API_KEY` is the variable name used internally; supply your OpenRouter API key here.

### Installation & Running

```bash
cd myapp
npm install

# Prepare the database
npx prisma generate
npx prisma db push

# Seed subscription plans + admin user
npx tsx prisma/seed.ts

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin Access

The seed script creates a default admin account:

| Setting | Value |
|---------|-------|
| **URL** | `/dashboard/login` |
| **Email** | `admin@nexachat.com` |
| **Password** | `Admin@123` |

> Change the default admin credentials in your `.env` **before** production deployment.

## Project Structure

```
myapp/
├── app/
│   ├── (auth)/               # Login & signup
│   ├── (admin)/              # Admin dashboard (users, subscriptions, admins)
│   ├── account/              # Settings, subscription, team, billing, security, analytics, integrations
│   ├── actions/              # Server actions (auth, chat, share, etc.)
│   ├── api/
│   │   ├── chat/             # Streaming chat completions
│   │   ├── title/            # AI conversation-title generation
│   │   └── webhook/stripe/   # Stripe webhook handler
│   ├── c/[id]/               # Existing conversation view
│   ├── chat/new/             # New chat
│   ├── shared/[slug]/        # Public shared conversations
│   ├── t/[tool]/             # AI tool chat (code generator, resume builder)
│   ├── about/                # About page
│   ├── privacy/              # Privacy Policy
│   ├── terms/                # Terms of Service
│   ├── not-found.tsx         # 404 page
│   ├── sitemap.ts            # Dynamic sitemap
│   ├── robots.ts             # robots.txt
│   └── manifest.ts           # PWA manifest
├── components/
│   ├── chat/                 # Chat UI (layout, messages, input, sidebar, share/export)
│   ├── landing/              # Landing page sections
│   ├── providers/            # Auth, AI, Theme providers
│   └── ui/                   # shadcn-style UI components
├── config/env.ts             # Centralized, typed environment configuration
├── database/                 # Prisma generated client + schema
├── features/                 # Feature constants and typed slugs
├── hooks/                    # Shared React hooks
├── lib/                      # auth, features, stripe, prisma helpers
├── services/                 # AI runtime, search, website reader
├── store/                    # Client-side state management
├── types/                    # Shared TypeScript types
├── utils/                    # Utility functions
├── prisma/seed.ts            # Seed script (plans + admin)
└── middleware.ts             # Route protection & role checks
```

## Route Map

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | User login |
| `/signup` | Public | User registration |
| `/chat/new` | Authenticated | Start a new chat |
| `/c/[id]` | Authenticated | View an existing conversation |
| `/t/[tool]` | Authenticated | AI tool chat (code generator, resume builder) |
| `/shared/[slug]` | Public | Read-only shared conversation |
| `/account/*` | Authenticated | Settings, subscription, team, billing, security, analytics, integrations |
| `/dashboard` | Admin | Admin panel |
| `/dashboard/login` | Public | Admin login |
| `/about` | Public | About page |
| `/privacy` | Public | Privacy Policy |
| `/terms` | Public | Terms of Service |

## Subscription Plans

| Plan | Price | Tokens / Day | Unlocked Features |
|------|-------|--------------|-------------------|
| **Free** | $0 | 50,000 | Chat sharing, data export |
| **Pro** | $9.99 / mo | 500,000 | + Custom prompts, priority support, advanced analytics, code generator, resume builder |
| **Enterprise** | $29.99 / mo | 2,000,000 | + Team management, dedicated support, custom integrations, custom theme |

Plans are seeded via `prisma/seed.ts` and managed through the admin dashboard.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

## Security Notes

- All authentication is handled via JWT stored in **httpOnly cookies**.
- Passwords are hashed with **bcryptjs** (cost factor 12).
- Admin and user sessions use **separate token pairs and cookies**.
- Set `COOKIE_SECURE=true` and strong secrets when deploying over HTTPS.

## License

Private project. Unauthorized use, reproduction, or distribution is prohibited.
