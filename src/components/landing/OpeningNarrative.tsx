"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export function OpeningNarrative() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const handleCTA = () => {
    if (isSignedIn) {
      router.push("/(authenticated)");
    } else {
      router.push("/sign-up");
    }
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-32 overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-72 h-72 bg-kv-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-kv-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Opening with poetic tone */}
        <div className="space-y-6">
          <p className="text-lg sm:text-xl text-kv-text/70 font-light leading-relaxed">
            For centuries, hands have turned soil. Seeds have been planted. Harvests have fed nations.
          </p>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-kv-text leading-tight text-balance">
            But their voices went unheard.
          </h1>
          
          <p className="text-lg sm:text-xl text-kv-text/70 font-light leading-relaxed max-w-3xl mx-auto">
            Middlemen set prices. Markets moved without them. Technology passed them by. In the fields of Kashmir, Punjab, Haryana, and across India, farmers worked harder, earned less, and decided futures for themselves without the information they deserved.
          </p>
        </div>

        {/* Transition */}
        <div className="py-8 border-t border-kv-accent/20"></div>

        {/* The shift */}
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-widest text-kv-primary font-semibold">
            Then something changed
          </p>
          
          <p className="text-xl sm:text-2xl text-kv-text leading-relaxed max-w-3xl mx-auto">
            What if farmers didn&apos;t need to read English? What if they could just speak—in Kashmiri, in Urdu, in Hindi—and instantly know the real mandi prices? What if technology served them instead of against them?
          </p>

          <p className="text-lg sm:text-xl text-kv-text/70 font-light leading-relaxed max-w-3xl mx-auto">
            This isn&apos;t a tech story. This is a story about respect. About giving farmers back their voice, their agency, and their rightful place as the backbone of our society.
          </p>
        </div>

        {/* Scroll invitation */}
        <div className="pt-12 flex flex-col items-center gap-6">
          <p className="text-sm text-kv-text/60">Meet the farmers rewriting their own story</p>
          <div className="w-6 h-10 border-2 border-kv-text/30 rounded-full flex items-center justify-center animate-bounce">
            <div className="w-1 h-2 bg-kv-text/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
