"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, Volume2 } from "lucide-react";

export function HeroStory() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/(authenticated)");
    } else {
      router.push("/sign-up");
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-kv-bg via-kv-bg to-kv-accent/10 flex items-center justify-center">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-kv-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-kv-primary rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-20 sm:py-32">
        <div className="text-center space-y-8">
          {/* Overline */}
          <div className="inline-block">
            <span className="text-sm font-semibold text-kv-primary uppercase tracking-wider">
              Celebrating Our Farmers
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-pretty text-kv-text">
            Every Voice Deserves to Be Heard
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl leading-relaxed text-kv-text/80 text-pretty max-w-2xl mx-auto">
            Meet the backbone of our nation. Kashmiri and Indian farmers have sustained civilizations through centuries. Today, they deserve technology that respects their wisdom, speaks their language, and empowers their decisions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <button
              onClick={handleGetStarted}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-kv-primary text-white font-semibold rounded-lg hover:bg-kv-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-kv-primary text-kv-primary font-semibold rounded-lg hover:bg-kv-primary/10 transition-colors duration-300">
              <Volume2 className="w-5 h-5" />
              Listen to Our Story
            </button>
          </div>

          {/* Trust indicators */}
          <div className="pt-12 border-t border-kv-accent/20">
            <p className="text-sm text-kv-text/60 mb-4">Trusted by farming communities across</p>
            <div className="flex justify-center items-center gap-8 flex-wrap text-sm font-semibold text-kv-text/70">
              <span>Kashmir Valley</span>
              <span className="w-1 h-1 rounded-full bg-kv-text/30"></span>
              <span>Punjab</span>
              <span className="w-1 h-1 rounded-full bg-kv-text/30"></span>
              <span>Haryana</span>
              <span className="w-1 h-1 rounded-full bg-kv-text/30"></span>
              <span>Rajasthan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
