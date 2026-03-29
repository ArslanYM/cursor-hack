"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  ArrowRight,
  BarChart3,
  Globe2,
  Loader2,
  Mic,
  Shield,
  Sparkles,
  Truck,
  Wheat,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice-first answers",
    description:
      "Tap the mic and ask in Kashmiri, Hindi, or English. KisanVoice transcribes your question and returns mandi prices, trends, and practical guidance tailored to your crops.",
    accent: "from-emerald-400/20 to-lime-300/10",
  },
  {
    icon: Zap,
    title: "Field intelligence",
    description:
      "Switch to Intel for a morning briefing sourced from weather, NH44 highway status, government subsidies, pest alerts, and market sentiment — refreshed when you need it.",
    accent: "from-amber-400/15 to-yellow-300/5",
  },
  {
    icon: Globe2,
    title: "Multilingual by design",
    description:
      "Choose your language during onboarding. The interface and key content adapt, with Kashmiri script support where it matters for farmers in the Valley.",
    accent: "from-sky-400/15 to-cyan-300/5",
  },
  {
    icon: Shield,
    title: "Your account, your history",
    description:
      "Sign in securely to sync queries and preferences across devices. Your voice queries and intel stay tied to your profile.",
    accent: "from-violet-400/15 to-purple-300/5",
  },
] as const;

const highlights = [
  { icon: BarChart3, label: "Live mandi-style price cards with confidence" },
  { icon: Truck, label: "Highway and logistics context when relevant" },
  { icon: Sparkles, label: "AI-powered briefings from multiple signals" },
];

export function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/app");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) {
    return (
      <div className="font-sans min-h-screen flex items-center justify-center bg-[#050806] text-zinc-100">
        <div className="text-center">
          <Wheat
            className="w-14 h-14 text-emerald-400 mx-auto mb-4 animate-pulse"
            strokeWidth={2}
          />
          <Loader2 className="w-8 h-8 text-emerald-400/80 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-[#050806] text-zinc-100 antialiased overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(52,211,153,0.22),transparent)]" />
        <div className="absolute top-0 left-1/4 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-lime-400/8 blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='0.04'%3E%3Cpath d='M0 24h48M24 0v48'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050806]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-white transition-opacity hover:opacity-90"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/25 to-lime-400/10 ring-1 ring-white/10">
              <Wheat className="h-5 w-5 text-emerald-300" strokeWidth={2.5} />
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              KisanVoice
            </span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <a
              href="#features"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:inline"
            >
              Features
            </a>
            <Link
              href="/sign-in"
              className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-lime-400 px-5 py-2.5 text-sm font-bold text-emerald-950 shadow-[0_0_40px_-8px_rgba(52,211,153,0.55)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Get started
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pt-24 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/90">
              <Sparkles className="h-3.5 w-3.5" />
              Voice · Intel · Kashmir
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
              The farmer&apos;s voice,
              <span className="block bg-gradient-to-r from-emerald-200 via-lime-200 to-emerald-400 bg-clip-text text-transparent">
                amplified by AI
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
              KisanVoice is a voice-first assistant for mandi prices, crop
              intelligence, and daily briefings — built for farmers in Jammu &
              Kashmir and beyond.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-lime-400 px-8 py-4 text-base font-bold text-emerald-950 shadow-[0_12px_48px_-12px_rgba(52,211,153,0.55)] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
              >
                Create free account
                <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
              </Link>
              <a
                href="#features"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 sm:w-auto"
              >
                Explore the product
              </a>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-3 sm:grid-cols-3">
            {highlights.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-left text-sm font-medium text-zinc-300"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                {label}
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="scroll-mt-24 border-t border-white/[0.06] bg-[#060a08]/80 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Everything in one flow
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                Four pillars that make KisanVoice more than a chatbot —
                structured for real field decisions.
              </p>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {features.map(({ icon: Icon, title, description, accent }) => (
                <article
                  key={title}
                  className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.05] to-transparent p-8 transition-shadow hover:shadow-[0_0_0_1px_rgba(52,211,153,0.15)]"
                >
                  <div
                    className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${accent} blur-2xl opacity-70 transition-opacity group-hover:opacity-100`}
                  />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20">
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <h3 className="relative mt-6 text-xl font-extrabold text-white">
                    {title}
                  </h3>
                  <p className="relative mt-3 leading-relaxed text-zinc-400">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready when you are
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                Create an account, sign in on any device, and land in the app
                with language onboarding and the full mic + intel experience.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-lime-400 px-10 py-4 text-base font-bold text-emerald-950 shadow-[0_12px_48px_-12px_rgba(52,211,153,0.55)] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
                >
                  Sign up free
                  <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-white/20 px-10 py-4 text-base font-semibold text-white transition-colors hover:bg-white/5 sm:w-auto"
                >
                  I already have an account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-zinc-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <Wheat className="h-4 w-4 text-emerald-500/80" />
            <span className="font-semibold text-zinc-400">
              KisanVoice
            </span>
          </div>
          <p className="text-center">
            Voice-first AI for farmers — mandi prices, intel, and briefings.
          </p>
        </div>
      </footer>
    </div>
  );
}
