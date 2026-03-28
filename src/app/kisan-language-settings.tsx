"use client";

import { useEffect } from "react";
import { X, Languages } from "lucide-react";
import { LANGUAGES, type AppLanguage, type UiStrings } from "./kisan-i18n";

const LANG_BADGE: Record<AppLanguage, string> = {
  kashmiri: "KS",
  hindi: "HI",
  english: "EN",
};

export function LanguageSettingsSheet({
  open,
  onClose,
  selectedLanguage,
  onSelectLanguage,
  t,
}: {
  open: boolean;
  onClose: () => void;
  selectedLanguage: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
  t: UiStrings;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        aria-label={t.dismiss}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-settings-title"
        className="relative max-h-[85dvh] overflow-y-auto rounded-t-[24px] border border-[#434a41]/25 border-b-0 bg-[#0d120d] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-[0_-12px_48px_rgba(0,0,0,0.45)]"
      >
        <div className="mx-auto max-w-lg">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#434a41]/50" />

          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2
                id="language-settings-title"
                className="text-[18px] font-bold tracking-tight text-[#f8fef3]"
              >
                {t.settingsTitle}
              </h2>
              <p className="mt-1 flex items-center gap-2 text-[13px] font-medium text-[#8f988e]">
                <Languages className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                {t.chooseLanguage}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#434a41]/35 bg-[#141b14] text-[#a6ada3] transition-colors hover:bg-[#192219] hover:text-[#f8fef3]"
              aria-label={t.dismiss}
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          <div className="space-y-2.5 pb-2" role="radiogroup" aria-label={t.chooseLanguage}>
            {LANGUAGES.map((lang) => {
              const isActive = lang.id === selectedLanguage;
              return (
                <button
                  key={lang.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  dir="ltr"
                  onClick={() => onSelectLanguage(lang.id)}
                  className={[
                    "group flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8eff71]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d120d]",
                    "active:scale-[0.99]",
                    isActive
                      ? "border-[#8eff71]/40 bg-[#8eff71]/[0.09] shadow-[0_0_0_1px_rgba(142,255,113,0.15)]"
                      : "border-white/[0.07] bg-[#141b14]/90 hover:border-white/[0.12] hover:bg-[#192219]",
                  ].join(" ")}
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a0f0a] text-[11px] font-bold tabular-nums tracking-wide text-[#8eff71]/90 shadow-inner"
                    aria-hidden
                  >
                    {LANG_BADGE[lang.id]}
                  </span>
                  <div className="min-w-0 flex-1 text-start">
                    <p
                      dir={lang.dir}
                      className={`text-[15px] font-semibold leading-snug ${isActive ? "text-[#c8f7a8]" : "text-[#eef6e8]"}`}
                      style={{
                        fontFamily:
                          lang.dir === "rtl"
                            ? "var(--font-noto-nastaliq)"
                            : "inherit",
                      }}
                    >
                      {lang.nativeName}
                    </p>
                    <p className="mt-0.5 text-[11.5px] leading-tight text-[#7a8576]" lang="en">
                      <span className="text-[#9aa396]">{lang.name}</span>
                      <span className="mx-1.5 text-[#3d4540]">·</span>
                      <span>{lang.script}</span>
                    </p>
                  </div>
                  <span
                    className={[
                      "flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      isActive
                        ? "border-[#8eff71] bg-[#8eff71]"
                        : "border-[#3d4540] group-hover:border-[#5a6356]",
                    ].join(" ")}
                    aria-hidden
                  >
                    {isActive && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="text-[#050a05]"
                      >
                        <path
                          d="M3 7L6 10L11 4"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
