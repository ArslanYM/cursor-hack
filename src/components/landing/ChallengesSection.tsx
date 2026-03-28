"use client";

import { AlertTriangle, Clock, Globe, Smartphone } from "lucide-react";

const challenges = [
  {
    id: 1,
    icon: AlertTriangle,
    title: "Information Barriers",
    description:
      "Most agricultural apps and websites are in English or Hindi. Kashmiri, Punjabi, and regional language farmers are left behind, struggling to access critical information that could transform their lives.",
  },
  {
    id: 2,
    icon: Clock,
    title: "Time & Accessibility",
    description:
      "Farmers work dawn to dusk. Traditional interfaces require reading lengthy screens. Elderly farmers who never learned digital literacy are excluded from modern agricultural benefits.",
  },
  {
    id: 3,
    icon: Smartphone,
    title: "Technology Gap",
    description:
      "Rural connectivity is inconsistent. Solutions designed for urban users fail in villages. Farmers need technology that works offline and respects their bandwidth constraints.",
  },
  {
    id: 4,
    icon: Globe,
    title: "Market Exploitation",
    description:
      "Without real-time price information, farmers are vulnerable to middlemen. They have no bargaining power and often sell at 40-60% below market rates, trapped by information asymmetry.",
  },
];

export function ChallengesSection() {
  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-kv-bg to-kv-accent/5">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-sm font-semibold text-kv-primary uppercase tracking-wider">
            The Reality
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-kv-text text-pretty">
            Challenges Our Farmers Face
          </h2>
          <p className="text-lg text-kv-text/70 max-w-2xl mx-auto">
            These are not abstract problems. They directly impact livelihoods, food security, and the future of agriculture.
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {challenges.map((challenge) => {
            const IconComponent = challenge.icon;
            return (
              <div
                key={challenge.id}
                className="group relative bg-white/40 dark:bg-kv-bg-secondary/60 rounded-lg p-8 border border-kv-text/10 hover:border-kv-primary/30 transition-all duration-300"
              >
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-kv-primary/5 rounded-full blur-2xl group-hover:bg-kv-primary/10 transition-colors opacity-0 group-hover:opacity-100"></div>

                <div className="relative">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-kv-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-kv-primary/20 transition-colors">
                    <IconComponent className="w-7 h-7 text-kv-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-kv-text mb-3">
                    {challenge.title}
                  </h3>
                  <p className="text-kv-text/75 leading-relaxed">
                    {challenge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-kv-primary/10 border border-kv-primary/20 rounded-xl p-8 text-center">
          <p className="text-lg text-kv-text/80 mb-2">
            <span className="font-bold text-kv-text">73% of Indian farmers</span> lack access to timely agricultural information
          </p>
          <p className="text-sm text-kv-text/60">
            This isn't just a technology gap—it's a equity issue. We&apos;re here to close it.
          </p>
        </div>
      </div>
    </section>
  );
}
