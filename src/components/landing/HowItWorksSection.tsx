"use client";

import { Mic, Zap, TrendingUp, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: Mic,
    title: "Speak Your Question",
    description: "Simply tap the microphone and ask your question in Kashmiri, Hindi, or Urdu. No typing needed.",
  },
  {
    icon: Zap,
    title: "AI Processes Your Query",
    description: "Our AI engine instantly transcribes your voice and understands your farming context and needs.",
  },
  {
    icon: TrendingUp,
    title: "Get Real-Time Insights",
    description: "Receive live market prices, weather forecasts, and personalized crop recommendations instantly.",
  },
  {
    icon: MessageCircle,
    title: "Listen to the Answer",
    description: "Hear the answer in your preferred language. Perfect for hands-free operation while farming.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 bg-kv-surface/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-kv-text mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg text-kv-text-muted max-w-2xl mx-auto">
            Get started in seconds with our simple voice-first workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-[calc(100%+1.5rem)] w-[calc(2rem+1.5rem)] h-0.5 bg-gradient-to-r from-kv-primary to-transparent" />
                )}

                {/* Step card */}
                <div className="relative h-full">
                  <div className="absolute -left-4 -top-4 w-8 h-8 bg-kv-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="p-6 sm:p-8 rounded-2xl border border-kv-border/20 bg-kv-bg h-full flex flex-col hover:border-kv-border/40 transition-colors">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-kv-primary/20 text-kv-primary mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-kv-text mb-2">
                      {step.title}
                    </h3>
                    <p className="text-kv-text-muted text-sm leading-relaxed flex-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Video or demo section */}
        <div className="mt-16 sm:mt-20 rounded-3xl overflow-hidden border border-kv-border/20 bg-kv-surface/50 backdrop-blur">
          <div className="aspect-video bg-gradient-to-br from-kv-primary/20 to-kv-primary/5 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-kv-primary/30 mb-4">
                <svg className="w-8 h-8 text-kv-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
              <p className="text-kv-text-muted">See KisanVoice in action</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
