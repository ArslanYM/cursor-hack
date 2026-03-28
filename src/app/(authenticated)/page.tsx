"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useMutation, useAction, useQuery } from "convex/react";
import { useUser, UserButton } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
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
  ChevronRight,
  ArrowRight,
  RefreshCw,
  Volume2,
  Zap,
  Heart,
  Globe,
  Sparkles,
  BookOpen,
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
      {/* Placeholder - Rest of main app component will be imported from old page.tsx */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Wheat className="w-12 h-12 text-kv-primary mx-auto mb-4" />
          <p className="text-lg font-semibold">KisanVoice App Loading...</p>
        </div>
      </div>
    </main>
  );
}
