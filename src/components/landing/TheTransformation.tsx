"use client";

import { Volume2, Globe, TrendingUp, Lightbulb } from "lucide-react";

export function TheTransformation() {
  const principles = [
    {
      icon: Volume2,
      title: "Their Language, Their Voice",
      description: "Speak in Kashmiri. Ask in Urdu. Think in Hindi. The technology adapts to you, not the other way around. Your language is your power.",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Market Truth",
      description: "Know prices as they happen. See what mandi traders are buying today. Understand demand across regions. No delays. No filters. Just facts.",
    },
    {
      icon: Globe,
      title: "Direct to Markets",
      description: "Connect with fair-price buyers instead of exploitative middlemen. Reduce layers. Increase income. Build relationships based on mutual respect.",
    },
    {
      icon: Lightbulb,
      title: "Smart Farming, Respectfully",
      description: "Weather forecasts. Crop intelligence. Optimal planting times. Technology that understands farming, not technology imposed on farmers.",
    },
  ];

  return (
    <section className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-kv-bg via-kv-bg to-kv-primary/5">
      <div className="max-w-6xl mx-auto">
        {/* Section intro */}
        <div className="text-center space-y-6 mb-16">
          <p className="text-sm uppercase tracking-widest text-kv-primary font-semibold">
            How It Works
          </p>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-kv-text text-balance">
            Technology built with respect.
          </h2>
          
          <p className="text-lg text-kv-text/70 max-w-3xl mx-auto leading-relaxed">
            Not designed in boardrooms by people who don&apos;t understand farming. Built with farmers. For farmers. By people who listen.
          </p>
        </div>

        {/* The transformation approach */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {principles.map((principle, idx) => {
            const Icon = principle.icon;
            return (
              <div key={idx} className="relative group">
                {/* Card */}
                <div className="relative p-8 sm:p-10 rounded-2xl bg-white/40 dark:bg-kv-text/5 border border-kv-accent/20 group-hover:border-kv-primary/40 transition-all duration-300 h-full">
                  {/* Icon */}
                  <div className="inline-block p-3 rounded-lg bg-kv-primary/10 group-hover:bg-kv-primary/20 transition-colors mb-6">
                    <Icon className="w-8 h-8 text-kv-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-kv-text mb-4">{principle.title}</h3>
                  <p className="text-kv-text/70 leading-relaxed text-lg">{principle.description}</p>

                  {/* Animated line */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-kv-primary to-kv-accent group-hover:w-12 transition-all duration-300 rounded-full"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* The bigger picture */}
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-kv-primary/20 via-kv-primary/10 to-transparent border border-kv-primary/30 p-8 sm:p-12 lg:p-16">
          <div className="max-w-3xl space-y-6">
            <p className="text-sm uppercase tracking-widest text-kv-primary font-semibold">
              The Real Change
            </p>
            
            <h3 className="text-3xl sm:text-4xl font-bold text-kv-text leading-tight">
              This isn&apos;t just an app. It&apos;s a movement to reclaim farmer agency.
            </h3>

            <p className="text-lg text-kv-text/80 leading-relaxed">
              When farmers have information, they have power. When they speak their language, they feel heard. When technology works for them, not against them, they succeed. This is about giving millions of farmers what they&apos;ve always deserved: respect, access, and a fair shot.
            </p>

            <div className="pt-8 border-t border-kv-primary/20 flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-kv-primary"></div>
              <p className="text-kv-text font-semibold">
                Join farmers building a fairer agriculture ecosystem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
