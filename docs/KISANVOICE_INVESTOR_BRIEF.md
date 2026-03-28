# KisanVoice — Investor & Partner Brief

*Copy this file into Notion (import Markdown or paste). Adjust numbers and traction before sending.*

---

## One-line pitch

**KisanVoice is a voice-first agricultural intelligence app for Kashmir’s farmers** — tap the mic, ask in Kashmiri, Hindi, or English, and get **live mandi prices**, **NH44 highway logistics**, and a **daily “Intel” briefing** (weather, subsidies, pests, market mood) without typing or navigating complex websites.

---

## The problem we solve (societal pain points)

| Pain point | Why it hurts | What KisanVoice does |
|------------|--------------|----------------------|
| **Digital & literacy divide** | Many farmers don’t type comfortably or read English-heavy portals. | **Voice-first** flow: speak naturally; answers show as simple cards + local scripts. |
| **Fragmented information** | Prices, road status, weather, subsidies, and pest news live in different sites and groups. | **One app**: Chat for on-demand prices; **Intel** tab for a **morning-style briefing** built from multiple live web sources. |
| **Logistics risk (NH44)** | Srinagar–Jammu highway status changes harvest and transport decisions for perishables. | **Explicit highway context** in answers — if the road is bad/closed, advice reflects **don’t harvest perishables yet** when relevant. |
| **Language exclusion** | Critical agri info is often English-first. | **Kashmiri (Nastaliq), Hindi, English** in UI and structured AI outputs where designed. |
| **Trust & timeliness** | Rumour-driven WhatsApp vs verified-ish web signals. | Pipeline uses **retrieval (Exa) + reasoning (Groq)** so responses are **grounded in current web text**, not pure hallucination. |

---

## Product (what ships today)

- **Voice chat (“Ask”)** — Record → **Groq Whisper** transcription → **Exa** search (mandi + context) → **Groq Llama** JSON → **price cards** with confidence, trend hints, and highway-aware tips.
- **Intel (“Morning briefing”)** — Parallel **Exa** streams (weather/news, **NH44**, subsidies, pests, market sentiment) → **Groq** synthesizes a **structured JSON briefing** (multi-language fields + alerts). Stored in **Convex** for history and offline-friendly patterns.
- **Onboarding & settings** — Language choice (Kashmiri / Hindi / English), persisted per user.
- **Auth & data** — **Clerk** sign-in; **Convex** stores users, queries, briefings, and alerts with **real-time** updates to the client.

---

## Technology stack (exactly what we use)

### Core platform

| Layer | Technology | Role in KisanVoice |
|-------|------------|----------------------|
| **Frontend** | **Next.js 16**, **React 19**, **Tailwind CSS 4** | App Router UI, fast deploy (e.g. Vercel), mobile-friendly layout. |
| **Backend + DB** | **Convex** | Queries, mutations, **actions** (Node) for AI pipelines; **live subscriptions** so UI updates without manual refresh. |
| **Auth** | **Clerk** + **Convex** JWT bridge | `ConvexProviderWithClerk` — secure identity on every server function. |

### AI & data services

| Partner | Role | How we use it (from code + `DOCUMENTATION.md`) |
|---------|------|-----------------------------------------------|
| **Groq** | Ultra-fast inference | **Whisper**-class **audio transcription**; **Llama** chat completions to **structure JSON** (prices, briefing, pest help). Shared **`groqClient`** with **multi-model fallbacks** (e.g. 70B → 8B) on rate limits; **JSON-mode** for reliable fields. |
| **Exa** | AI-native web search | **Neural search** over the open web for mandi prices, highway status, and **five briefing streams** (weather/news, highway, subsidies, pests, sentiment). Results are **text snippets** fed to Groq for synthesis — not raw page HTML in the UI. |
| **Apify** | Targeted page extract (optional) | **Website Content Crawler** (sync API) on **one** prioritized URL after Exa (prefers `gov.in` / Agmarknet / mandi-style links) to append **full-page text** for the **voice Ask** pipeline when `APIFY_API_TOKEN` is set. Intel briefing still uses **Exa-only** snippets. |

### Other notable implementation choices

- **Lucide** icons; **Noto** + **Nastaliq** fonts for script coverage.
- **Service worker** (production): caching strategy tuned so **Next.js chunks** stay fresh; dev avoids SW to protect Turbopack/HMR.
- **Convex env**: `GROQ_API_KEY`, `EXA_API_KEY`, Clerk/Convex URLs — secrets stay server-side; `NEXT_PUBLIC_CONVEX_URL` on the client.

---

## How the product flow works (investor-friendly)

1. **Speak** — Farmer asks e.g. *“Sopore apple rate?”*  
2. **Transcribe (Groq)** — Audio → text.  
3. **Retrieve (Exa)** — Pull relevant web excerpts (prices + NH44).  
4. **Reason (Groq)** — Turn messy text into **one JSON** the app can render (price, confidence, highway block, Kashmiri/Hindi fields).  
5. **Persist & sync (Convex)** — Save query/briefing; **live UI** updates.

Intel briefing repeats the pattern with **parallel Exa calls** and a **single synthesis** step — with **fallback** to Exa-only text if Groq is temporarily unavailable.

---

## Building with **Cursor AI** (how we shipped faster)

Cursor is an **AI-assisted IDE** (chat + codebase-aware edits) used in this project to:

- **Navigate a large Next.js + Convex codebase** — refactor, split modules (`kisan-i18n`, onboarding, settings), and keep types aligned with Convex generated APIs.
- **Implement production hardening** — e.g. Convex URL resolution for **static prerender**, **Groq** fallback models, **rate-limit** handling, and **safe persistence** for briefings.
- **Iterate on UX** — language onboarding, Intel tab, and navbar patterns without rewriting the whole app each time.

*Positioning for investors:* this is **leverage**, not a replacement for product judgment — **domain focus (Kashmir agri + voice)** and **evaluation of AI outputs** remain founder-led.

---

## Why this matters commercially

- **Large addressable need** — hundreds of millions of smallholders globally face the same **voice + fragmentation + local language** gap; Kashmir is a **focused wedge** with **clear logistics and language requirements**.
- **Composable AI stack** — **Groq + Exa + Convex** keeps **latency and cost** observable; swap models or add **Apify** for government sites without changing the whole architecture.
- **Defensibility** — **Workflow + UX + trust** (highway logic, briefing design, Kashmiri copy) more than any single API call.

---

## Roadmap hooks (honest)

- **Apify (or similar)** for **mandatory** government portals where search isn’t enough.
- Deeper **offline** / low-connectivity UX.
- **Regional expansion** with same stack, different prompts and sources.

---

## Due diligence checklist

- [ ] Convex production env: `GROQ_API_KEY`, `EXA_API_KEY`, Clerk JWT issuer.  
- [ ] Vercel (or host): `NEXT_PUBLIC_CONVEX_URL`, Clerk keys.  
- [ ] Groq **tier** suitable for **daily briefing + voice traffic** (TPD/RPM).  

---

*Source: `DOCUMENTATION.md`, `README.md`, `convex/*.ts`, `src/app/page.tsx`, `src/app/kisan-i18n.ts` — aligned with the codebase as of the doc date.*
