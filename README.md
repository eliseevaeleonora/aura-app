# ✦ Aura — Стань лучшей версией себя

> Your aesthetic self-improvement companion for Telegram

A premium, feminine self-improvement Telegram Mini App featuring habits, wellness tracking, soft gamification, and emotional support. Built with Next.js 14, Supabase, and Framer Motion.

---

## ✨ Features

- **Home Dashboard** — greeting, XP progress, streak calendar, daily tasks, wellness stats
- **Task Manager** — categorized tasks (mandatory / work / personal / wellness) with XP/diamond rewards
- **Analytics** — weekly/monthly/yearly charts, habit progress, AI insights
- **Wellness Hub** — meditations, sleep tracking, breathing exercises (4-7-8), focus music
- **Shop** — unlock themes, decorations, and boosts with diamonds
- **Profile** — achievements, stats, settings
- **Soft Gamification** — XP, levels, streaks, diamonds (no RPG combat)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- A Supabase project
- A Telegram Bot (from [@BotFather](https://t.me/BotFather))
- A Vercel account (for deployment)

### 1. Clone & Install

```bash
git clone https://github.com/yourname/aura-app
cd aura-app
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 3. Set Up Supabase Database

1. Go to your Supabase project → SQL Editor
2. Copy and run the contents of `supabase/schema.sql`
3. This creates all tables, indexes, RLS policies, and seeds shop items

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📱 Telegram Mini App Setup

### 1. Create a Bot

1. Open [@BotFather](https://t.me/BotFather) in Telegram
2. Send `/newbot` and follow the prompts
3. Save the bot token to `TELEGRAM_BOT_TOKEN`

### 2. Configure the Mini App

```
/newapp — Create a new Mini App
```

Or set it via `/setmenubutton` on your existing bot.

Set the Web App URL to your Vercel deployment URL.

### 3. Configure Bot Commands (Optional)

```
/setcommands
start - Открыть Aura ✨
```

---

## 🌐 Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial Aura app"
git push origin main
```

### 2. Deploy

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Add environment variables (same as `.env.local`)
4. Deploy!

### 3. Update Telegram Mini App URL

Update your Mini App URL in BotFather to your Vercel deployment URL.

---

## 🗄️ Project Structure

```
aura/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/route.ts      # Telegram auth verification
│   │   │   └── tasks/route.ts     # Tasks CRUD
│   │   ├── layout.tsx             # Root layout with fonts
│   │   └── page.tsx               # Main app entry
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx       # Main shell with tab routing
│   │   │   └── BottomNav.tsx      # Bottom navigation bar
│   │   ├── home/
│   │   │   └── HomeScreen.tsx     # Dashboard
│   │   ├── tasks/
│   │   │   ├── TasksScreen.tsx    # Full task manager
│   │   │   └── TaskCard.tsx       # Reusable task card
│   │   ├── analytics/
│   │   │   └── AnalyticsScreen.tsx # Charts & insights
│   │   ├── wellness/
│   │   │   └── WellnessScreen.tsx # Meditations, sleep, breathing
│   │   ├── shop/
│   │   │   └── ShopScreen.tsx     # Diamond shop
│   │   ├── profile/
│   │   │   └── ProfileScreen.tsx  # User profile & achievements
│   │   └── ui/
│   │       ├── index.tsx          # Button, Badge, Card, XPBar, Tabs
│   │       └── XPToast.tsx        # XP reward animation
│   │
│   ├── hooks/                     # Custom React hooks
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client
│   │   ├── telegram.ts            # Telegram SDK utilities
│   │   ├── api.ts                 # Supabase API calls
│   │   ├── mockData.ts            # Development mock data
│   │   └── utils.ts               # Utility functions
│   ├── store/
│   │   └── useAuraStore.ts        # Zustand global state
│   ├── styles/
│   │   └── globals.css            # Global CSS & design tokens
│   └── types/
│       └── index.ts               # TypeScript types
│
├── supabase/
│   └── schema.sql                 # Complete DB schema
│
├── public/
│   └── manifest.json              # PWA manifest
│
├── tailwind.config.ts             # Tailwind with Aura design tokens
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## 🎨 Design System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-purple` | `#9b8ae8` | Primary accent |
| `--color-purple2` | `#c4b8f7` | Light accent |
| `--color-purple3` | `#6d5dbd` | Dark accent |
| `--color-lavender2` | `#e8e4fa` | Headings |
| `--color-pink` | `#e8a4c8` | Secondary accent |
| `--color-gold` | `#e8c97a` | XP/rewards |
| `--color-teal` | `#7dc9c0` | Wellness |

### Typography

- **Display**: DM Serif Display (headings, hero text)
- **Body**: DM Sans (UI, descriptions)

### Themes

Users can unlock additional color themes:
- 🌙 **Midnight** (default) — deep purple
- ☕ **Soft Beige** — warm tones
- 💜 **Lavender Dream** — light purple
- 🌿 **Sage Green** — natural green

---

## 🔧 Adding Features

### New Task Category

1. Add to `TaskCategory` type in `src/types/index.ts`
2. Add color to `CATEGORY_COLORS` in `TaskCard.tsx`
3. Add to `CATEGORIES` array in `TasksScreen.tsx`

### New Achievement

1. Insert into `achievements` table in Supabase
2. Add to `MOCK_ACHIEVEMENTS` in `src/lib/mockData.ts`

### New Shop Item

1. Insert into `shop_items` table in Supabase
2. Add to `MOCK_SHOP_ITEMS` in `src/lib/mockData.ts`

---

## 📊 Database

See `supabase/schema.sql` for the complete schema including:

- Row Level Security policies
- Automatic `updated_at` triggers
- Seeded shop items and achievements
- Indexes for performance

---

## 🛡️ Security

- Telegram `initData` is cryptographically verified server-side in production
- Row Level Security ensures users only access their own data
- Service role key is only used server-side (never exposed to client)

---

## 📄 License

MIT © 2024 Aura App

---

*Built with love, lavender, and a little bit of stardust ✨*
