"use client";

import { AlertTriangle, TrendingDown, Clock, Lock } from "lucide-react";

export function RealStruggles() {
  const struggles = [
    {
      icon: Lock,
      title: "Information Gatekeepers",
      story: "Farmers get prices hours or days late. Middlemen have real-time data. The asymmetry is intentional. Profit depends on farmer ignorance.",
    },
    {
      icon: TrendingDown,
      title: "Exploited at Every Step",
      story: "A tomato worth ₹40 in Delhi sells for ₹3 to the farmer. The margins are stolen by layers of middlemen. Technology never reaches them.",
    },
    {
      icon: Clock,
      title: "Time Stolen, Decisions Rushed",
      story: "Farmers have no time to research. Livestock to tend, fields to manage, families to feed. When the broker calls, they take the first offer.",
    },
    {
      icon: AlertTriangle,
      title: "Tech Built for Others",
      story: "Indian farmers don't speak English. Websites require reading. Apps need internet. Technology was designed by people who forgot to ask farmers what they actually need.",
    },
  ];

  return (
    <section className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-kv-bg via-kv-bg to-kv-bg">
      <div className="max-w-6xl mx-auto">
        {/* Section intro */}
        <div className="text-center space-y-6 mb-16">
          <p className="text-sm uppercase tracking-widest text-kv-primary font-semibold">
            The Reality
          </p>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-kv-text text-balance">
            Rigged against them.
          </h2>
          
          <p className="text-lg text-kv-text/70 max-w-3xl mx-auto leading-relaxed">
            It&apos;s not laziness. It&apos;s not inability. It&apos;s a system designed to keep farmers in the dark. Here&apos;s the real struggle.
          </p>
        </div>

        {/* Struggles timeline */}
        <div className="space-y-6 lg:space-y-8">
          {struggles.map((struggle, idx) => {
            const Icon = struggle.icon;
            return (
              <div
                key={idx}
                className="group relative p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-kv-primary/5 to-transparent border border-kv-primary/20 hover:border-kv-primary/40 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex gap-6 sm:gap-8">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-red-500/10">
                      <Icon className="w-7 h-7 text-red-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-kv-text mb-2">{struggle.title}</h3>
                    <p className="text-kv-text/70 leading-relaxed text-lg">{struggle.story}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* The cost */}
        <div className="mt-16 sm:mt-20 p-8 sm:p-12 rounded-2xl border-2 border-red-500/30 bg-red-500/5">
          <div className="text-center space-y-4">
            <p className="text-sm uppercase tracking-widest text-red-600 font-semibold">The Price</p>
            <p className="text-3xl sm:text-4xl font-bold text-kv-text">
              ₹2+ Lakhs Lost Per Year
            </p>
            <p className="text-lg text-kv-text/70 max-w-2xl mx-auto">
              That&apos;s the average income a farmer loses due to information gaps and market exploitation. That&apos;s school fees. That&apos;s food security. That&apos;s dignity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
