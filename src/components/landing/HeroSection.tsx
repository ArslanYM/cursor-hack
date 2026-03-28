"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Wheat, Mic, TrendingUp, ArrowRight } from "lucide-react";

export function HeroSection() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const handleGetStarted = useCallback(() => {
    if (isLoaded) {
      if (user) {
        router.push("/(authenticated)");
      } else {
        router.push("/sign-up");
      }
    }
  }, [isLoaded, user, router]);

  return (
    <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-kv-primary/5 via-transparent to-transparent opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-kv-text tracking-tight text-balance">
                Your Voice,
                <span className="block text-kv-primary">Your Market</span>
              </h1>
              <p className="text-lg sm:text-xl text-kv-text-muted leading-relaxed text-balance">
                Real-time mandi prices, weather alerts, and farming insights—all accessible through your voice in Kashmiri, Hindi, or Urdu. Empowering Kashmir&apos;s farmers with AI-driven intelligence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleGetStarted}
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-kv-primary text-white font-semibold rounded-full hover:bg-kv-primary/90 transition-all active:scale-95 shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-kv-surface text-kv-text font-semibold rounded-full hover:bg-kv-surface-hover transition-colors border border-kv-border/30"
              >
                Learn More
              </a>
            </div>

            {/* Social Proof */}
            <div className="pt-6 border-t border-kv-border/15">
              <p className="text-sm text-kv-text-muted mb-4">
                Trusted by farmers across Kashmir
              </p>
              <div className="flex flex-wrap gap-6">
                <div>
                  <div className="text-2xl font-bold text-kv-primary">10K+</div>
                  <div className="text-sm text-kv-text-muted">Active Farmers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-kv-primary">50+</div>
                  <div className="text-sm text-kv-text-muted">Crops Tracked</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-kv-primary">24/7</div>
                  <div className="text-sm text-kv-text-muted">Voice Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block">
            <div className="relative bg-gradient-to-br from-kv-primary/10 to-kv-primary/5 rounded-3xl p-8 border border-kv-border/20 backdrop-blur-sm">
              {/* Animated elements */}
              <div className="space-y-6">
                {/* Microphone Icon */}
                <div className="flex items-center justify-center w-20 h-20 mx-auto bg-kv-primary/20 rounded-full animate-pulse">
                  <Mic className="w-10 h-10 text-kv-primary" strokeWidth={2} />
                </div>

                {/* Feature cards inside hero visual */}
                <div className="space-y-4">
                  <div className="bg-kv-surface/50 backdrop-blur rounded-2xl p-4 border border-kv-border/20 flex items-start gap-3 group hover:bg-kv-surface/70 transition-colors">
                    <TrendingUp className="w-5 h-5 text-kv-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm text-kv-text">Live Market Prices</div>
                      <div className="text-xs text-kv-text-muted">Updated in real-time</div>
                    </div>
                  </div>

                  <div className="bg-kv-surface/50 backdrop-blur rounded-2xl p-4 border border-kv-border/20 flex items-start gap-3 group hover:bg-kv-surface/70 transition-colors">
                    <Wheat className="w-5 h-5 text-kv-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm text-kv-text">Crop Insights</div>
                      <div className="text-xs text-kv-text-muted">AI-powered recommendations</div>
                    </div>
                  </div>

                  <div className="bg-kv-surface/50 backdrop-blur rounded-2xl p-4 border border-kv-border/20 flex items-start gap-3 group hover:bg-kv-surface/70 transition-colors">
                    <Mic className="w-5 h-5 text-kv-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm text-kv-text">Voice-First Design</div>
                      <div className="text-xs text-kv-text-muted">No typing required</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
