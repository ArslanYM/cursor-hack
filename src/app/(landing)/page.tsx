"use client";

import { NavBar } from "@/components/landing/NavBar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-kv-bg text-kv-text flex flex-col">
      <NavBar />
      <div className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <HowItWorksSection />
        <CTASection />
      </div>
      <Footer />
    </main>
  );
}
