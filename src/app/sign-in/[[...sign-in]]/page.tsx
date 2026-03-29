import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { ArrowLeft, Wheat } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="font-sans min-h-screen bg-[#050806] flex flex-col items-center justify-center px-5 py-12 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(52,211,153,0.18),transparent)]" />
        <div className="absolute top-1/4 left-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-[80px]" />
      </div>

      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="mb-8 text-center max-w-md">
        <div className="inline-flex items-center gap-2.5 mb-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/25 to-lime-400/10 ring-1 ring-white/10">
            <Wheat className="w-6 h-6 text-emerald-300" strokeWidth={2.5} />
          </span>
          <h1 className="text-[32px] font-extrabold tracking-tight text-white">
            Welcome back
          </h1>
        </div>
        <p className="text-[17px] text-zinc-400 font-medium leading-relaxed">
          Sign in to open KisanVoice — mandi prices, intel, and your voice
          history.
        </p>
      </div>
      <SignIn
        forceRedirectUrl="/app"
        appearance={{
          variables: {
            colorPrimary: "#34d399",
            colorTextOnPrimaryBackground: "#052e16",
            borderRadius: "1rem",
          },
          elements: {
            rootBox: "mx-auto font-sans",
            card: "shadow-2xl rounded-2xl border border-white/10 bg-zinc-900/90 backdrop-blur-xl",
            headerTitle: "text-white",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton:
              "border-white/15 bg-white/5 hover:bg-white/10 text-white",
            formButtonPrimary:
              "bg-gradient-to-r from-emerald-400 to-lime-400 text-emerald-950 font-bold",
            footerActionLink: "text-emerald-400 hover:text-emerald-300",
            identityPreviewText: "text-zinc-300",
            formFieldLabel: "text-zinc-400",
            formFieldInput:
              "bg-zinc-950/80 border-white/10 text-white placeholder:text-zinc-600",
          },
        }}
      />
    </main>
  );
}
