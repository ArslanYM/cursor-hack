"use client";

import {
  Wheat,
  Globe,
  ArrowRight,
  Mic,
  Zap,
  Truck,
  Sparkles,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { LANGUAGES, type AppLanguage, type UiStrings } from "./kisan-i18n";

export function LanguageSelectScreen({
  selectedLanguage,
  onSelect,
  onNext,
  t,
}: {
  selectedLanguage: AppLanguage;
  onSelect: (lang: AppLanguage) => void;
  onNext: () => void;
  t: UiStrings;
}) {
  const activeLang = LANGUAGES.find((l) => l.id === selectedLanguage)!;

  return (
    <main className="min-h-screen bg-[#0a1009] flex flex-col items-center justify-center px-5 py-10 font-sans text-[#f8fef3] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8eff71]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#ffd709]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-1.5 rounded-full bg-[#8eff71]" />
        <div className="w-10 h-1.5 rounded-full bg-[#434a41]/40" />
      </div>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-3">
        <Wheat className="w-10 h-10 text-[#8eff71]" strokeWidth={2} />
        <span className="text-[28px] font-extrabold tracking-tight">
          KisanVoice
        </span>
      </div>

      <p className="text-[16px] text-[#a6ada3] mb-2 font-medium">
        {t.welcomeSubtitle}
      </p>

      {/* Animated greeting */}
      <div className="h-16 flex items-center justify-center mb-8">
        <p
          key={activeLang.id}
          dir={activeLang.dir}
          className="text-[32px] font-extrabold text-[#8eff71] animate-[fadeInUp_0.4s_ease-out]"
          style={{
            fontFamily:
              activeLang.dir === "rtl"
                ? "var(--font-noto-nastaliq)"
                : "inherit",
          }}
        >
          {activeLang.greeting} 👋
        </p>
      </div>

      {/* Language picker label */}
      <div className="flex items-center gap-2.5 mb-5">
        <Globe className="w-5 h-5 text-[#8eff71]" />
        <span className="text-[14px] font-extrabold text-[#8eff71] uppercase tracking-[0.15em]">
          {t.chooseLanguage}
        </span>
      </div>

      {/* Language cards */}
      <div className="w-full max-w-sm space-y-3 mb-10">
        {LANGUAGES.map((lang) => {
          const isActive = lang.id === selectedLanguage;
          return (
            <button
              key={lang.id}
              onClick={() => onSelect(lang.id)}
              className={[
                "w-full flex items-center gap-4 px-5 py-5 rounded-[20px] border transition-all duration-300 cursor-pointer",
                "active:scale-[0.98]",
                isActive
                  ? "bg-[#8eff71]/10 border-[#8eff71]/40 shadow-[0_0_32px_rgba(142,255,113,0.1)]"
                  : "bg-[#141b14] border-[#434a41]/20 hover:bg-[#192219] hover:border-[#434a41]/40",
              ].join(" ")}
            >
              <span className="text-[32px]">{lang.emoji}</span>
              <div className="flex-1 text-left">
                <p
                  className={`text-[18px] font-extrabold ${isActive ? "text-[#8eff71]" : "text-[#f8fef3]"}`}
                >
                  {lang.nativeName}
                </p>
                <p className="text-[14px] text-[#a6ada3] font-medium">
                  {lang.name} · {lang.script}
                </p>
              </div>
              <div
                className={[
                  "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all",
                  isActive
                    ? "border-[#8eff71] bg-[#8eff71]"
                    : "border-[#434a41]/40",
                ].join(" ")}
              >
                {isActive && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M3 7L6 10L11 4"
                      stroke="#050a05"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        className="w-full max-w-sm py-5 bg-gradient-to-b from-[#8eff71] to-[#2be800] text-[#050a05] rounded-[18px] font-extrabold text-[18px] shadow-[0_8px_32px_rgba(142,255,113,0.3)] hover:shadow-[0_8px_48px_rgba(142,255,113,0.5)] cursor-pointer active:scale-[0.97] transition-all flex items-center justify-center gap-3"
      >
        {t.next}
        <ArrowRight className="w-5 h-5" />
      </button>
    </main>
  );
}

export function FeatureGuideScreen({
  language,
  onComplete,
  t,
}: {
  language: AppLanguage;
  onComplete: () => void;
  t: UiStrings;
}) {
  const features = [
    {
      title: t.feature1Title,
      desc: t.feature1Desc,
      icon: <Mic className="w-7 h-7" />,
      color: "from-[#8eff71]/15 to-transparent border-[#8eff71]/20",
      iconColor: "text-[#8eff71]",
    },
    {
      title: t.feature2Title,
      desc: t.feature2Desc,
      icon: <Zap className="w-7 h-7" />,
      color: "from-[#ffd709]/15 to-transparent border-[#ffd709]/20",
      iconColor: "text-[#ffd709]",
    },
    {
      title: t.feature3Title,
      desc: t.feature3Desc,
      icon: <Truck className="w-7 h-7" />,
      color: "from-[#60a5fa]/15 to-transparent border-[#60a5fa]/20",
      iconColor: "text-[#60a5fa]",
    },
    {
      title: t.feature4Title,
      desc: t.feature4Desc,
      icon: <Sparkles className="w-7 h-7" />,
      color: "from-[#a78bfa]/15 to-transparent border-[#a78bfa]/20",
      iconColor: "text-[#a78bfa]",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a1009] flex flex-col items-center px-5 py-10 font-sans text-[#f8fef3] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#8eff71]/4 rounded-full blur-[120px] pointer-events-none" />

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-1.5 rounded-full bg-[#8eff71]" />
        <div className="w-10 h-1.5 rounded-full bg-[#8eff71]" />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-8 h-8 text-[#8eff71]" />
        <h1
          className="text-[26px] font-extrabold tracking-tight"
          dir={language === "kashmiri" ? "rtl" : "ltr"}
          style={{
            fontFamily:
              language === "kashmiri"
                ? "var(--font-noto-nastaliq)"
                : "inherit",
          }}
        >
          {t.featureGuideTitle}
        </h1>
      </div>
      <p
        className="text-[16px] text-[#a6ada3] mb-8 font-medium text-center max-w-xs"
        dir={language === "kashmiri" ? "rtl" : "ltr"}
        style={{
          fontFamily:
            language === "kashmiri"
              ? "var(--font-noto-nastaliq)"
              : "inherit",
        }}
      >
        {t.featureGuideSubtitle}
      </p>

      {/* Feature cards */}
      <div className="w-full max-w-sm space-y-4 mb-10">
        {features.map((f, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${f.color} rounded-[20px] border p-5 flex items-start gap-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}
            style={{
              animationDelay: `${i * 100}ms`,
              animation: "fadeInUp 0.5s ease-out both",
            }}
          >
            <div
              className={`w-12 h-12 rounded-[14px] bg-[#0a1009]/60 flex items-center justify-center shrink-0 ${f.iconColor}`}
            >
              {f.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[17px] font-extrabold text-[#f8fef3] mb-1 leading-snug"
                dir={language === "kashmiri" ? "rtl" : "ltr"}
                style={{
                  fontFamily:
                    language === "kashmiri"
                      ? "var(--font-noto-nastaliq)"
                      : "inherit",
                }}
              >
                {f.title}
              </p>
              <p
                className="text-[14px] text-[#a6ada3] leading-relaxed"
                dir={language === "kashmiri" ? "rtl" : "ltr"}
                style={{
                  fontFamily:
                    language === "kashmiri"
                      ? "var(--font-noto-nastaliq)"
                      : "inherit",
                }}
              >
                {f.desc}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#434a41] shrink-0 mt-1" />
          </div>
        ))}
      </div>

      {/* Get Started button */}
      <button
        onClick={onComplete}
        className="w-full max-w-sm py-5 bg-gradient-to-b from-[#8eff71] to-[#2be800] text-[#050a05] rounded-[18px] font-extrabold text-[18px] shadow-[0_8px_32px_rgba(142,255,113,0.3)] hover:shadow-[0_8px_48px_rgba(142,255,113,0.5)] cursor-pointer active:scale-[0.97] transition-all flex items-center justify-center gap-3"
        dir={language === "kashmiri" ? "rtl" : "ltr"}
        style={{
          fontFamily:
            language === "kashmiri"
              ? "var(--font-noto-nastaliq)"
              : "inherit",
        }}
      >
        <Sparkles className="w-5 h-5" />
        {t.getStarted}
      </button>

    </main>
  );
}
