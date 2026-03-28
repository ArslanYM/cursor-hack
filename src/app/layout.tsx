import type { Metadata, Viewport } from "next";
import { Noto_Sans, Noto_Nastaliq_Urdu } from "next/font/google";
import { getConvexUrlForProvider } from "@/lib/convex-url";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ServiceWorkerRegistration } from "./ServiceWorkerRegistration";
import { ThemeProvider } from "./ThemeProvider";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-sans",
  display: "swap",
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-noto-nastaliq",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KisanVoice — Your Voice, Your Market",
  description:
    "Voice-first AI assistant empowering Kashmir's farmers with real-time mandi prices, weather forecasts, and crop intelligence in Kashmiri, Hindi, and Urdu.",
  keywords: ["farming", "mandi prices", "agriculture", "Kashmir", "voice assistant", "AI"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KisanVoice",
  },
  formatDetection: { telephone: false },
  manifest: "/manifest.json",
  openGraph: {
    title: "KisanVoice — Your Voice, Your Market",
    description: "Empower your farming with real-time market intelligence and AI insights",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a1009",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const convexUrl = getConvexUrlForProvider();

  return (
    <html
      lang="ks"
      suppressHydrationWarning
      className={`${notoSans.variable} ${notoNastaliq.variable} h-full`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='kisanvoice-theme';var t=localStorage.getItem(k);var d=document.documentElement;if(t==='light'){d.classList.remove('dark');}else if(t==='dark'){d.classList.add('dark');}else if(window.matchMedia('(prefers-color-scheme: dark)').matches){d.classList.add('dark');}else{d.classList.remove('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-kv-bg text-kv-text transition-colors duration-200">
        <ThemeProvider>
          <ConvexClientProvider convexUrl={convexUrl}>
            {children}
          </ConvexClientProvider>
        </ThemeProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
