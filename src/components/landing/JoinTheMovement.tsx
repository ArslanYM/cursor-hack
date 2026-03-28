"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, Mic } from "lucide-react";

export function JoinTheMovement() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/(authenticated)");
    } else {
      router.push("/sign-up");
    }
  };

  return (
    <section className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-kv-bg via-kv-primary/10 to-kv-accent/5 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-kv-primary/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-kv-accent/20 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Narrative section */}
        <div className="text-center space-y-8 mb-16">
          <p className="text-sm uppercase tracking-widest text-kv-primary font-semibold animate-pulse">
            Your Story Matters
          </p>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-kv-text text-balance">
            Your voice deserves to be heard.
          </h2>

          <p className="text-xl sm:text-2xl text-kv-text/80 leading-relaxed max-w-3xl mx-auto">
            Whether you grow saffron in Kashmir valleys, wheat in Punjab plains, cotton in Haryana fields, or anything in between—your labor matters. Your knowledge matters. Your voice matters.
          </p>

          <p className="text-lg text-kv-text/70 leading-relaxed max-w-3xl mx-auto">
            Stop accepting whatever price is offered. Start knowing your market. Start making informed decisions. Start getting paid what you deserve.
          </p>
        </div>

        {/* Large CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 sm:mb-24">
          <button
            onClick={handleGetStarted}
            className="group relative px-8 sm:px-12 py-5 sm:py-6 bg-gradient-to-r from-kv-primary to-kv-accent text-white font-semibold text-lg rounded-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Mic className="w-6 h-6" />
              {isSignedIn ? "Open KisanVoice" : "Join the Movement"}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-kv-accent to-kv-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button className="px-8 sm:px-12 py-5 sm:py-6 border-2 border-kv-primary text-kv-primary font-semibold text-lg rounded-xl hover:bg-kv-primary/10 transition-colors duration-300">
            Learn More
          </button>
        </div>

        {/* Multiple perspectives on joining */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {/* For farmers */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white/40 dark:bg-kv-text/5 border border-kv-accent/20 hover:border-kv-primary/40 transition-all duration-300">
            <p className="text-sm uppercase tracking-widest text-kv-primary font-semibold mb-4">For Farmers</p>
            <h3 className="text-xl font-bold text-kv-text mb-3">Reclaim Your Power</h3>
            <ul className="space-y-3 text-kv-text/70">
              <li className="flex items-start gap-3">
                <span className="text-kv-primary mt-1">✓</span>
                <span>Get mandi prices in your language, instantly</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-kv-primary mt-1">✓</span>
                <span>Make informed sales decisions, not desperate ones</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-kv-primary mt-1">✓</span>
                <span>Connect directly with fair-price buyers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-kv-primary mt-1">✓</span>
                <span>Access weather, crop intelligence, market trends</span>
              </li>
            </ul>
          </div>

          {/* For communities */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white/40 dark:bg-kv-text/5 border border-kv-accent/20 hover:border-kv-primary/40 transition-all duration-300">
            <p className="text-sm uppercase tracking-widest text-kv-primary font-semibold mb-4">For Communities</p>
            <h3 className="text-xl font-bold text-kv-text mb-3">Build Together</h3>
            <ul className="space-y-3 text-kv-text/70">
              <li className="flex items-start gap-3">
                <span className="text-kv-primary mt-1">✓</span>
                <span>Form cooperatives with real-time data</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-kv-primary mt-1">✓</span>
                <span>Negotiate collectively with middlemen</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-kv-primary mt-1">✓</span>
                <span>Share knowledge and best practices</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-kv-primary mt-1">✓</span>
                <span>Strengthen local agricultural systems</span>
              </li>
            </ul>
          </div>

          {/* For change */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white/40 dark:bg-kv-text/5 border border-kv-accent/20 hover:border-kv-primary/40 transition-all duration-300">
            <p className="text-sm uppercase tracking-widest text-kv-primary font-semibold mb-4">For Change</p>
            <h3 className="text-xl font-bold text-kv-text mb-3">Transform Agriculture</h3>
            <ul className="space-y-3 text-kv-text/70">
              <li className="flex items-start gap-3">
                <span className="text-kv-primary mt-1">✓</span>
                <span>Reduce exploitation and unfair practices</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-kv-primary mt-1">✓</span>
                <span>Create fairer, more transparent markets</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-kv-primary mt-1">✓</span>
                <span>Keep young farmers in their fields</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-kv-primary mt-1">✓</span>
                <span>Build a movement farmers lead</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Final message */}
        <div className="text-center space-y-6 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-kv-primary/15 to-kv-accent/10 border border-kv-primary/30">
          <p className="text-2xl sm:text-3xl font-bold text-kv-text leading-tight">
            This is your time. This is your movement.
          </p>

          <p className="text-lg text-kv-text/80 leading-relaxed max-w-2xl mx-auto">
            Generations of farmers have asked for a voice. For fair treatment. For tools that work for them. You don&apos;t have to wait for permission anymore. Your voice is ready. The market is listening. It&apos;s time.
          </p>

          <div className="pt-6 flex justify-center">
            <button
              onClick={handleGetStarted}
              className="px-10 py-4 bg-kv-primary text-white font-bold rounded-lg hover:bg-kv-primary/90 transition-all duration-300 hover:shadow-lg flex items-center gap-2"
            >
              <Mic className="w-5 h-5" />
              {isSignedIn ? "Open KisanVoice Now" : "Start Your Story"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
