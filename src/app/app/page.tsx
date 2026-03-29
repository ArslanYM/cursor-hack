"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useMutation, useAction, useQuery } from "convex/react";
import { useUser, UserButton } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
  Mic,
  Square,
  TrendingUp,
  TrendingDown,
  Minus,
  Wheat,
  Loader2,
  MapPin,
  Clock,
  Shield,
  MessageCircle,
  CloudRain,
  Truck,
  AlertTriangle,
  Landmark,
  Bug,
  BarChart3,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Volume2,
  Zap,
  Heart,
  Settings,
} from "lucide-react";
import {
  UI_STRINGS,
  quickQueryChips,
  DEFAULT_BRIEFING_LOCATION,
  DEFAULT_BRIEFING_CROPS,
  type AppLanguage,
  type UiStrings,
} from "../kisan-i18n";
import { LanguageSelectScreen, FeatureGuideScreen } from "../kisan-onboarding";
import { LanguageSettingsSheet } from "../kisan-language-settings";
import { ThemeToggle } from "../ThemeToggle";

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */

function haptic(pattern: number | number[] = 50) {
  try {
    navigator?.vibrate?.(pattern);
  } catch {
    /* not supported */
  }
}

function formatPrice(n: number | null | undefined): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function getCommodityEmoji(name: string): string {
  const l = (name || "").toLowerCase();
  if (l.includes("apple") || l.includes("seb") || l.includes("tshount"))
    return "🍎";
  if (l.includes("walnut") || l.includes("akhrot") || l.includes("doon"))
    return "🥜";
  if (
    l.includes("saffron") ||
    l.includes("kesar") ||
    l.includes("zafran") ||
    l.includes("kong")
  )
    return "🌸";
  if (l.includes("rice") || l.includes("chawal") || l.includes("tamul"))
    return "🍚";
  if (
    l.includes("wheat") ||
    l.includes("gehun") ||
    l.includes("gandum") ||
    l.includes("kanak")
  )
    return "🌾";
  if (l.includes("almond") || l.includes("badam")) return "🌰";
  if (l.includes("cherry") || l.includes("gilas")) return "🍒";
  if (l.includes("maize") || l.includes("makka") || l.includes("corn"))
    return "🌽";
  if (
    l.includes("tomato") ||
    l.includes("tamatar") ||
    l.includes("ruwangan") ||
    l.includes("روٲنٛگَن")
  )
    return "🍅";
  if (
    l.includes("potato") ||
    l.includes("aloo") ||
    l.includes("aalu") ||
    l.includes("alū") ||
    l.includes("oluv")
  )
    return "🥔";
  if (l.includes("onion") || l.includes("pyaz") || l.includes("piaz"))
    return "🧅";
  if (l.includes("cauliflower") || l.includes("gobhi") || l.includes("gobi"))
    return "🥦";
  if (l.includes("brinjal") || l.includes("baingan") || l.includes("wangun"))
    return "🍆";
  return "🌿";
}

function Kas({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span dir="rtl" className={`font-nastaliq ${className}`}>
      {children}
    </span>
  );
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const ALERT_CONFIG: Record<
  string,
  { Icon: typeof CloudRain; color: string; bg: string; label: string }
> = {
  weather: {
    Icon: CloudRain,
    color: "text-[#60a5fa]",
    bg: "bg-[#60a5fa]/10 border-[#60a5fa]/30",
    label: "Weather",
  },
  highway: {
    Icon: Truck,
    color: "text-[#f59e0b]",
    bg: "bg-[#f59e0b]/10 border-[#f59e0b]/30",
    label: "Highway",
  },
  subsidy: {
    Icon: Landmark,
    color: "text-[#a78bfa]",
    bg: "bg-[#a78bfa]/10 border-[#a78bfa]/30",
    label: "Subsidy",
  },
  pest: {
    Icon: Bug,
    color: "text-[#f97316]",
    bg: "bg-[#f97316]/10 border-[#f97316]/30",
    label: "Pest Alert",
  },
  market: {
    Icon: BarChart3,
    color: "text-[#34d399]",
    bg: "bg-[#34d399]/10 border-[#34d399]/30",
    label: "Market",
  },
};

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */

interface PriceData {
  commodity: string;
  commodityLocal: string;
  commodityKashmiri?: string;
  market: string;
  currentPrice: number | null;
  previousPrice: number | null;
  unit: string;
  priceChange: number;
  priceDirection: "up" | "down" | "stable";
  lastUpdated: string;
  summary: string;
  summaryLocal: string;
  summaryKashmiri?: string;
  confidence: "high" | "medium" | "low";
  additionalInfo: string | null;
  highway?: {
    status: string;
    detail: string;
    advice: string;
  };
  highwayKashmiri?: string;
}

interface BriefingData {
  morningBriefing?: string;
  morningBriefingKashmiri?: string;
  morningBriefingHindi?: string;
  voiceScript?: string;
  alerts?: Array<{
    category: string;
    severity: string;
    title: string;
    titleKashmiri?: string;
    body: string;
    bodyKashmiri?: string;
    bodyHindi?: string;
  }>;
  highway?: {
    status: string;
    detail: string;
    advice: string;
  };
  subsidies?: Array<{
    name: string;
    deadline?: string;
    detail: string;
  }>;
  pestWarnings?: Array<{
    crop: string;
    issue: string;
    action: string;
  }>;
  marketVibe?: string;
}

export default function KisanVoice() {
  const { user, isLoaded } = useUser();
  const storeUser = useMutation(api.users.store);
  const currentUser = useQuery(api.users.current);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const updatePreferences = useMutation(api.users.updatePreferences);

  useEffect(() => {
    if (isLoaded && user) {
      storeUser().catch(() => {});
    }
  }, [isLoaded, user, storeUser]);

  /* ── Onboarding state ── */
  const [onboardingStep, setOnboardingStep] = useState<
    "loading" | "language" | "guide" | "done"
  >("loading");
  const [selectedLanguage, setSelectedLanguage] =
    useState<AppLanguage>("kashmiri");

  useEffect(() => {
    if (currentUser === undefined) return; // still loading
    if (currentUser === null) {
      setOnboardingStep("language");
      return;
    }
    if (currentUser.onboardingComplete) {
      setSelectedLanguage(
        (currentUser.language as AppLanguage) || "kashmiri"
      );
      setOnboardingStep("done");
    } else {
      if (currentUser.language) {
        setSelectedLanguage(currentUser.language as AppLanguage);
      }
      setOnboardingStep("language");
    }
  }, [currentUser]);

  const handleLanguageNext = useCallback(() => {
    setOnboardingStep("guide");
  }, []);

  const handleOnboardingComplete = useCallback(async () => {
    try {
      await completeOnboarding({ language: selectedLanguage });
      setOnboardingStep("done");
    } catch {
      setOnboardingStep("done");
    }
  }, [completeOnboarding, selectedLanguage]);

  const handleLanguageChangeFromSettings = useCallback(
    async (lang: AppLanguage) => {
      setSelectedLanguage(lang);
      setSettingsOpen(false);
      try {
        await updatePreferences({ language: lang });
      } catch {
        /* offline / auth — UI still updates */
      }
    },
    [updatePreferences]
  );

  const t = UI_STRINGS[selectedLanguage];

  const [activeQueryId, setActiveQueryId] = useState<Id<"queries"> | null>(
    null
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isPipelinePending, setIsPipelinePending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [briefingData, setBriefingData] = useState<BriefingData | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [briefingError, setBriefingError] = useState<string | null>(null);
  const [showBriefingDetail, setShowBriefingDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "intel">("chat");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const intelAutoFetchDoneRef = useRef(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafIdRef = useRef<number>(0);
  const isRecordingRef = useRef(false);
  const speechDetectedRef = useRef(false);
  const silenceStartRef = useRef(0);
  const noiseFloorRef = useRef(0);
  const calibrationSamplesRef = useRef<number[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const CALIBRATION_MS = 800;
  const SILENCE_DURATION_MS = 2000;
  const MAX_RECORDING_MS = 30000;

  const createQuery = useMutation(api.farmerQuery.createQuery);
  const processQuery = useAction(api.farmerActions.processFarmerQuery);
  const getSmartContext = useAction(api.smartContext.getSmartContext);

  const activeQueryData = useQuery(
    api.farmerQuery.getQueryById,
    activeQueryId ? { queryId: activeQueryId } : "skip"
  );

  const history = useQuery(api.farmerQuery.getUserHistory) ?? [];
  const latestBriefing = useQuery(api.smartContextQueries.getLatestBriefing);
  const criticalAlerts = useQuery(api.smartContextQueries.getCriticalAlerts) ?? [];

  useEffect(() => {
    if (latestBriefing?.smartContext && !briefingData) {
      try {
        const parsed = JSON.parse(latestBriefing.smartContext);
        setBriefingData(parsed);
        setBriefingError(null);
        // Cache for offline access
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: "CACHE_BRIEFING",
            payload: parsed,
          });
        }
      } catch {
        /* ignore */
      }
    }
  }, [latestBriefing, briefingData]);

  useEffect(() => {
    if (activeQueryData?.status === "error") {
      setError(activeQueryData.errorMessage || t.genericQueryError);
    }
    if (activeQueryData?.status === "complete") {
      setIsPipelinePending(false);
    }
  }, [activeQueryData?.status, activeQueryData?.errorMessage, t.genericQueryError]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history?.length, activeQueryData?.status, isPipelinePending]);

  /* ── Fetch smart context / briefing ── */
  const fetchBriefing = useCallback(async () => {
    setBriefingError(null);
    setIsBriefingLoading(true);
    try {
      const location = currentUser?.location ?? DEFAULT_BRIEFING_LOCATION;
      const crops =
        currentUser?.crops && currentUser.crops.length > 0
          ? currentUser.crops
          : [...DEFAULT_BRIEFING_CROPS];
      const result = await getSmartContext({ location, crops });
      const data = result as unknown as BriefingData;
      setBriefingData(data);
      setBriefingError(null);
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "CACHE_BRIEFING",
          payload: data,
        });
      }
    } catch (err) {
      console.error("Briefing fetch failed:", err);
      const message =
        err instanceof Error ? err.message : t.processingFailed;
      setBriefingError(message);
    } finally {
      setIsBriefingLoading(false);
    }
  }, [
    getSmartContext,
    currentUser?.location,
    currentUser?.crops,
    t.processingFailed,
  ]);

  useEffect(() => {
    if (activeTab !== "intel") {
      intelAutoFetchDoneRef.current = false;
      return;
    }
    if (latestBriefing === undefined) return;
    if (briefingData) return;
    if (isBriefingLoading) return;
    if (latestBriefing?.smartContext) return;
    if (intelAutoFetchDoneRef.current) return;
    intelAutoFetchDoneRef.current = true;
    void fetchBriefing();
  }, [
    activeTab,
    latestBriefing,
    briefingData,
    isBriefingLoading,
    fetchBriefing,
  ]);

  /* ── VAD cleanup ── */
  const cleanupAudioAnalysis = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = 0;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    speechDetectedRef.current = false;
    silenceStartRef.current = 0;
    noiseFloorRef.current = 0;
    calibrationSamplesRef.current = [];
  }, []);

  const stopRecording = useCallback(() => {
    if (!isRecordingRef.current) return;
    isRecordingRef.current = false;
    haptic([30, 50, 30]);
    setIsRecording(false);
    cleanupAudioAnalysis();
    const rec = recorderRef.current;
    if (rec?.state === "recording") {
      try {
        rec.requestData();
      } catch {
        /* optional */
      }
      rec.stop();
    }
  }, [cleanupAudioAnalysis]);

  const startRecording = useCallback(async () => {
    setError(null);
    setActiveQueryId(null);
    setIsPipelinePending(false);
    setActiveTab("chat");
    haptic(50);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setIsPipelinePending(true);
        try {
          if (chunksRef.current.length === 0) {
            setError(t.recordingTooShort);
            return;
          }

          const blob = new Blob(chunksRef.current, { type: mimeType });
          const base64 = await blobToBase64(blob);

          const qId = await createQuery({ status: "transcribing" });
          setActiveQueryId(qId);

          await processQuery({
            queryId: qId,
            audioBase64: base64,
            audioMimeType: mimeType,
          });
        } catch (err) {
          setError(
            err instanceof Error ? err.message : t.processingFailed
          );
        } finally {
          setIsPipelinePending(false);
        }
      };

      recorder.start(250);
      recorderRef.current = recorder;
      isRecordingRef.current = true;
      setIsRecording(true);

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      const timeData = new Uint8Array(analyser.fftSize);
      const startTime = Date.now();
      calibrationSamplesRef.current = [];
      noiseFloorRef.current = 0;
      speechDetectedRef.current = false;
      silenceStartRef.current = 0;

      const computeRms = () => {
        analyser.getByteTimeDomainData(timeData);
        let sum = 0;
        for (let i = 0; i < timeData.length; i++) {
          const d = (timeData[i] - 128) / 128;
          sum += d * d;
        }
        return Math.sqrt(sum / timeData.length);
      };

      const checkAudio = () => {
        if (!isRecordingRef.current) return;

        if (Date.now() - startTime > MAX_RECORDING_MS) {
          stopRecording();
          return;
        }

        const rms = computeRms();
        const elapsed = Date.now() - startTime;

        if (elapsed < CALIBRATION_MS) {
          calibrationSamplesRef.current.push(rms);
          const samples = calibrationSamplesRef.current;
          noiseFloorRef.current =
            samples.reduce((a, b) => a + b, 0) / samples.length;
        } else {
          const threshold = Math.max(noiseFloorRef.current * 3, 0.015);

          if (rms > threshold) {
            speechDetectedRef.current = true;
            silenceStartRef.current = 0;
          } else if (speechDetectedRef.current) {
            if (silenceStartRef.current === 0) {
              silenceStartRef.current = Date.now();
            } else if (
              Date.now() - silenceStartRef.current >
              SILENCE_DURATION_MS
            ) {
              stopRecording();
              return;
            }
          }
        }

        rafIdRef.current = requestAnimationFrame(checkAudio);
      };

      rafIdRef.current = requestAnimationFrame(checkAudio);
    } catch {
      setError(t.microphonePermission);
    }
  }, [
    createQuery,
    processQuery,
    stopRecording,
    t.recordingTooShort,
    t.processingFailed,
    t.microphonePermission,
  ]);

  const handleMicPress = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const isProcessing =
    isPipelinePending ||
    activeQueryData?.status === "transcribing" ||
    activeQueryData?.status === "searching";

  const completedChats = history.filter(
    (q) => q.status === "complete" && q.aiResponse
  );

  const firstName = user?.firstName || "Farmer";

  /* ── Onboarding gates ── */

  if (onboardingStep === "loading") {
    return (
      <main className="min-h-screen bg-kv-bg flex items-center justify-center">
        <div className="text-center">
          <Wheat
            className="w-16 h-16 text-kv-primary mx-auto mb-6 animate-pulse"
            strokeWidth={2}
          />
          <p className="text-[22px] font-extrabold text-kv-text tracking-tight">
            KisanVoice
          </p>
          <Loader2 className="w-6 h-6 text-kv-primary animate-spin mx-auto mt-4" />
        </div>
      </main>
    );
  }

  if (onboardingStep === "language") {
    return (
      <LanguageSelectScreen
        selectedLanguage={selectedLanguage}
        onSelect={setSelectedLanguage}
        onNext={handleLanguageNext}
        t={t}
      />
    );
  }

  if (onboardingStep === "guide") {
    return (
      <FeatureGuideScreen
        language={selectedLanguage}
        onComplete={handleOnboardingComplete}
        t={t}
      />
    );
  }

  /* ── Main App Render ── */
  return (
    <main className="min-h-screen bg-kv-bg flex flex-col font-sans text-kv-text">
      {/* ── Critical Alert Ticker ── */}
      {criticalAlerts.length > 0 && (
        <AlertTicker alerts={criticalAlerts} />
      )}

      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-30 bg-kv-bg/80 backdrop-blur-[24px] border-b border-kv-border/15 px-5 py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <Wheat className="w-7 h-7 text-kv-primary" strokeWidth={2.5} />
            <span className="text-[22px] font-extrabold tracking-tight text-kv-text">
              KisanVoice
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="w-10 h-10 rounded-full bg-kv-surface border border-kv-border/30 flex items-center justify-center cursor-pointer hover:bg-kv-surface-hover transition-colors active:scale-95"
              aria-label={t.settingsAriaLabel}
              aria-expanded={settingsOpen}
            >
              <Settings className="w-5 h-5 text-kv-text-muted" strokeWidth={2} />
            </button>
            <button
              onClick={fetchBriefing}
              disabled={isBriefingLoading}
              className="w-10 h-10 rounded-full bg-kv-surface border border-kv-border/30 flex items-center justify-center cursor-pointer hover:bg-kv-surface-hover transition-colors active:scale-95"
              aria-label={t.ariaMorningBriefing}
            >
              {isBriefingLoading ? (
                <Loader2 className="w-5 h-5 text-kv-primary animate-spin" />
              ) : (
                <Zap className="w-5 h-5 text-kv-amber" />
              )}
            </button>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-kv-border",
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* ── Tab Bar ── */}
      <div className="px-5 pt-4 max-w-lg mx-auto w-full">
        <div className="flex bg-kv-surface rounded-[16px] p-1.5 border border-kv-border/15">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-3 rounded-[12px] text-[15px] font-bold transition-all cursor-pointer ${
              activeTab === "chat"
                ? "bg-kv-primary text-kv-primary-fg shadow-[0_2px_12px_var(--kv-mic-glow)]"
                : "text-kv-text-muted hover:text-kv-text"
            }`}
          >
            <Mic className="w-4 h-4 inline-block mr-2 -mt-0.5" />
            <span
              dir={selectedLanguage === "kashmiri" ? "rtl" : "ltr"}
              className={
                selectedLanguage === "kashmiri"
                  ? "font-nastaliq text-[14px] inline-block"
                  : ""
              }
            >
              {t.tabAsk}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("intel")}
            className={`flex-1 py-3 rounded-[12px] text-[15px] font-bold transition-all cursor-pointer relative ${
              activeTab === "intel"
                ? "bg-kv-primary text-kv-primary-fg shadow-[0_2px_12px_var(--kv-mic-glow)]"
                : "text-kv-text-muted hover:text-kv-text"
            }`}
          >
            <Zap className="w-4 h-4 inline-block mr-2 -mt-0.5" />
            <span
              dir={selectedLanguage === "kashmiri" ? "rtl" : "ltr"}
              className={
                selectedLanguage === "kashmiri"
                  ? "font-nastaliq text-[14px] inline-block"
                  : ""
              }
            >
              {t.tabIntel}
            </span>
            {criticalAlerts.length > 0 && activeTab !== "intel" && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-kv-record rounded-full text-[11px] font-black flex items-center justify-center text-white">
                {criticalAlerts.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Content Area ── */}
      {activeTab === "chat" ? (
        <ChatTab
          lang={selectedLanguage}
          t={t}
          history={completedChats}
          isRecording={isRecording}
          isProcessing={isProcessing}
          activeQueryData={activeQueryData}
          error={error}
          setError={setError}
          firstName={firstName}
          chatEndRef={chatEndRef}
        />
      ) : (
        <IntelTab
          lang={selectedLanguage}
          t={t}
          briefingData={briefingData}
          isBriefingLoading={isBriefingLoading}
          briefingError={briefingError}
          setBriefingError={setBriefingError}
          showDetail={showBriefingDetail}
          setShowDetail={setShowBriefingDetail}
          onRefresh={fetchBriefing}
          criticalAlerts={criticalAlerts}
        />
      )}

      {/* ── Quick Suggestions (when no history, chat tab) ── */}
      {activeTab === "chat" &&
        completedChats.length === 0 &&
        !isRecording &&
        !isProcessing && (
          <div className="px-5 pb-6 max-w-lg mx-auto w-full">
            <p
              className="text-[13px] text-kv-text-muted text-center mb-4 font-bold tracking-[0.1em] uppercase"
              dir={selectedLanguage === "kashmiri" ? "rtl" : "ltr"}
            >
              {t.quickQueriesTitle}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {quickQueryChips(t).map((s) => (
                <div
                  key={s.key}
                  className="bg-kv-surface hover:bg-kv-surface-hover transition-colors cursor-pointer border border-kv-border/20 rounded-[16px] px-3 py-4 flex flex-col items-center gap-2 shadow-[0_4px_12px_var(--kv-shadow)] hover:shadow-[0_8px_16px_var(--kv-primary-soft)] hover:-translate-y-0.5"
                >
                  <span className="text-[28px] drop-shadow-md">{s.emoji}</span>
                  <span
                    className={`text-[16px] font-bold text-kv-text/90 ${selectedLanguage === "kashmiri" ? "font-nastaliq" : ""}`}
                    dir={selectedLanguage === "kashmiri" ? "rtl" : "ltr"}
                  >
                    {selectedLanguage === "kashmiri" ? (
                      <Kas>{s.label}</Kas>
                    ) : (
                      s.label
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* ── Mic Bar (sticky bottom) ── */}
      <div className="sticky bottom-0 z-30 bg-kv-bg/80 backdrop-blur-[24px] border-t border-kv-border/10 px-4 py-5">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-6">
          {completedChats.length > 0 && !isRecording && !isProcessing && (
            <div className="flex items-center gap-2 text-[14px] font-bold text-kv-text-muted bg-kv-surface px-4 py-2 rounded-full border border-kv-border/20">
              <MessageCircle className="w-4 h-4 text-kv-primary" />
              <span>{completedChats.length}</span>
            </div>
          )}

          <button
            onClick={handleMicPress}
            disabled={isProcessing}
            aria-label={isRecording ? t.tapToStop : t.tapToSpeakAria}
            className={[
              "relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden",
              "transition-all duration-300 active:scale-95 cursor-pointer",
              "focus:outline-none",
              isRecording
                ? "bg-kv-record shadow-[0_0_40px_rgba(255,115,81,0.5)] scale-105"
                : isProcessing
                  ? "bg-kv-surface-3 border-2 border-kv-primary/30 cursor-wait shadow-[0_4px_20px_rgba(142,255,113,0.1)]"
                  : "bg-gradient-to-b from-kv-primary to-kv-primary-end shadow-[0_8px_32px_var(--kv-mic-glow)] hover:shadow-[0_8px_40px_var(--kv-mic-glow)] hover:-translate-y-1",
              "disabled:opacity-70 disabled:cursor-wait",
            ].join(" ")}
          >
            {isProcessing ? (
              <Loader2 className="w-10 h-10 text-kv-primary animate-spin" />
            ) : isRecording ? (
              <Square className="w-10 h-10 text-kv-primary-fg fill-kv-primary-fg" />
            ) : (
              <Mic className="w-11 h-11 text-kv-primary-fg" strokeWidth={2.5} />
            )}
          </button>

          {!isRecording && !isProcessing && (
            <p
              className={`text-[14px] text-kv-text-muted font-bold w-24 text-center leading-tight ${selectedLanguage === "kashmiri" ? "font-nastaliq" : ""}`}
              dir={selectedLanguage === "kashmiri" ? "rtl" : "ltr"}
            >
              {selectedLanguage === "kashmiri" ? (
                <Kas>{t.tapToSpeak}</Kas>
              ) : (
                t.tapToSpeak
              )}
            </p>
          )}
        </div>
      </div>

      <LanguageSettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleLanguageChangeFromSettings}
        t={t}
      />
    </main>
  );
}

/* ────────────────────────────────────────────
   Alert Ticker (top of page)
   ──────────────────────────────────────────── */

interface AlertDoc {
  _id: unknown;
  category: string;
  severity: string;
  title: string;
  body: string;
  bodyKashmiri?: string;
}

function AlertTicker({ alerts }: { alerts: AlertDoc[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (alerts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % alerts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [alerts.length]);

  const alert = alerts[currentIndex];
  if (!alert) return null;

  const isCritical = alert.severity === "critical";
  const config = ALERT_CONFIG[alert.category] || ALERT_CONFIG.weather;
  const AlertIcon = config.Icon;

  return (
    <div
      className={`w-full px-4 py-3 flex items-center gap-3 text-[14px] font-bold transition-colors ${
        isCritical
          ? "bg-kv-record/15 border-b border-kv-record/30 text-kv-record"
          : "bg-[#f59e0b]/10 border-b border-[#f59e0b]/20 text-[#f59e0b]"
      }`}
    >
      <AlertIcon className="w-5 h-5 shrink-0" />
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="truncate">
          <span className="font-extrabold">{alert.title}</span>
          {" — "}
          <span className="font-medium opacity-90">{alert.body}</span>
        </p>
      </div>
      {alerts.length > 1 && (
        <span className="shrink-0 text-[12px] opacity-70">
          {currentIndex + 1}/{alerts.length}
        </span>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   Chat Tab
   ──────────────────────────────────────────── */

interface ChatDoc {
  _id: unknown;
  transcript?: string;
  aiResponse?: string;
  timestamp: number;
}

function ChatTab({
  lang,
  t,
  history,
  isRecording,
  isProcessing,
  activeQueryData,
  error,
  setError,
  firstName,
  chatEndRef,
}: {
  lang: AppLanguage;
  t: UiStrings;
  history: ChatDoc[];
  isRecording: boolean;
  isProcessing: boolean;
  activeQueryData: {
    status?: string;
    transcript?: string;
    errorMessage?: string;
  } | null | undefined;
  error: string | null;
  setError: (e: string | null) => void;
  firstName: string;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  const welcomeTitle = t.mainWelcomeTitle.replace("{name}", firstName);
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full flex flex-col gap-6">
      {!history.length && !isRecording && !isProcessing && (
        <div className="bg-kv-surface rounded-[24px] p-6 shadow-[0_8px_32px_var(--kv-primary-soft)] border border-kv-border/10">
          <p
            className={`text-[26px] font-extrabold text-kv-text mb-2 tracking-tight ${lang === "kashmiri" ? "font-nastaliq" : ""}`}
            dir={lang === "kashmiri" ? "rtl" : "ltr"}
          >
            {lang === "kashmiri" ? <Kas>{welcomeTitle}</Kas> : welcomeTitle}
          </p>
          <p
            className={`text-[18px] text-kv-text-muted leading-relaxed ${lang === "kashmiri" ? "font-nastaliq" : ""}`}
            dir={lang === "kashmiri" ? "rtl" : "ltr"}
          >
            {lang === "kashmiri" ? (
              <Kas>{t.mainWelcomeSubtitle}</Kas>
            ) : (
              t.mainWelcomeSubtitle
            )}
          </p>
          <div className="mt-4 pt-4 border-t border-kv-border/15">
            <p
              className={`text-[14px] text-kv-primary/80 font-bold flex items-center gap-2 ${lang === "kashmiri" ? "font-nastaliq" : ""}`}
              dir={lang === "kashmiri" ? "rtl" : "ltr"}
            >
              <Zap className="w-4 h-4 shrink-0" />
              {lang === "kashmiri" ? (
                <Kas>{t.intelHintTitle}</Kas>
              ) : (
                <span>{t.intelHintTitle}</span>
              )}
            </p>
            <p
              className={`text-[13px] text-kv-text-muted/60 mt-1 ${lang === "kashmiri" ? "font-nastaliq" : ""}`}
              dir={lang === "kashmiri" ? "rtl" : "ltr"}
            >
              {lang === "kashmiri" ? (
                <Kas>{t.intelHintSubtitle}</Kas>
              ) : (
                t.intelHintSubtitle
              )}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {history
          .slice()
          .reverse()
          .map((chat) => {
            let parsed: PriceData | null = null;
            try {
              parsed = JSON.parse(chat.aiResponse!) as PriceData;
            } catch {
              /* skip */
            }
            return (
              <div key={String(chat._id)} className="flex flex-col gap-4">
                {chat.transcript && (
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-br from-kv-bubble-from to-kv-bubble-to text-kv-text border border-kv-primary/20 rounded-[20px] rounded-br-[4px] px-5 py-4 max-w-[85%] shadow-[0_4px_16px_var(--kv-primary-soft)]">
                      <p className="text-[17px] font-semibold leading-relaxed">
                        🎤 {chat.transcript}
                      </p>
                      <p className="text-[12px] text-kv-primary/70 mt-2 text-right font-medium">
                        {timeAgo(chat.timestamp)}
                      </p>
                    </div>
                  </div>
                )}

                {parsed && (
                  <div className="flex justify-start">
                    <div className="max-w-[95%]">
                      <MiniResultCard data={parsed} lang={lang} t={t} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {isRecording && (
        <div className="flex justify-end mt-4">
          <div className="bg-kv-surface-3/80 backdrop-blur-md border border-kv-record/40 rounded-[20px] rounded-br-[4px] px-5 py-4 max-w-[85%] shadow-[0_4px_20px_rgba(255,115,81,0.15)]">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kv-record opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-kv-record" />
              </span>
              <span
                className={`text-[17px] font-bold text-kv-record ${lang === "kashmiri" ? "font-nastaliq" : ""}`}
                dir={lang === "kashmiri" ? "rtl" : "ltr"}
              >
                {lang === "kashmiri" ? (
                  <Kas>{t.listening}</Kas>
                ) : (
                  t.listening
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {activeQueryData?.transcript && activeQueryData.status !== "complete" && (
        <div className="flex justify-end mt-4">
          <div className="bg-gradient-to-br from-kv-bubble-from to-kv-bubble-to text-kv-text border border-kv-primary/20 rounded-[20px] rounded-br-[4px] px-5 py-4 max-w-[85%] shadow-[0_4px_16px_var(--kv-primary-soft)]">
            <p className="text-[17px] font-semibold leading-relaxed">
              🎤 {activeQueryData.transcript}
            </p>
          </div>
        </div>
      )}

      {isProcessing && !isRecording && (
        <div className="flex justify-start mt-4">
          <div className="bg-kv-surface border border-kv-border/20 rounded-[20px] rounded-bl-[4px] px-6 py-5 shadow-sm">
            <div className="flex items-center gap-4">
              <Loader2 className="w-6 h-6 animate-spin text-kv-primary" />
              <span
                className={`text-[18px] font-bold text-kv-text ${lang === "kashmiri" ? "font-nastaliq" : ""}`}
                dir={lang === "kashmiri" ? "rtl" : "ltr"}
              >
                {lang === "kashmiri" ? (
                  <Kas>
                    {activeQueryData?.status === "transcribing"
                      ? t.understanding
                      : t.searchingPrices}
                  </Kas>
                ) : activeQueryData?.status === "transcribing" ? (
                  t.understanding
                ) : (
                  t.searchingPrices
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex justify-start mt-4">
          <div className="bg-kv-surface-3 border border-kv-record/30 rounded-[20px] rounded-bl-[4px] px-6 py-5 max-w-[92%]">
            <p className="text-[16px] font-semibold text-kv-record">
              ⚠️ {error}
            </p>
            <button
              onClick={() => setError(null)}
              className="mt-3 text-[14px] text-kv-record underline font-bold cursor-pointer hover:text-kv-record/80 transition-colors"
            >
              {t.dismiss}
            </button>
          </div>
        </div>
      )}

      <div ref={chatEndRef} className="h-4" />
    </div>
  );
}

/* ────────────────────────────────────────────
   Intel Tab
   ──────────────────────────────────────────── */

function IntelTab({
  lang,
  t,
  briefingData,
  isBriefingLoading,
  briefingError,
  setBriefingError,
  showDetail,
  setShowDetail,
  onRefresh,
  criticalAlerts,
}: {
  lang: AppLanguage;
  t: UiStrings;
  briefingData: BriefingData | null;
  isBriefingLoading: boolean;
  briefingError: string | null;
  setBriefingError: (v: string | null) => void;
  showDetail: boolean;
  setShowDetail: (v: boolean) => void;
  onRefresh: () => void;
  criticalAlerts: AlertDoc[];
}) {
  const sourcePills = [
    t.intelSourceWeather,
    t.intelSourceHighway,
    t.intelSourceSubsidy,
    t.intelSourcePest,
    t.intelSourceMarket,
  ];

  if (isBriefingLoading) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-kv-primary animate-spin mx-auto mb-4" />
          <p
            className={`text-[20px] font-bold text-kv-text ${lang === "kashmiri" ? "font-nastaliq" : ""}`}
            dir={lang === "kashmiri" ? "rtl" : "ltr"}
          >
            {lang === "kashmiri" ? (
              <Kas>{t.intelLoadingTitle}</Kas>
            ) : (
              t.intelLoadingTitle
            )}
          </p>
          <p
            className={`text-[15px] text-kv-text-muted mt-2 font-medium ${lang === "kashmiri" ? "font-nastaliq" : ""}`}
            dir={lang === "kashmiri" ? "rtl" : "ltr"}
          >
            {lang === "kashmiri" ? (
              <Kas>{t.intelLoadingSubtitle}</Kas>
            ) : (
              t.intelLoadingSubtitle
            )}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {sourcePills.map((s) => (
              <span
                key={s}
                className="px-3 py-1.5 bg-kv-surface border border-kv-border/20 rounded-full text-[12px] font-bold text-kv-text-muted animate-pulse"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!briefingData) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-sm">
          <Zap className="w-16 h-16 text-kv-amber/40 mx-auto mb-4" />
          <p
            className={`text-[22px] font-extrabold text-kv-text mb-2 ${lang === "kashmiri" ? "font-nastaliq" : ""}`}
            dir={lang === "kashmiri" ? "rtl" : "ltr"}
          >
            {lang === "kashmiri" ? (
              <Kas>{t.intelEmptyTitle}</Kas>
            ) : (
              t.intelEmptyTitle
            )}
          </p>
          <p
            className={`text-[16px] text-kv-text-muted mb-4 leading-relaxed ${lang === "kashmiri" ? "font-nastaliq" : ""}`}
            dir={lang === "kashmiri" ? "rtl" : "ltr"}
          >
            {lang === "kashmiri" ? (
              <Kas>{t.intelEmptyBody}</Kas>
            ) : (
              t.intelEmptyBody
            )}
          </p>
          <p
            className={`text-[14px] text-kv-text-muted/70 mb-6 ${lang === "kashmiri" ? "font-nastaliq" : ""}`}
            dir={lang === "kashmiri" ? "rtl" : "ltr"}
          >
            {lang === "kashmiri" ? (
              <Kas>{t.intelEmptyHint}</Kas>
            ) : (
              t.intelEmptyHint
            )}
          </p>
          {briefingError && (
            <div className="mb-6 rounded-[16px] border border-kv-record/30 bg-kv-record/10 px-4 py-3 text-left">
              <p className="text-[14px] font-semibold text-kv-record break-words">
                {briefingError}
              </p>
              <button
                type="button"
                onClick={() => setBriefingError(null)}
                className="mt-2 text-[13px] text-kv-record underline font-bold"
              >
                {t.dismiss}
              </button>
            </div>
          )}
          <button
            onClick={onRefresh}
            className="px-8 py-4 bg-gradient-to-b from-kv-primary to-kv-primary-end text-kv-primary-fg rounded-[16px] font-extrabold text-[17px] shadow-[0_8px_32px_var(--kv-mic-glow)] hover:shadow-[0_8px_40px_var(--kv-mic-glow)] cursor-pointer active:scale-95 transition-all"
          >
            <Zap className="w-5 h-5 inline-block mr-2 -mt-0.5" />
            <span
              className={lang === "kashmiri" ? "font-nastaliq" : ""}
              dir={lang === "kashmiri" ? "rtl" : "ltr"}
            >
              {lang === "kashmiri" ? <Kas>{t.getBriefing}</Kas> : t.getBriefing}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full space-y-5">
      {briefingError && (
        <div className="rounded-[16px] border border-kv-record/30 bg-kv-record/10 px-4 py-3">
          <p className="text-[14px] font-semibold text-kv-record break-words">
            {briefingError}
          </p>
          <button
            type="button"
            onClick={() => setBriefingError(null)}
            className="mt-2 text-[13px] text-kv-record underline font-bold"
          >
            {t.dismiss}
          </button>
        </div>
      )}
      {/* Morning Briefing Card */}
      <div className="bg-gradient-to-b from-kv-surface-2 to-kv-surface rounded-[24px] p-6 border border-kv-primary/15 shadow-[0_8px_32px_var(--kv-primary-soft)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-6 h-6 text-kv-primary" />
            <span
              className={`text-[16px] font-extrabold text-kv-primary uppercase tracking-wide ${lang === "kashmiri" ? "font-nastaliq" : ""}`}
              dir={lang === "kashmiri" ? "rtl" : "ltr"}
            >
              {lang === "kashmiri" ? (
                <Kas>{t.morningBriefingLabel}</Kas>
              ) : (
                t.morningBriefingLabel
              )}
            </span>
          </div>
          <button
            onClick={onRefresh}
            className="w-9 h-9 rounded-full bg-kv-bg border border-kv-border/30 flex items-center justify-center cursor-pointer hover:bg-kv-surface-hover transition-colors active:scale-95"
            aria-label={t.ariaRefreshBriefing}
          >
            <RefreshCw className="w-4 h-4 text-kv-text-muted" />
          </button>
        </div>

        {lang === "kashmiri" &&
          (briefingData.morningBriefingKashmiri || briefingData.morningBriefing) && (
            <p
              dir="rtl"
              className="text-[19px] leading-[1.8] text-kv-text font-nastaliq mb-3"
            >
              {briefingData.morningBriefingKashmiri ||
                briefingData.morningBriefing}
            </p>
          )}

        {lang === "hindi" &&
          (briefingData.morningBriefingHindi || briefingData.morningBriefing) && (
            <p className="text-[16px] leading-relaxed text-kv-text mb-3">
              {briefingData.morningBriefingHindi ||
                briefingData.morningBriefing}
            </p>
          )}

        {lang === "english" && briefingData.morningBriefing && (
          <p className="text-[16px] leading-relaxed text-kv-text mb-3">
            {briefingData.morningBriefing}
          </p>
        )}

        <button
          onClick={() => setShowDetail(!showDetail)}
          className="mt-4 flex items-center gap-2 text-[14px] font-bold text-kv-primary cursor-pointer hover:text-kv-primary/80 transition-colors"
        >
          {showDetail ? (
            <>
              <ChevronUp className="w-4 h-4" /> {t.lessDetail}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" /> {t.moreDetail}
            </>
          )}
        </button>
      </div>

      {/* Expanded Details */}
      {showDetail && (
        <div className="space-y-4">
          {/* Highway Status */}
          {briefingData.highway && (
            <IntelCard
              icon={<Truck className="w-5 h-5" />}
              title={t.nh44Title}
              titleKas={t.nh44TitleKas}
              lang={lang}
              color={
                briefingData.highway.status === "closed"
                  ? "red"
                  : briefingData.highway.status === "restricted"
                    ? "yellow"
                    : "green"
              }
            >
              <p className="text-[15px] font-bold text-kv-text mb-1">
                {t.nh44StatusPrefix}{" "}
                <span
                  className={
                    briefingData.highway.status === "closed"
                      ? "text-kv-record"
                      : briefingData.highway.status === "restricted"
                        ? "text-kv-amber"
                        : "text-kv-primary"
                  }
                >
                  {briefingData.highway.status.toUpperCase()}
                </span>
              </p>
              <p className="text-[14px] text-kv-text-muted leading-relaxed">
                {briefingData.highway.detail}
              </p>
              {briefingData.highway.advice && (
                <p className="mt-2 text-[14px] text-kv-amber font-bold">
                  💡 {briefingData.highway.advice}
                </p>
              )}
            </IntelCard>
          )}

          {/* Subsidies */}
          {briefingData.subsidies && briefingData.subsidies.length > 0 && (
            <IntelCard
              icon={<Landmark className="w-5 h-5" />}
              title={t.subsidiesTitle}
              titleKas={t.subsidiesTitleKas}
              lang={lang}
              color="purple"
            >
              <div className="space-y-3">
                {briefingData.subsidies.map((sub, i) => (
                  <div
                    key={i}
                    className="bg-kv-bg/50 rounded-[12px] p-3 border border-kv-border/15"
                  >
                    <p className="text-[15px] font-bold text-kv-text">
                      {sub.name}
                    </p>
                    {sub.deadline && (
                      <p className="text-[13px] text-[#a78bfa] font-bold mt-1">
                        <Clock className="w-3.5 h-3.5 inline mr-1" />
                        {t.deadlineLabel}: {sub.deadline}
                      </p>
                    )}
                    <p className="text-[13px] text-kv-text-muted mt-1">
                      {sub.detail}
                    </p>
                  </div>
                ))}
              </div>
            </IntelCard>
          )}

          {/* Pest Warnings */}
          {briefingData.pestWarnings &&
            briefingData.pestWarnings.length > 0 && (
              <IntelCard
                icon={<Bug className="w-5 h-5" />}
                title={t.pestTitle}
                titleKas={t.pestTitleKas}
                lang={lang}
                color="orange"
              >
                <div className="space-y-3">
                  {briefingData.pestWarnings.map((pw, i) => (
                    <div
                      key={i}
                      className="bg-kv-bg/50 rounded-[12px] p-3 border border-kv-border/15"
                    >
                      <p className="text-[15px] font-bold text-kv-text">
                        {pw.crop} — {pw.issue}
                      </p>
                      <p className="text-[13px] text-[#f97316] font-bold mt-1">
                        ⚡ {pw.action}
                      </p>
                    </div>
                  ))}
                </div>
              </IntelCard>
            )}

          {/* Market Vibe */}
          {briefingData.marketVibe && (
            <IntelCard
              icon={<Heart className="w-5 h-5" />}
              title={t.marketSentimentTitle}
              titleKas={t.marketSentimentTitleKas}
              lang={lang}
              color="green"
            >
              <p className="text-[15px] text-kv-text leading-relaxed">
                {briefingData.marketVibe}
              </p>
            </IntelCard>
          )}

          {/* Active Alerts */}
          {criticalAlerts.length > 0 && (
            <div className="space-y-3">
              <p className="text-[14px] font-extrabold text-kv-record uppercase tracking-wide flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {t.activeAlerts}
              </p>
              {criticalAlerts.map((alert) => {
                const config =
                  ALERT_CONFIG[alert.category] || ALERT_CONFIG.weather;
                const Icon = config.Icon;
                return (
                  <div
                    key={String(alert._id)}
                    className={`rounded-[16px] p-4 border ${config.bg}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.color}`} />
                      <div>
                        <p className={`text-[15px] font-bold ${config.color}`}>
                          {alert.title}
                        </p>
                        {lang === "kashmiri" ? (
                          <p
                            dir="rtl"
                            className="text-[14px] text-kv-text-muted mt-1 leading-relaxed font-nastaliq"
                          >
                            {alert.bodyKashmiri || alert.body}
                          </p>
                        ) : (
                          <p className="text-[14px] text-kv-text-muted mt-1 leading-relaxed">
                            {alert.body}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   Intel Card (reusable wrapper)
   ──────────────────────────────────────────── */

function IntelCard({
  icon,
  title,
  titleKas,
  lang,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  titleKas: string;
  lang: AppLanguage;
  color: "red" | "yellow" | "green" | "purple" | "orange" | "blue";
  children: React.ReactNode;
}) {
  const colorMap = {
    red: {
      border: "border-kv-record/20",
      icon: "text-kv-record",
      bg: "bg-kv-record/5",
    },
    yellow: {
      border: "border-kv-amber/20",
      icon: "text-kv-amber",
      bg: "bg-[#ffd709]/5",
    },
    green: {
      border: "border-kv-primary/20",
      icon: "text-kv-primary",
      bg: "bg-kv-primary/5",
    },
    purple: {
      border: "border-[#a78bfa]/20",
      icon: "text-[#a78bfa]",
      bg: "bg-[#a78bfa]/5",
    },
    orange: {
      border: "border-[#f97316]/20",
      icon: "text-[#f97316]",
      bg: "bg-[#f97316]/5",
    },
    blue: {
      border: "border-[#60a5fa]/20",
      icon: "text-[#60a5fa]",
      bg: "bg-[#60a5fa]/5",
    },
  };

  const c = colorMap[color];

  return (
    <div
      className={`rounded-[20px] border ${c.border} ${c.bg} p-5 shadow-sm`}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <span className={c.icon}>{icon}</span>
        {lang === "kashmiri" ? (
          <span
            dir="rtl"
            className="text-[14px] font-extrabold text-kv-text uppercase tracking-wider font-nastaliq"
          >
            <Kas>{titleKas}</Kas>
          </span>
        ) : (
          <span className="text-[14px] font-extrabold text-kv-text uppercase tracking-wider">
            {title}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────
   Mini Result Card (chat bubble)
   ──────────────────────────────────────────── */

function MiniResultCard({
  data,
  lang,
  t,
}: {
  data: PriceData;
  lang: AppLanguage;
  t: UiStrings;
}) {
  const directionConfig = {
    up: {
      Icon: TrendingUp,
      bg: "bg-[#b6fbc3]/10",
      text: "text-[#b6fbc3]",
      label: "↑",
    },
    down: {
      Icon: TrendingDown,
      bg: "bg-kv-record/10",
      text: "text-kv-record",
      label: "↓",
    },
    stable: {
      Icon: Minus,
      bg: "bg-kv-amber/10",
      text: "text-kv-amber",
      label: "—",
    },
  };

  const dir = directionConfig[data.priceDirection] || directionConfig.stable;
  const DirIcon = dir.Icon;

  const confBg =
    data.confidence === "high"
      ? "bg-kv-primary/10 text-kv-primary border border-kv-primary/20"
      : data.confidence === "medium"
        ? "bg-kv-amber/10 text-kv-amber border border-kv-amber/20"
        : "bg-kv-text-muted/10 text-kv-text-muted border border-kv-border/20";

  const commodityPrimary =
    lang === "kashmiri"
      ? data.commodityKashmiri || data.commodity
      : lang === "hindi"
        ? data.commodityLocal || data.commodity
        : data.commodity;

  const summaryPrimary =
    lang === "kashmiri"
      ? data.summaryKashmiri || data.summary
      : lang === "hindi"
        ? data.summaryLocal || data.summary
        : data.summary;

  const unitDisplay =
    !data.unit || /quintal/i.test(data.unit)
      ? t.unitPerQuintal
      : data.unit;

  const confidenceText =
    data.confidence === "high"
      ? t.confidenceHigh
      : data.confidence === "medium"
        ? t.confidenceMedium
        : t.confidenceLow;

  const showTip = lang === "english" && data.additionalInfo;

  return (
    <div className="bg-kv-surface border border-kv-border/20 rounded-[24px] rounded-bl-[8px] overflow-hidden shadow-[0_4px_24px_var(--kv-shadow)]">
      {/* Header */}
      <div className="p-5 pb-4 bg-gradient-to-b from-kv-surface-2 to-kv-surface relative">
        <div className="absolute inset-0 bg-kv-primary/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="flex flex-wrap items-center gap-4 mb-4 relative z-10">
          <div className="w-14 h-14 rounded-[16px] bg-kv-bg border border-kv-border/30 flex items-center justify-center text-[32px] shadow-inner">
            {getCommodityEmoji(data.commodity)}
          </div>
          <div className="flex-1 min-w-0">
            {lang === "kashmiri" ? (
              <p
                dir="rtl"
                className="text-[22px] font-extrabold text-kv-text leading-tight mb-1 font-nastaliq"
              >
                <Kas>{commodityPrimary}</Kas>
              </p>
            ) : (
              <p className="text-[22px] font-extrabold text-kv-text leading-tight mb-1">
                {commodityPrimary}
              </p>
            )}
          </div>
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[14px] font-bold ${dir.bg} ${dir.text}`}
          >
            <DirIcon className="w-4 h-4" strokeWidth={3} />
            {dir.label} {Math.abs(data.priceChange).toFixed(1)}%
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-2 relative z-10">
          <p className="text-[42px] font-black leading-none text-kv-primary tracking-tight">
            {formatPrice(data.currentPrice)}
          </p>
          <p className="text-[15px] text-kv-text-muted font-bold uppercase tracking-wider">
            / {unitDisplay}
          </p>
        </div>
      </div>

      {/* Summary + Highway */}
      <div className="px-5 pb-5 space-y-3 mt-1 relative z-10">
        {lang === "kashmiri" ? (
          <p
            dir="rtl"
            className="text-[17px] leading-relaxed text-kv-text/90 font-nastaliq"
          >
            <Kas>{summaryPrimary}</Kas>
          </p>
        ) : (
          <p className="text-[15px] leading-relaxed text-kv-text-muted font-medium">
            {summaryPrimary}
          </p>
        )}

        {/* Highway Status in price card */}
        {data.highway && data.highway.status !== "unknown" && (
          <div
            className={`rounded-[16px] p-4 mt-3 flex items-start gap-3 border ${
              data.highway.status === "closed"
                ? "bg-kv-record/8 border-kv-record/25"
                : data.highway.status === "restricted"
                  ? "bg-[#ffd709]/8 border-kv-amber/25"
                  : "bg-kv-primary/5 border-kv-primary/20"
            }`}
          >
            <Truck
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                data.highway.status === "closed"
                  ? "text-kv-record"
                  : data.highway.status === "restricted"
                    ? "text-kv-amber"
                    : "text-kv-primary"
              }`}
            />
            <div className="min-w-0">
              {lang === "kashmiri" && data.highwayKashmiri ? (
                <p
                  dir="rtl"
                  className="text-[14px] font-extrabold text-kv-text font-nastaliq leading-snug"
                >
                  <Kas>{data.highwayKashmiri}</Kas>
                </p>
              ) : (
                <>
                  <p
                    className={`text-[14px] font-extrabold ${
                      data.highway.status === "closed"
                        ? "text-kv-record"
                        : data.highway.status === "restricted"
                          ? "text-kv-amber"
                          : "text-kv-primary"
                    }`}
                  >
                    {t.nh44StatusPrefix}{" "}
                    {data.highway.status.toUpperCase()}
                  </p>
                  <p className="text-[13px] text-kv-text-muted mt-1 leading-relaxed">
                    {data.highway.detail}
                  </p>
                  {data.highway.advice && (
                    <p className="text-[13px] text-kv-amber font-bold mt-1">
                      {data.highway.advice}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {showTip && (
          <div className="bg-kv-surface-3 border border-kv-border/20 rounded-[16px] p-4 mt-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-kv-primary/50 group-hover:bg-kv-primary transition-colors" />
            <p className="text-[14px] text-kv-primary font-bold leading-relaxed flex items-start gap-3">
              <span className="text-[18px]">💡</span>
              <span>{data.additionalInfo}</span>
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 mt-4 border-t border-kv-border/20">
          <div className="flex items-center gap-2 text-[13px] font-bold text-kv-text-muted">
            <MapPin className="w-4 h-4 text-kv-amber" />
            <span className="line-clamp-1">{data.market}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-kv-text-muted">
              <Clock className="w-3.5 h-3.5" />
              <span>{data.lastUpdated || "Today"}</span>
            </div>
            <div
              className={`flex items-center gap-1.5 text-[11px] font-extrabold px-2.5 py-1.5 rounded-[8px] uppercase tracking-wide ${confBg}`}
            >
              <Shield className="w-3.5 h-3.5" strokeWidth={2.5} />
              {lang === "kashmiri" ? (
                <Kas className="text-[11px] leading-none normal-case">
                  {confidenceText}
                </Kas>
              ) : (
                <span className="text-[11px] leading-none normal-case">
                  {confidenceText}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

