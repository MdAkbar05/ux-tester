# 🔍 Real-Time Website UX Tester

> AI + Human Simulation — discover where users get confused before they abandon your site.

![Tech Stack](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Groq](https://img.shields.io/badge/Groq-ff6b00)
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
