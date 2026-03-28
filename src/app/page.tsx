"use client";

import { NavBar } from "@/components/landing/NavBar";
import { HeroStory } from "@/components/landing/HeroStory";
import { FarmerStories } from "@/components/landing/FarmerStories";
import { ChallengesSection } from "@/components/landing/ChallengesSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { ImpactSection } from "@/components/landing/ImpactSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-kv-bg text-kv-text flex flex-col">
      <NavBar />
      <div className="flex-1">
        <HeroStory />
        <FarmerStories />
        <ChallengesSection />
        <SolutionSection />
        <ImpactSection />
        <TestimonialSection />
        <CTASection />
      </div>
      <Footer />
    </main>
  );
}
