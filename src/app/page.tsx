import type { Metadata } from "next";
import { LandingPage } from "./landing-page";

export const metadata: Metadata = {
  title: "KisanVoice — Voice-first AI for farmers",
  description:
    "Mandi prices, morning briefings, highway and weather intel, and multilingual voice queries — built for farmers in Kashmir and beyond.",
};

export default function Home() {
  return <LandingPage />;
}
