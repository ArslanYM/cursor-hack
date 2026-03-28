"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Wheat } from "lucide-react";

export default function AuthenticatedApp() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in");
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kv-primary to-kv-accent flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Wheat className="w-16 h-16 text-white animate-bounce" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">KisanVoice</h1>
          <p className="text-white/80">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kv-primary/10 to-kv-accent/10">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Wheat className="w-12 h-12 text-kv-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-kv-text mb-2">Welcome to KisanVoice</h1>
          <p className="text-kv-text/70 text-lg">
            Your voice. Your market. Your power.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Voice-First Access",
              description: "Ask in Kashmiri, Hindi, or Urdu - get instant market intelligence",
              icon: "🎤",
            },
            {
              title: "Real-Time Prices",
              description: "Know today's mandi prices before you sell your harvest",
              icon: "💰",
            },
            {
              title: "Weather & Alerts",
              description: "Get localized weather forecasts and agricultural alerts",
              icon: "⛅",
            },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white dark:bg-kv-bg-dark p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-kv-text mb-2">{feature.title}</h3>
              <p className="text-kv-text/70">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-kv-primary/5 border border-kv-primary/20 rounded-lg p-8 text-center">
          <p className="text-kv-text mb-4">
            The full KisanVoice application is coming soon. For now, explore the stories of farmers like you on our{" "}
            <a href="/" className="font-semibold text-kv-primary hover:underline">
              landing page
            </a>
            .
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-block px-8 py-3 bg-kv-primary text-white font-semibold rounded-lg hover:bg-kv-primary/90 transition-colors"
          >
            Back to Landing
          </button>
        </div>
      </div>
    </div>
  );
}
