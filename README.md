# 🔍 Real-Time Website UX Tester

> AI + Human Simulation — discover where users get confused before they abandon your site.

![Tech Stack](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Groq]([https://img.shields.io/badge/Claude-API-cc785c?logo=anthropic](https://avatars.githubusercontent.com/u/7464134?s=48&v=4))

---

## ✨ What It Does

Paste any URL and get a full UX audit from **3 distinct user personas**, powered by Claude AI:

| Persona | Focus Areas |
|---|---|
| 🐣 **Beginner User** | Navigation clarity, jargon, CTA confusion, onboarding gaps |
| 📱 **Distracted User** | Above-fold value, cognitive load, attention anchors |
| 📲 **Mobile User** | Touch targets, responsive layout, font sizes, forms |

Each persona generates:
- **UX Score** (0–100)
- **Hesitation points** with time estimates
- **Issue cards** (Critical / Warning / Minor) with fix suggestions
- **Completion likelihood** percentage
- **Flow breakers** — specific flows that would cause abandonment

---

## 🏗️ Project Architecture

```
ux-tester/
├── app/
│   ├── layout.tsx              # Root layout + Google Fonts
│   ├── page.tsx                # Main page — state router
│   ├── globals.css             # Tailwind v4 + design tokens
│   └── api/
│       └── analyze/
│           └── route.ts        # SSE streaming API route
│
├── components/
│   ├── ui/
│   │   ├── URLInput.tsx        # Hero URL input + validation
│   │   ├── ScoreRing.tsx       # Animated SVG score ring
│   │   ├── IssueCard.tsx       # Collapsible issue card
│   │   └── ErrorState.tsx      # Error display
│   ├── layout/
│   │   └── HeroSection.tsx     # Landing hero
│   └── simulation/
│       ├── SimulationProgress.tsx  # Loading/streaming UI
│       ├── PersonaCard.tsx         # Full persona report card
│       └── ResultsDashboard.tsx    # Results layout
│
├── lib/
│   ├── utils.ts                # cn(), score helpers, URL utils
│   ├── prompts.ts              # Claude prompt engineering
│   └── useAnalysis.ts          # Core hook — SSE streaming state
│
├── types/
│   └── index.ts                # All TypeScript interfaces
│
├── .env.local                  # API key (not committed)
├── next.config.ts
├── postcss.config.mjs          # Tailwind 4 PostCSS setup
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <your-repo>
cd ux-tester
npm install
```

### 2. Set API Key

```bash
cp .env.local.example .env.local
# Edit .env.local and add your Gemini API key
```

Get a **free** key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) — no credit card needed.

### 3. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ | Your Groq API key (free, no credit card) |

Get a **free** API key at [console.groq.com/keys](https://console.groq.com/keys)

**Free tier:** Generous daily limits · Works globally · No credit card needed

### 2. Set API Key

```bash
# .env.local
GROQ_API_KEY=gsk_...your-key-here
```

Get a **free** key at [console.groq.com/keys](https://console.groq.com/keys) — no credit card, works in Bangladesh.

---

## 🧠 How the AI Works

The analysis uses **Server-Sent Events (SSE)** for real-time streaming:

1. **POST `/api/analyze`** — receives URL
2. Fires **4 concurrent Claude requests**:
   - Global site analysis (category, overall issues)
   - Beginner persona simulation
   - Distracted persona simulation
   - Mobile persona simulation
3. Each response is structured JSON, parsed and streamed back
4. Frontend receives `step` → `complete` events via SSE
5. Results rendered progressively as data arrives

### Prompt Strategy

Each persona has a detailed system context in `lib/prompts.ts` describing:
- User characteristics and mental model
- Common friction points for that user type
- What to focus on during the simulated visit

Claude responds with structured JSON containing issues, hesitation points, scores, and recommendations.

---

## 🎨 Design System

Built with **Tailwind v4** `@theme` directive for CSS custom properties:

- **Color palette**: Deep void blacks, cyan accent, persona-specific colors
- **Typography**: Syne (display) + JetBrains Mono (data/terminal)
- **Effects**: Scanline overlay, grid background, glow shadows, animated rings
- **Animations**: Float-up, pulse-glow, spin-slow, shimmer

---

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Styling**: Tailwind CSS 4 with `@theme` tokens
- **AI**: Groq API · `llama-3.3-70b-versatile` (free tier)
- **Streaming**: Server-Sent Events (SSE) via `TransformStream`
- **Icons**: Lucide React
- **Language**: TypeScript 5

---

## 🚢 Deploy to Vercel

```bash
npm run build
vercel deploy
```

Add `ANTHROPIC_API_KEY` to your Vercel environment variables.

---

## 📄 License

MIT
