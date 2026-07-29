# NexaChat

AI-powered chat application with subscription plans, admin dashboard, and Stripe payments.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** Tailwind CSS 4, Radix UI, Lucide Icons
- **Database:** PostgreSQL (Neon) + Prisma 7
- **Auth:** JWT (jose) with httpOnly cookies
- **Payments:** Stripe (Checkout + Webhooks)
- **AI:** DeepSeek via OpenRouter API
- **Language:** TypeScript

## Features

- ChatGPT-style streaming chat with optimistic UI
- AI-generated conversation titles
- Share conversations via public links (`/shared/{slug}`)
- Export chats as Markdown, JSON, or Text
- Regenerate AI responses
- Subscription plans (Free / Pro / Enterprise)
- Feature-gated access (team management, integrations, analytics, etc.)
- Admin dashboard (`/dashboard`) with role-based access (Super Admin, Admin, Moderator)
- Stripe checkout and webhook handling
- Dark purple theme with shadcn-style animated dropdowns

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- Stripe account (for payments)
- OpenRouter API key (for AI)

### Environment Variables

Create `.env` in the `myapp/` directory:

```env
# Database
DATABASE_URL="postgresql://..."

# JWT Auth
ACCESS_TOKEN_SECRET="your-secret"
REFRESH_TOKEN_SECRET="your-secret"
JWT_ALGORITHM="HS256"

# Cookies
ACCESS_COOKIE_NAME="freeai_access_token"
REFRESH_COOKIE_NAME="freeai_refresh_token"
COOKIE_SECURE=false
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE="lax"

# Admin
ADMIN_ACCESS_TOKEN_SECRET="your-admin-secret"
ADMIN_REFRESH_TOKEN_SECRET="your-admin-secret"
ADMIN_EMAIL="admin@nexachat.com"
ADMIN_PASSWORD="Admin@123"

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."

# AI
MIMO_API_KEY="your-openrouter-key"

# App
SITE_URL="http://localhost:3000"
```

### Install & Run

```bash
cd myapp
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Admin Access

- URL: `/dashboard/login`
- Email: `admin@nexachat.com`
- Password: `Admin@123`

## Project Structure

```
myapp/
├── app/
│   ├── (auth)/login, signup
│   ├── account/          # User settings, subscription, team
│   ├── api/              # API routes (chat, title, webhook)
│   ├── c/[id]/           # Conversation view
│   ├── chat/new/         # New chat
│   ├── dashboard/        # Admin panel
│   ├── shared/[slug]/    # Public shared chats
│   ├── not-found.tsx     # 404 page
│   └── layout.tsx
├── components/
│   ├── chat/             # Chat UI (layout, messages, input, sidebar)
│   ├── landing/          # Landing page sections
│   ├── providers/        # Auth, AI, Theme providers
│   └── ui/               # shadcn components (button, dropdown-menu, etc.)
├── config/env.ts         # Centralized env vars
├── database/models/      # Prisma schema files
├── lib/
│   ├── auth.ts           # JWT helpers
│   ├── features.ts       # Feature constants
│   ├── stripe.ts         # Stripe client
│   └── prisma.ts         # Prisma client
├── app/actions/          # Server actions (auth, conversations, share, etc.)
└── middleware.ts          # Route protection
```

## Routes

| Route | Auth | Description |
|-------|------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | User login |
| `/signup` | Public | User registration |
| `/chat/new` | User | New chat |
| `/c/[id]` | User | Existing conversation |
| `/account/*` | User | Settings, subscription, team |
| `/shared/[slug]` | Public | Shared conversation |
| `/dashboard` | Admin | Admin panel |
| `/dashboard/login` | Public | Admin login |

## License

Private project.
