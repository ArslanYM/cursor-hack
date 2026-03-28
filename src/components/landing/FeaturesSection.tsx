"use client";

import { Mic, TrendingUp, Cloud, AlertTriangle, Globe, Zap } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: <Mic className="w-6 h-6" />,
    title: "Voice-First Interaction",
    description: "Ask queries in Kashmiri, Hindi, or Urdu without typing. Get instant answers through voice.",
    color: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Live Mandi Prices",
    description: "Real-time market prices for 50+ crops across Kashmir's major mandis. Never overprice or undersell.",
    color: "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400",
  },
  {
    icon: <Cloud className="w-6 h-6" />,
    title: "Weather Forecasts",
    description: "Accurate weather predictions and alerts to help you plan your farming activities effectively.",
    color: "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400",
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: "Pest & Disease Alerts",
    description: "Get instant notifications about crop diseases and pest infestations in your region with remedies.",
    color: "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Multilingual Support",
    description: "Fully accessible in Kashmiri, Hindi, and Urdu. Your language, your way.",
    color: "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Offline Ready",
    description: "Access critical information even without internet. Syncs automatically when connectivity returns.",
    color: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 bg-kv-surface/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-kv-text mb-4 tracking-tight">
            Powerful Features for Modern Farming
          </h2>
          <p className="text-lg text-kv-text-muted max-w-2xl mx-auto">
            Everything you need to make informed farming decisions, all accessible through your voice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-6 sm:p-8 rounded-2xl border border-kv-border/20 bg-kv-bg hover:bg-kv-surface/50 hover:border-kv-border/40 transition-all duration-300 hover:shadow-lg ${feature.color}`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${feature.color} group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-kv-text mb-2">
                {feature.title}
              </h3>
              <p className="text-kv-text-muted text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
