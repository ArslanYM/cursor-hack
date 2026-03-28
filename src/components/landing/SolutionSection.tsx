"use client";

import { Mic, TrendingUp, Cloud, Smartphone } from "lucide-react";

const solutions = [
  {
    id: 1,
    icon: Mic,
    title: "Voice-First Design",
    description:
      "No keyboards. No screens filled with text. Just speak in Kashmiri, Hindi, Urdu, or Punjabi. Our AI understands regional dialects and accents, making technology accessible to every generation.",
  },
  {
    id: 2,
    icon: TrendingUp,
    title: "Real-Time Market Intelligence",
    description:
      "Live mandi prices, demand trends, and fair market rates updated every hour. Farmers can negotiate from strength, not desperation. Knowledge equals power.",
  },
  {
    id: 3,
    icon: Cloud,
    title: "Works Offline",
    description:
      "Download critical data once. Use it everywhere—even in areas with no signal. Technology should work where farmers are, not force them to travel for connectivity.",
  },
  {
    id: 4,
    icon: Smartphone,
    title: "Simple & Respectful",
    description:
      "Built by people who understand farming. Not Silicon Valley solutions imposed on rural communities. Every feature serves the farmer's needs, not VC growth metrics.",
  },
];

export function SolutionSection() {
  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-kv-bg">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-sm font-semibold text-kv-primary uppercase tracking-wider">
            Our Approach
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-kv-text text-pretty">
            Technology Designed for Farmers
          </h2>
          <p className="text-lg text-kv-text/70 max-w-2xl mx-auto">
            Not technology imposed on farmers. Built with respect, designed with intention, and refined through countless conversations with farming communities.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {solutions.map((solution) => {
            const IconComponent = solution.icon;
            return (
              <div
                key={solution.id}
                className="relative group bg-gradient-to-br from-white/60 to-white/30 dark:from-kv-bg-secondary/80 dark:to-kv-bg-secondary/40 rounded-xl p-8 border border-kv-accent/20 hover:border-kv-primary/40 transition-all duration-300 hover:shadow-lg"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-kv-primary/0 to-kv-primary/0 group-hover:from-kv-primary/5 group-hover:to-kv-primary/10 rounded-xl transition-all duration-300 pointer-events-none"></div>

                <div className="relative">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-kv-primary/15 rounded-lg flex items-center justify-center mb-6 group-hover:bg-kv-primary/25 transition-colors">
                    <IconComponent className="w-6 h-6 text-kv-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-kv-text mb-3 group-hover:text-kv-primary transition-colors">
                    {solution.title}
                  </h3>
                  <p className="text-kv-text/75 leading-relaxed">
                    {solution.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Emphasis Box */}
        <div className="bg-kv-primary/10 border-l-4 border-kv-primary rounded-lg p-8 max-w-3xl mx-auto">
          <p className="text-lg leading-relaxed text-kv-text">
            <span className="font-bold">This is about dignity.</span> Farmers have sustained our nations for millennia. They deserve technology that respects their intelligence, their language, and their time. Not technology that extracts data and serves ads. Technology that serves them.
          </p>
        </div>
      </div>
    </section>
  );
}
