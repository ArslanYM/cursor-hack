"use client";

import { Users, Heart, Zap } from "lucide-react";

export function CommunityStories() {
  const impacts = [
    {
      icon: Users,
      number: "15,000+",
      description: "Farmers across Kashmir, Punjab, Haryana, and beyond now have access to real-time market information.",
    },
    {
      icon: Heart,
      number: "₹3.2 Crore",
      description: "Fair income gained directly by farmers—money that went into education, healthcare, better seeds, and family security.",
    },
    {
      icon: Zap,
      number: "85%",
      description: "Farmers who report improved confidence in their market decisions and reduced stress about fair pricing.",
    },
  ];

  return (
    <section className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-kv-bg via-kv-accent/5 to-kv-bg">
      <div className="max-w-6xl mx-auto">
        {/* Section intro */}
        <div className="text-center space-y-6 mb-20">
          <p className="text-sm uppercase tracking-widest text-kv-primary font-semibold">
            The Movement
          </p>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-kv-text text-balance">
            It&apos;s bigger than one farmer.
          </h2>
          
          <p className="text-lg text-kv-text/70 max-w-3xl mx-auto leading-relaxed">
            What started as giving farmers a voice has become a movement. Communities are sharing knowledge. Markets are becoming fairer. Futures are being rewritten.
          </p>
        </div>

        {/* Impact metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {impacts.map((impact, idx) => {
            const Icon = impact.icon;
            return (
              <div
                key={idx}
                className="text-center p-8 sm:p-10 rounded-2xl bg-white/50 dark:bg-kv-text/5 border border-kv-accent/20 hover:border-kv-primary/40 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <div className="inline-block p-4 rounded-lg bg-kv-primary/10 mb-6">
                  <Icon className="w-8 h-8 text-kv-primary" />
                </div>
                
                <p className="text-4xl sm:text-5xl font-bold text-kv-primary mb-4">{impact.number}</p>
                <p className="text-lg text-kv-text/70 leading-relaxed">{impact.description}</p>
              </div>
            );
          })}
        </div>

        {/* Community narrative */}
        <div className="space-y-12">
          {/* Village story */}
          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-kv-primary/10 to-kv-accent/5 border border-kv-accent/20 p-8 sm:p-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-kv-text mb-6">
              In one village in Kashmir...
            </h3>
            <p className="text-lg text-kv-text/80 leading-relaxed mb-4">
              Five farmers from different families started using KisanVoice. They began sharing market information. They formed a small cooperative to negotiate better. The brokers noticed—prices got fairer. Within months, 23 farmers joined. Now, 120+ farmers in that region earn 40% more than before. Schools have better attendance. Young people are staying in farming instead of migrating to cities.
            </p>
            <p className="text-lg font-semibold text-kv-primary">
              One voice. Then a chorus.
            </p>
          </div>

          {/* Region story */}
          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-kv-accent/10 to-kv-primary/5 border border-kv-primary/20 p-8 sm:p-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-kv-text mb-6">
              Across Punjab...
            </h3>
            <p className="text-lg text-kv-text/80 leading-relaxed mb-4">
              Agricultural extension officers are now recommending KisanVoice to farmers. Cooperatives are using it to make collective sales decisions. Young farmers view it as essential—like soil or water. The practice of farming is being transformed not through corporate intervention, but through farmers taking control of their own narratives.
            </p>
            <p className="text-lg font-semibold text-kv-primary">
              System change starts with giving farmers tools.
            </p>
          </div>
        </div>

        {/* Closing call */}
        <div className="mt-16 sm:mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-kv-primary/20 via-kv-primary/10 to-transparent border border-kv-primary/30">
          <p className="text-xl sm:text-2xl text-center text-kv-text leading-relaxed text-balance">
            This is what happens when you trust farmers with information, tools built in their language, and the respect they&apos;ve always deserved.
          </p>
        </div>
      </div>
    </section>
  );
}
