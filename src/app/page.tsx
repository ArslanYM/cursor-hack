"use client";

import { NavBar } from "@/components/landing/NavBar";
import { OpeningNarrative } from "@/components/landing/OpeningNarrative";
import { FarmersAsHeroes } from "@/components/landing/FarmersAsHeroes";
import { RealStruggles } from "@/components/landing/RealStruggles";
import { PersonalJourneys } from "@/components/landing/PersonalJourneys";
import { TheTransformation } from "@/components/landing/TheTransformation";
import { CommunityStories } from "@/components/landing/CommunityStories";
import { JoinTheMovement } from "@/components/landing/JoinTheMovement";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-kv-bg text-kv-text flex flex-col">
      <NavBar />
      <div className="flex-1">
        <OpeningNarrative />
        <FarmersAsHeroes />
        <RealStruggles />
        <PersonalJourneys />
        <TheTransformation />
        <CommunityStories />
        <JoinTheMovement />
      </div>
      <Footer />
    </main>
  );
}
