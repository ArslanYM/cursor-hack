import type { Metadata, Viewport } from "next";
import { Noto_Sans, Noto_Nastaliq_Urdu } from "next/font/google";
import { ConvexClientProvider } from "./ConvexClientProvider";
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
  title: "KisanVoice — تُہنٛد آواز، تُہنٛد بازار",
  description:
    "Voice-first AI assistant for farmers in Kashmir. Ask for mandi prices in Kashmiri, Hindi, or Urdu.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KisanVoice",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fefdf8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ks"
      className={`${notoSans.variable} ${notoNastaliq.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
