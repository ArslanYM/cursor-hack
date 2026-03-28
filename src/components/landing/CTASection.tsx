"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export function CTASection() {
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
    <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-gradient-to-br from-kv-primary/10 via-kv-primary/5 to-transparent rounded-3xl border border-kv-primary/20 p-8 sm:p-12 lg:p-16 text-center">
          {/* Decorative elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-kv-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-kv-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-kv-text mb-4 tracking-tight">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-lg text-kv-text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of farmers across Kashmir who are already using KisanVoice to make smarter farming decisions and increase their income.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-kv-primary text-white font-semibold rounded-full hover:bg-kv-primary/90 transition-all active:scale-95 shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-kv-surface text-kv-text font-semibold rounded-full hover:bg-kv-surface-hover transition-colors border border-kv-border/30"
            >
              Learn More
            </a>
          </div>

          <p className="text-sm text-kv-text-muted mt-6">
            No credit card required. Start exploring in minutes.
          </p>
        </div>
      </div>
    </section>
  );
}
