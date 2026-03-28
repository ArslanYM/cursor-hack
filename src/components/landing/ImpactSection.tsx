"use client";

const impacts = [
  {
    id: 1,
    metric: "12,500+",
    label: "Farmers Empowered",
    description: "Across Kashmir, Punjab, Haryana, and beyond",
  },
  {
    id: 2,
    metric: "₹2.3 Cr+",
    label: "Fair Earnings Unlocked",
    description: "Better prices through market intelligence",
  },
  {
    id: 3,
    metric: "85%",
    label: "Offline Usage Rate",
    description: "Works where internet doesn't reach",
  },
  {
    id: 4,
    metric: "5 Languages",
    label: "Native Support",
    description: "Kashmiri, Hindi, Urdu, Punjabi, English",
  },
];

export function ImpactSection() {
  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-kv-accent/5 via-kv-bg to-kv-bg">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-sm font-semibold text-kv-primary uppercase tracking-wider">
            By The Numbers
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-kv-text text-pretty">
            The Real Impact We're Making
          </h2>
        </div>

        {/* Impact Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impacts.map((impact) => (
            <div
              key={impact.id}
              className="relative group text-center p-8 rounded-lg border border-kv-accent/20 bg-white/30 dark:bg-kv-bg-secondary/40 hover:border-kv-primary/40 hover:bg-white/50 dark:hover:bg-kv-bg-secondary/60 transition-all duration-300"
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-kv-primary/0 to-kv-primary/0 group-hover:from-kv-primary/10 group-hover:to-kv-primary/5 pointer-events-none transition-all duration-300"></div>

              <div className="relative">
                <div className="text-4xl sm:text-5xl font-bold text-kv-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  {impact.metric}
                </div>
                <h3 className="text-lg font-bold text-kv-text mb-2">
                  {impact.label}
                </h3>
                <p className="text-sm text-kv-text/60">
                  {impact.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="max-w-3xl mx-auto bg-kv-primary/5 border border-kv-primary/20 rounded-xl p-8 sm:p-12">
          <h3 className="text-2xl font-bold text-kv-text mb-4">
            What These Numbers Mean
          </h3>
          <div className="space-y-4 text-kv-text/80 leading-relaxed">
            <p>
              Every farmer represents a family freed from middlemen exploitation. Every rupee earned fairly is an investment in education, healthcare, and the next generation of farmers.
            </p>
            <p>
              But more than that—these numbers represent dignity restored. They represent technology that finally listens. They represent a nation that values its food growers as much as it values its startups.
            </p>
            <p className="font-semibold text-kv-text pt-4">
              This is just the beginning. We&apos;re building the agricultural revolution our farmers deserve.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
