import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KisanVoice — Your Voice, Your Market",
  description:
    "Voice-first AI assistant empowering Kashmir's farmers with real-time mandi prices, weather forecasts, and crop intelligence in Kashmiri, Hindi, and Urdu.",
  keywords: ["farming", "agriculture", "Kashmir", "mandi prices", "voice assistant", "AI"],
  openGraph: {
    title: "KisanVoice — Your Voice, Your Market",
    description:
      "Voice-first AI assistant empowering Kashmir's farmers with real-time mandi prices, weather forecasts, and crop intelligence.",
    type: "website",
    locale: "ks_IN",
    alternateLocale: ["hi_IN", "ur_PK"],
  },
  twitter: {
    card: "summary_large_image",
    title: "KisanVoice",
    description: "Your voice, your market. Empowering farmers with AI.",
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
