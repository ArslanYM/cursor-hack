# KisanVoice

Voice-first agricultural intelligence for Kashmir’s farmers: tap the mic, ask in **Kashmiri**, **Hindi**, or **English**, and get live mandi context, NH44 logistics-aware tips, and a daily Intel briefing—without typing through complex portals.

## Demo video

https://github.com/user-attachments/assets/dd3e3bdc-c4d7-4c4b-9cfc-0d8d3fdc8244



---

## Stack

| Layer | Tech |
|-------|------|
| App | [Next.js 16](https://nextjs.org) (App Router), React 19, Tailwind CSS 4 |
| Backend | [Convex](https://convex.dev) (queries, mutations, real-time) |
| Auth | [Clerk](https://clerk.com) |
| Voice / LLM | [Groq](https://groq.com) (Whisper transcription + Llama JSON) |
| Web search | [Exa](https://exa.ai) (neural search snippets for Ask + Intel streams) |
| Deep page extract (optional) | [Apify](https://apify.com) [Website Content Crawler](https://apify.com/apify/website-content-crawler) — after Exa returns URLs, Convex may sync-crawl **one** prioritized page (e.g. `gov.in` / mandi links) so Groq sees fuller text than snippets alone. **Intel** still uses Exa-only. |

### Voice Ask pipeline (high level)

1. Audio → Groq Whisper → transcript  
2. **Exa** searches for mandi / price context; **Exa** also powers NH44 lookup in parallel  
3. If `APIFY_API_TOKEN` is set in Convex, **Apify** runs on the best candidate URL from Exa results  
4. **Groq** structures the combined text into the price card JSON  

If Apify is disabled or fails, the flow falls back to Exa + Groq only.

## Prerequisites

- Node.js 20+ (see `.nvmrc` if present)
- A Convex project (`npx convex dev`)
- Clerk application keys for Next.js

## Local development

```bash
npm install
npx convex dev
```

In another terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Useful scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run production server locally |
| `npm run lint` | ESLint |

## Environment

Copy `.env.example` to `.env.local` for Next.js (Convex URL, Clerk keys). **AI secrets live on Convex**, not in the browser:

| Variable | Where | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | `.env.local` + Vercel | Convex WebSocket URL for the client |
| `GROQ_API_KEY` | Convex dashboard / `npx convex env set` | Whisper + chat |
| `EXA_API_KEY` | Convex | Web search |
| `APIFY_API_TOKEN` | Convex (optional) | Deep mandi page extract for voice Ask |
| `CLERK_JWT_ISSUER_DOMAIN` | Convex | Clerk → Convex auth |

```bash
npx convex env set GROQ_API_KEY ...
npx convex env set EXA_API_KEY ...
npx convex env set APIFY_API_TOKEN apify_api_...   # optional
```

Never commit real secrets. See `.env.example` for placeholders.

## Theming

The app supports **light** and **dark** mode (toggle in the UI). Preference is stored in `localStorage` under `kisanvoice-theme`.

## Deploy

Deploy the Next.js app to [Vercel](https://vercel.com) (or your host of choice) and point Convex + Clerk to the production URLs.

## License

Private / all rights reserved unless otherwise specified by the repository owner.
