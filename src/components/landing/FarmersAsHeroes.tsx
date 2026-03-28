"use client";

import { Wheat, Cloud, Droplets, Sun } from "lucide-react";

export function FarmersAsHeroes() {
  const heroicQualities = [
    {
      icon: Wheat,
      title: "Wisdom of Generations",
      description: "Knowledge passed down through centuries of cultivating the land, understanding soil, seasons, and cycles that sustain us all.",
    },
    {
      icon: Droplets,
      title: "Resilience in Adversity",
      description: "Every failed harvest, every drought, every market crash—they persevere. They adapt. They try again.",
    },
    {
      icon: Cloud,
      title: "Stewards of the Earth",
      description: "They don't just grow crops. They nurture ecosystems. They understand that the land is sacred and must be protected.",
    },
    {
      icon: Sun,
      title: "Foundation of Civilization",
      description: "From sunrise to sunset, their labor feeds our families, our cities, our entire nation. Without them, nothing exists.",
    },
  ];

  return (
    <section className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-kv-primary/5 to-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Section intro */}
        <div className="text-center space-y-6 mb-16">
          <p className="text-sm uppercase tracking-widest text-kv-primary font-semibold">
            Who They Really Are
          </p>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-kv-text text-balance">
            Not farmers. Heroes.
          </h2>
          
          <p className="text-lg text-kv-text/70 max-w-3xl mx-auto leading-relaxed">
            Every farmer is an entrepreneur, a scientist, a visionary. They manage risk, read the market, adapt to nature&apos;s chaos. They deserve recognition. They deserve tools. They deserve respect.
          </p>
        </div>

        {/* Hero qualities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {heroicQualities.map((quality, idx) => {
            const Icon = quality.icon;
            return (
              <div
                key={idx}
                className="group relative p-8 sm:p-10 rounded-2xl bg-white/50 dark:bg-kv-text/5 border border-kv-accent/20 hover:border-kv-primary/40 transition-all duration-300 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="inline-block p-3 rounded-lg bg-kv-primary/10 group-hover:bg-kv-primary/20 transition-colors mb-6">
                  <Icon className="w-8 h-8 text-kv-primary" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-kv-text mb-3">{quality.title}</h3>
                <p className="text-kv-text/70 leading-relaxed text-lg">{quality.description}</p>

                {/* Accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-kv-primary group-hover:w-12 transition-all duration-300 rounded-full"></div>
              </div>
            );
          })}
        </div>

        {/* Closing statement */}
        <div className="mt-16 sm:mt-20 p-8 sm:p-12 rounded-2xl bg-kv-primary/10 border border-kv-primary/20">
          <p className="text-xl sm:text-2xl text-center text-kv-text leading-relaxed">
            Every decision a farmer makes ripples through families, communities, and the food on your table. They are not invisible. They are essential. And they deserve a voice.
          </p>
        </div>
      </div>
    </section>
  );
}
