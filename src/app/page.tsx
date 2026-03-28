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
} from "lucide-react";

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

/* ────────────────────────────────────────────
   Language & i18n
   ──────────────────────────────────────────── */

type AppLanguage = "kashmiri" | "hindi" | "english";

const LANGUAGES: {
  id: AppLanguage;
  name: string;
  nativeName: string;
  script: string;
  emoji: string;
  greeting: string;
  dir: "ltr" | "rtl";
}[] = [
  {
    id: "kashmiri",
    name: "Kashmiri",
    nativeName: "کٲشُر",
    script: "Nastaliq",
    emoji: "🏔️",
    greeting: "اسلام علیکم",
    dir: "rtl",
  },
  {
    id: "hindi",
    name: "Hindi",
    nativeName: "हिन्दी",
    script: "Devanagari",
    emoji: "🇮🇳",
    greeting: "नमस्ते",
    dir: "ltr",
  },
  {
    id: "english",
    name: "English",
    nativeName: "English",
    script: "Latin",
    emoji: "🌐",
    greeting: "Hello",
    dir: "ltr",
  },
];

const UI_STRINGS: Record<
  AppLanguage,
  {
    welcomeTitle: string;
    welcomeSubtitle: string;
    chooseLanguage: string;
    next: string;
    getStarted: string;
    featureGuideTitle: string;
    featureGuideSubtitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    feature4Title: string;
    feature4Desc: string;
  }
> = {
  kashmiri: {
    welcomeTitle: "کِسان وائس مٕنٛز خوش آمدید",
    welcomeSubtitle: "پہلٕ زبان مُنتخب کرِو",
    chooseLanguage: "زبان چُنِو",
    next: "اگاد",
    getStarted: "شروع کرِو",
    featureGuideTitle: "تُہٕنٛد رہنُمایی",
    featureGuideSubtitle: "یِم چیزٕ کَرٕ سَکِو تُہٕ",
    feature1Title: "🎤 آواز سٕتھ پُچھِو",
    feature1Desc: "بٹن دبایِو تہٕ بولِو — اپنہٕ زبانٕ مَنٛز منڈی نرخ پُچھِو",
    feature2Title: "📊 صُبٲح کی بریفنگ",
    feature2Desc: "موسم، سڑک، سبسڈی تہٕ بازار — ہَر صبٲح تازہ خبریٖں",
    feature3Title: "🛣️ این ایچ ۴۴ سٹیٹس",
    feature3Desc: "ہائیوے بند ہویٕ تٕ فصل نٕ کٹِو — ایپ خبردار کٔرٕ",
    feature4Title: "🌾 ذہین مشورٕ",
    feature4Desc: "کیڑے مکوڑے، سبسڈی ڈیڈلاین — سٮ۪ب خبریٖں اکٹھٕ",
  },
  hindi: {
    welcomeTitle: "KisanVoice में आपका स्वागत है",
    welcomeSubtitle: "पहले अपनी भाषा चुनें",
    chooseLanguage: "भाषा चुनें",
    next: "आगे",
    getStarted: "शुरू करें",
    featureGuideTitle: "आपकी गाइड",
    featureGuideSubtitle: "आप ये सब कर सकते हैं",
    feature1Title: "🎤 आवाज़ से पूछें",
    feature1Desc: "बटन दबाएं और बोलें — अपनी भाषा में मंडी भाव पूछें",
    feature2Title: "📊 सुबह की ब्रीफिंग",
    feature2Desc: "मौसम, सड़क, सब्सिडी और बाजार — हर सुबह ताज़ा जानकारी",
    feature3Title: "🛣️ NH44 स्टेटस",
    feature3Desc: "हाईवे बंद हो तो फसल न काटें — ऐप आपको बताएगा",
    feature4Title: "🌾 स्मार्ट सलाह",
    feature4Desc: "कीड़े-मकोड़े, सब्सिडी डेडलाइन — सब जानकारी एक जगह",
  },
  english: {
    welcomeTitle: "Welcome to KisanVoice",
    welcomeSubtitle: "First, choose your language",
    chooseLanguage: "Choose Language",
    next: "Next",
    getStarted: "Get Started",
    featureGuideTitle: "Your Quick Guide",
    featureGuideSubtitle: "Here's what you can do",
    feature1Title: "🎤 Ask with Voice",
    feature1Desc:
      "Tap the mic and speak — ask mandi prices in your own language",
    feature2Title: "📊 Morning Briefing",
    feature2Desc:
      "Weather, highway, subsidies, and market — fresh intel every morning",
    feature3Title: "🛣️ NH44 Status",
    feature3Desc:
      "Highway closed? The app warns you not to harvest perishables",
    feature4Title: "🌾 Smart Advice",
    feature4Desc:
      "Pest alerts, subsidy deadlines — all intelligence in one place",
  },
};

/* ────────────────────────────────────────────
   Main Page
   ──────────────────────────────────────────── */

export default function KisanVoice() {
  const { user, isLoaded } = useUser();
  const storeUser = useMutation(api.users.store);
  const currentUser = useQuery(api.users.current);
  const completeOnboarding = useMutation(api.users.completeOnboarding);

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

  const t = UI_STRINGS[selectedLanguage];

  const [activeQueryId, setActiveQueryId] = useState<Id<"queries"> | null>(
    null
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isPipelinePending, setIsPipelinePending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [briefingData, setBriefingData] = useState<BriefingData | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [showBriefingDetail, setShowBriefingDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "intel">("chat");

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
      setError(
        activeQueryData.errorMessage || "کچھ غلط ہوٗو — कुछ गलत हुआ"
      );
    }
    if (activeQueryData?.status === "complete") {
      setIsPipelinePending(false);
    }
  }, [activeQueryData?.status, activeQueryData?.errorMessage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history?.length, activeQueryData?.status, isPipelinePending]);

  /* ── Fetch smart context / briefing ── */
  const fetchBriefing = useCallback(async () => {
    setIsBriefingLoading(true);
    try {
      const result = await getSmartContext({
        location: currentUser?.location || "Srinagar",
        crops: currentUser?.crops || ["Apple", "Walnut", "Saffron"],
      });
      const data = result as unknown as BriefingData;
      setBriefingData(data);
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "CACHE_BRIEFING",
          payload: data,
        });
      }
    } catch (err) {
      console.error("Briefing fetch failed:", err);
    } finally {
      setIsBriefingLoading(false);
    }
  }, [getSmartContext, currentUser?.location, currentUser?.crops]);

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
            setError(
              "ریکارڈنگ مُختَسَر — रिकॉर्डिंग बहुत छोटी थी, फिर से बोलें"
            );
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
            err instanceof Error ? err.message : "Processing failed"
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
      setError("مایکروفون چالو کرِو — माइक्रोफोन की अनुमति दें");
    }
  }, [createQuery, processQuery, stopRecording]);

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
      <main className="min-h-screen bg-[#0a1009] flex items-center justify-center">
        <div className="text-center">
          <Wheat
            className="w-16 h-16 text-[#8eff71] mx-auto mb-6 animate-pulse"
            strokeWidth={2}
          />
          <p className="text-[22px] font-extrabold text-[#f8fef3] tracking-tight">
            KisanVoice
          </p>
          <Loader2 className="w-6 h-6 text-[#8eff71] animate-spin mx-auto mt-4" />
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
    <main className="min-h-screen bg-[#0a1009] flex flex-col font-sans text-[#f8fef3]">
      {/* ── Critical Alert Ticker ── */}
      {criticalAlerts.length > 0 && (
        <AlertTicker alerts={criticalAlerts} />
      )}

      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-30 bg-[#0a1009]/80 backdrop-blur-[24px] border-b border-[#434a41]/15 px-5 py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <Wheat className="w-7 h-7 text-[#8eff71]" strokeWidth={2.5} />
            <span className="text-[22px] font-extrabold tracking-tight text-[#f8fef3]">
              KisanVoice
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchBriefing}
              disabled={isBriefingLoading}
              className="w-10 h-10 rounded-full bg-[#141b14] border border-[#434a41]/30 flex items-center justify-center cursor-pointer hover:bg-[#192219] transition-colors active:scale-95"
              aria-label="Get morning briefing"
            >
              {isBriefingLoading ? (
                <Loader2 className="w-5 h-5 text-[#8eff71] animate-spin" />
              ) : (
                <Zap className="w-5 h-5 text-[#ffd709]" />
              )}
            </button>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-[#192219]",
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* ── Tab Bar ── */}
      <div className="px-5 pt-4 max-w-lg mx-auto w-full">
        <div className="flex bg-[#141b14] rounded-[16px] p-1.5 border border-[#434a41]/15">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-3 rounded-[12px] text-[15px] font-bold transition-all cursor-pointer ${
              activeTab === "chat"
                ? "bg-[#8eff71] text-[#050a05] shadow-[0_2px_12px_rgba(142,255,113,0.3)]"
                : "text-[#a6ada3] hover:text-[#f8fef3]"
            }`}
          >
            <Mic className="w-4 h-4 inline-block mr-2 -mt-0.5" />
            <Kas className="text-[14px]">بولِو</Kas> · Ask
          </button>
          <button
            onClick={() => setActiveTab("intel")}
            className={`flex-1 py-3 rounded-[12px] text-[15px] font-bold transition-all cursor-pointer relative ${
              activeTab === "intel"
                ? "bg-[#8eff71] text-[#050a05] shadow-[0_2px_12px_rgba(142,255,113,0.3)]"
                : "text-[#a6ada3] hover:text-[#f8fef3]"
            }`}
          >
            <Zap className="w-4 h-4 inline-block mr-2 -mt-0.5" />
            <Kas className="text-[14px]">خبریٖں</Kas> · Intel
            {criticalAlerts.length > 0 && activeTab !== "intel" && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff7351] rounded-full text-[11px] font-black flex items-center justify-center text-white">
                {criticalAlerts.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Content Area ── */}
      {activeTab === "chat" ? (
        <ChatTab
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
          briefingData={briefingData}
          isBriefingLoading={isBriefingLoading}
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
            <p className="text-[13px] text-[#a6ada3] text-center mb-4 font-bold tracking-[0.1em] uppercase">
              <Kas>یِتھ بولِو:</Kas> · Quick Queries
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { emoji: "🍎", label: "سیب" },
                { emoji: "🥜", label: "اخروٹ" },
                { emoji: "🌸", label: "کونگ" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-[#141b14] hover:bg-[#192219] transition-colors cursor-pointer border border-[#434a41]/20 rounded-[16px] px-3 py-4 flex flex-col items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_16px_rgba(142,255,113,0.05)] hover:-translate-y-0.5"
                >
                  <span className="text-[28px] drop-shadow-md">{s.emoji}</span>
                  <span className="text-[16px] font-bold text-[#f8fef3]/90">
                    <Kas>{s.label}</Kas>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* ── Mic Bar (sticky bottom) ── */}
      <div className="sticky bottom-0 z-30 bg-[#0a1009]/80 backdrop-blur-[24px] border-t border-[#434a41]/10 px-4 py-5">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-6">
          {completedChats.length > 0 && !isRecording && !isProcessing && (
            <div className="flex items-center gap-2 text-[14px] font-bold text-[#a6ada3] bg-[#141b14] px-4 py-2 rounded-full border border-[#434a41]/20">
              <MessageCircle className="w-4 h-4 text-[#8eff71]" />
              <span>{completedChats.length}</span>
            </div>
          )}

          <button
            onClick={handleMicPress}
            disabled={isProcessing}
            aria-label={
              isRecording
                ? "रिकॉर्डिंग रोकें — Tap to stop"
                : "बोलना शुरू करें — Tap to speak"
            }
            className={[
              "relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden",
              "transition-all duration-300 active:scale-95 cursor-pointer",
              "focus:outline-none",
              isRecording
                ? "bg-[#ff7351] shadow-[0_0_40px_rgba(255,115,81,0.5)] scale-105"
                : isProcessing
                  ? "bg-[#1f281f] border-2 border-[#8eff71]/30 cursor-wait shadow-[0_4px_20px_rgba(142,255,113,0.1)]"
                  : "bg-gradient-to-b from-[#8eff71] to-[#2be800] shadow-[0_8px_32px_rgba(142,255,113,0.3)] hover:shadow-[0_8px_40px_rgba(142,255,113,0.5)] hover:-translate-y-1",
              "disabled:opacity-70 disabled:cursor-wait",
            ].join(" ")}
          >
            {isProcessing ? (
              <Loader2 className="w-10 h-10 text-[#8eff71] animate-spin" />
            ) : isRecording ? (
              <Square className="w-10 h-10 text-[#000000] fill-[#000000]" />
            ) : (
              <Mic className="w-11 h-11 text-[#050a05]" strokeWidth={2.5} />
            )}
          </button>

          {!isRecording && !isProcessing && (
            <p className="text-[14px] text-[#a6ada3] font-bold w-20 text-center leading-tight">
              <Kas>بٹن دَبٲوِتھ بولِو</Kas>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

/* ────────────────────────────────────────────
   Language Selection Screen
   ──────────────────────────────────────────── */

function LanguageSelectScreen({
  selectedLanguage,
  onSelect,
  onNext,
  t,
}: {
  selectedLanguage: AppLanguage;
  onSelect: (lang: AppLanguage) => void;
  onNext: () => void;
  t: (typeof UI_STRINGS)[AppLanguage];
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

/* ────────────────────────────────────────────
   Feature Guide Screen
   ──────────────────────────────────────────── */

function FeatureGuideScreen({
  language,
  onComplete,
  t,
}: {
  language: AppLanguage;
  onComplete: () => void;
  t: (typeof UI_STRINGS)[AppLanguage];
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
          ? "bg-[#ff7351]/15 border-b border-[#ff7351]/30 text-[#ff7351]"
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
  history,
  isRecording,
  isProcessing,
  activeQueryData,
  error,
  setError,
  firstName,
  chatEndRef,
}: {
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
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full flex flex-col gap-6">
      {!history.length && !isRecording && !isProcessing && (
        <div className="bg-[#141b14] rounded-[24px] p-6 shadow-[0_8px_32px_rgba(142,255,113,0.03)] border border-[#434a41]/10">
          <p className="text-[26px] font-extrabold text-[#f8fef3] mb-2 tracking-tight">
            <Kas>اسلام علیکم</Kas> {firstName}! 👋
          </p>
          <p className="text-[18px] text-[#a6ada3] leading-relaxed">
            <Kas>بٹن دبایِو تہٕ بولِو — منڈی نرخ پُچھِو</Kas>
          </p>
          <p className="text-[15px] text-[#a6ada3]/70 mt-2 font-medium">
            बटन दबाएं और बोलें — मंडी भाव पूछें
          </p>
          <div className="mt-4 pt-4 border-t border-[#434a41]/15">
            <p className="text-[14px] text-[#8eff71]/80 font-bold flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <Kas>خبریٖں ٹیب دبایِو صُبٲح کی بریفنگ کٲتھ</Kas>
            </p>
            <p className="text-[13px] text-[#a6ada3]/60 mt-1">
              Tap Intel tab for your morning briefing
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
                    <div className="bg-gradient-to-br from-[#192219] to-[#1f281f] text-[#f8fef3] border border-[#8eff71]/20 rounded-[20px] rounded-br-[4px] px-5 py-4 max-w-[85%] shadow-[0_4px_16px_rgba(142,255,113,0.05)]">
                      <p className="text-[17px] font-semibold leading-relaxed">
                        🎤 {chat.transcript}
                      </p>
                      <p className="text-[12px] text-[#8eff71]/70 mt-2 text-right font-medium">
                        {timeAgo(chat.timestamp)}
                      </p>
                    </div>
                  </div>
                )}

                {parsed && (
                  <div className="flex justify-start">
                    <div className="max-w-[95%]">
                      <MiniResultCard data={parsed} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {isRecording && (
        <div className="flex justify-end mt-4">
          <div className="bg-[#1f281f]/80 backdrop-blur-md border border-[#ff7351]/40 rounded-[20px] rounded-br-[4px] px-5 py-4 max-w-[85%] shadow-[0_4px_20px_rgba(255,115,81,0.15)]">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7351] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff7351]" />
              </span>
              <span className="text-[17px] font-bold text-[#ff7351]">
                <Kas>بۄزان چھِو...</Kas>
              </span>
              <span className="text-[14px] text-[#ff7351]/80 font-medium ml-2">
                सुन रहे हैं
              </span>
            </div>
          </div>
        </div>
      )}

      {activeQueryData?.transcript && activeQueryData.status !== "complete" && (
        <div className="flex justify-end mt-4">
          <div className="bg-gradient-to-br from-[#192219] to-[#1f281f] text-[#f8fef3] border border-[#8eff71]/20 rounded-[20px] rounded-br-[4px] px-5 py-4 max-w-[85%] shadow-[0_4px_16px_rgba(142,255,113,0.05)]">
            <p className="text-[17px] font-semibold leading-relaxed">
              🎤 {activeQueryData.transcript}
            </p>
          </div>
        </div>
      )}

      {isProcessing && !isRecording && (
        <div className="flex justify-start mt-4">
          <div className="bg-[#141b14] border border-[#434a41]/20 rounded-[20px] rounded-bl-[4px] px-6 py-5 shadow-sm">
            <div className="flex items-center gap-4">
              <Loader2 className="w-6 h-6 animate-spin text-[#8eff71]" />
              <span className="text-[18px] font-bold text-[#f8fef3]">
                <Kas>
                  {activeQueryData?.status === "transcribing"
                    ? "سمجان چھِو..."
                    : "نرخ لبان چھِو..."}
                </Kas>
              </span>
            </div>
            <p className="text-[14px] text-[#a6ada3] mt-2 font-medium ml-10">
              {activeQueryData?.status === "transcribing"
                ? "समझ रहे हैं..."
                : "कीमतें खोज रहे हैं..."}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex justify-start mt-4">
          <div className="bg-[#1f281f] border border-[#ff7351]/30 rounded-[20px] rounded-bl-[4px] px-6 py-5 max-w-[92%]">
            <p className="text-[16px] font-semibold text-[#ff7351]">
              ⚠️ {error}
            </p>
            <button
              onClick={() => setError(null)}
              className="mt-3 text-[14px] text-[#ff7351] underline font-bold cursor-pointer hover:text-[#ff7351]/80 transition-colors"
            >
              Dismiss
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
  briefingData,
  isBriefingLoading,
  showDetail,
  setShowDetail,
  onRefresh,
  criticalAlerts,
}: {
  briefingData: BriefingData | null;
  isBriefingLoading: boolean;
  showDetail: boolean;
  setShowDetail: (v: boolean) => void;
  onRefresh: () => void;
  criticalAlerts: AlertDoc[];
}) {
  if (isBriefingLoading) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#8eff71] animate-spin mx-auto mb-4" />
          <p className="text-[20px] font-bold text-[#f8fef3]">
            <Kas>معلومات جمع کران چھِو...</Kas>
          </p>
          <p className="text-[15px] text-[#a6ada3] mt-2 font-medium">
            Gathering intelligence from 5 sources...
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {["Weather", "Highway", "Subsidies", "Pests", "Market"].map(
              (s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 bg-[#141b14] border border-[#434a41]/20 rounded-full text-[12px] font-bold text-[#a6ada3] animate-pulse"
                >
                  {s}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!briefingData) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-sm">
          <Zap className="w-16 h-16 text-[#ffd709]/40 mx-auto mb-4" />
          <p className="text-[22px] font-extrabold text-[#f8fef3] mb-2">
            <Kas>صبٲح کی بریفنگ</Kas>
          </p>
          <p className="text-[16px] text-[#a6ada3] mb-6 leading-relaxed">
            <Kas>بٹن دَبٲوِتھ ہَر صُبح خبریٖں حاصل کرِو</Kas>
          </p>
          <p className="text-[14px] text-[#a6ada3]/70 mb-6">
            Tap to get weather, highway, subsidies, pest alerts & market vibe
          </p>
          <button
            onClick={onRefresh}
            className="px-8 py-4 bg-gradient-to-b from-[#8eff71] to-[#2be800] text-[#050a05] rounded-[16px] font-extrabold text-[17px] shadow-[0_8px_32px_rgba(142,255,113,0.3)] hover:shadow-[0_8px_40px_rgba(142,255,113,0.5)] cursor-pointer active:scale-95 transition-all"
          >
            <Zap className="w-5 h-5 inline-block mr-2 -mt-0.5" />
            <Kas>بریفنگ حاصل کرِو</Kas> · Get Briefing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full space-y-5">
      {/* Morning Briefing Card */}
      <div className="bg-gradient-to-b from-[#192219] to-[#141b14] rounded-[24px] p-6 border border-[#8eff71]/15 shadow-[0_8px_32px_rgba(142,255,113,0.05)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-6 h-6 text-[#8eff71]" />
            <span className="text-[16px] font-extrabold text-[#8eff71] uppercase tracking-wide">
              Morning Briefing
            </span>
          </div>
          <button
            onClick={onRefresh}
            className="w-9 h-9 rounded-full bg-[#0a1009] border border-[#434a41]/30 flex items-center justify-center cursor-pointer hover:bg-[#192219] transition-colors active:scale-95"
            aria-label="Refresh briefing"
          >
            <RefreshCw className="w-4 h-4 text-[#a6ada3]" />
          </button>
        </div>

        {briefingData.morningBriefingKashmiri && (
          <p
            dir="rtl"
            className="text-[19px] leading-[1.8] text-[#f8fef3] font-nastaliq mb-3"
          >
            {briefingData.morningBriefingKashmiri}
          </p>
        )}

        {briefingData.morningBriefingHindi && (
          <p className="text-[15px] leading-relaxed text-[#a6ada3] mb-3">
            {briefingData.morningBriefingHindi}
          </p>
        )}

        {briefingData.morningBriefing && (
          <p className="text-[14px] leading-relaxed text-[#a6ada3]/70">
            {briefingData.morningBriefing}
          </p>
        )}

        <button
          onClick={() => setShowDetail(!showDetail)}
          className="mt-4 flex items-center gap-2 text-[14px] font-bold text-[#8eff71] cursor-pointer hover:text-[#8eff71]/80 transition-colors"
        >
          {showDetail ? (
            <>
              <ChevronUp className="w-4 h-4" /> Less detail
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" /> More detail
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
              title="NH44 Highway"
              titleKas="این ایچ ۴۴ ہائیوے"
              color={
                briefingData.highway.status === "closed"
                  ? "red"
                  : briefingData.highway.status === "restricted"
                    ? "yellow"
                    : "green"
              }
            >
              <p className="text-[15px] font-bold text-[#f8fef3] mb-1">
                Status:{" "}
                <span
                  className={
                    briefingData.highway.status === "closed"
                      ? "text-[#ff7351]"
                      : briefingData.highway.status === "restricted"
                        ? "text-[#ffd709]"
                        : "text-[#8eff71]"
                  }
                >
                  {briefingData.highway.status.toUpperCase()}
                </span>
              </p>
              <p className="text-[14px] text-[#a6ada3] leading-relaxed">
                {briefingData.highway.detail}
              </p>
              {briefingData.highway.advice && (
                <p className="mt-2 text-[14px] text-[#ffd709] font-bold">
                  💡 {briefingData.highway.advice}
                </p>
              )}
            </IntelCard>
          )}

          {/* Subsidies */}
          {briefingData.subsidies && briefingData.subsidies.length > 0 && (
            <IntelCard
              icon={<Landmark className="w-5 h-5" />}
              title="Subsidies & Schemes"
              titleKas="سبسڈی تہٕ سکیمز"
              color="purple"
            >
              <div className="space-y-3">
                {briefingData.subsidies.map((sub, i) => (
                  <div
                    key={i}
                    className="bg-[#0a1009]/50 rounded-[12px] p-3 border border-[#434a41]/15"
                  >
                    <p className="text-[15px] font-bold text-[#f8fef3]">
                      {sub.name}
                    </p>
                    {sub.deadline && (
                      <p className="text-[13px] text-[#a78bfa] font-bold mt-1">
                        <Clock className="w-3.5 h-3.5 inline mr-1" />
                        Deadline: {sub.deadline}
                      </p>
                    )}
                    <p className="text-[13px] text-[#a6ada3] mt-1">
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
                title="Pest & Disease Alerts"
                titleKas="کیڑے مکوڑے"
                color="orange"
              >
                <div className="space-y-3">
                  {briefingData.pestWarnings.map((pw, i) => (
                    <div
                      key={i}
                      className="bg-[#0a1009]/50 rounded-[12px] p-3 border border-[#434a41]/15"
                    >
                      <p className="text-[15px] font-bold text-[#f8fef3]">
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
              title="Market Sentiment"
              titleKas="بازار کا مزاج"
              color="green"
            >
              <p className="text-[15px] text-[#f8fef3] leading-relaxed">
                {briefingData.marketVibe}
              </p>
            </IntelCard>
          )}

          {/* Active Alerts */}
          {criticalAlerts.length > 0 && (
            <div className="space-y-3">
              <p className="text-[14px] font-extrabold text-[#ff7351] uppercase tracking-wide flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Active Alerts
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
                        <p className="text-[14px] text-[#a6ada3] mt-1 leading-relaxed">
                          {alert.body}
                        </p>
                        {alert.bodyKashmiri && (
                          <p
                            dir="rtl"
                            className="text-[14px] text-[#f8fef3]/70 mt-1 font-nastaliq"
                          >
                            {alert.bodyKashmiri}
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
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  titleKas: string;
  color: "red" | "yellow" | "green" | "purple" | "orange" | "blue";
  children: React.ReactNode;
}) {
  const colorMap = {
    red: {
      border: "border-[#ff7351]/20",
      icon: "text-[#ff7351]",
      bg: "bg-[#ff7351]/5",
    },
    yellow: {
      border: "border-[#ffd709]/20",
      icon: "text-[#ffd709]",
      bg: "bg-[#ffd709]/5",
    },
    green: {
      border: "border-[#8eff71]/20",
      icon: "text-[#8eff71]",
      bg: "bg-[#8eff71]/5",
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
        <span className="text-[14px] font-extrabold text-[#f8fef3] uppercase tracking-wider">
          {title}
        </span>
        <span className="text-[13px] font-bold text-[#a6ada3]">
          · <Kas className="text-[13px]">{titleKas}</Kas>
        </span>
      </div>
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────
   Mini Result Card (chat bubble)
   ──────────────────────────────────────────── */

function MiniResultCard({ data }: { data: PriceData }) {
  const directionConfig = {
    up: {
      Icon: TrendingUp,
      bg: "bg-[#b6fbc3]/10",
      text: "text-[#b6fbc3]",
      label: "↑",
    },
    down: {
      Icon: TrendingDown,
      bg: "bg-[#ff7351]/10",
      text: "text-[#ff7351]",
      label: "↓",
    },
    stable: {
      Icon: Minus,
      bg: "bg-[#ffd709]/10",
      text: "text-[#ffd709]",
      label: "—",
    },
  };

  const dir = directionConfig[data.priceDirection] || directionConfig.stable;
  const DirIcon = dir.Icon;

  const confBg =
    data.confidence === "high"
      ? "bg-[#8eff71]/10 text-[#8eff71] border border-[#8eff71]/20"
      : "bg-[#ffd709]/10 text-[#ffd709] border border-[#ffd709]/20";

  return (
    <div className="bg-[#141b14] border border-[#434a41]/20 rounded-[24px] rounded-bl-[8px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {/* Header */}
      <div className="p-5 pb-4 bg-gradient-to-b from-[#192219] to-[#141b14] relative">
        <div className="absolute inset-0 bg-[#8eff71]/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="flex flex-wrap items-center gap-4 mb-4 relative z-10">
          <div className="w-14 h-14 rounded-[16px] bg-[#0a1009] border border-[#434a41]/30 flex items-center justify-center text-[32px] shadow-inner">
            {getCommodityEmoji(data.commodity)}
          </div>
          <div className="flex-1 min-w-0">
            {data.commodityKashmiri && (
              <p className="text-[22px] font-extrabold text-[#f8fef3] leading-tight mb-1">
                <Kas>{data.commodityKashmiri}</Kas>
              </p>
            )}
            <p className="text-[14px] font-bold text-[#a6ada3] uppercase tracking-wider">
              {data.commodityLocal || data.commodity}
            </p>
          </div>
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[14px] font-bold ${dir.bg} ${dir.text}`}
          >
            <DirIcon className="w-4 h-4" strokeWidth={3} />
            {dir.label} {Math.abs(data.priceChange).toFixed(1)}%
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-2 relative z-10">
          <p className="text-[42px] font-black leading-none text-[#8eff71] tracking-tight">
            {formatPrice(data.currentPrice)}
          </p>
          <p className="text-[15px] text-[#a6ada3] font-bold uppercase tracking-wider">
            / {data.unit || "Quintal"}
          </p>
        </div>
      </div>

      {/* Summary + Highway */}
      <div className="px-5 pb-5 space-y-3 mt-1 relative z-10">
        {data.summaryKashmiri && (
          <p
            dir="rtl"
            className="text-[17px] leading-relaxed text-[#f8fef3]/90 font-nastaliq"
          >
            {data.summaryKashmiri}
          </p>
        )}
        <p className="text-[15px] leading-relaxed text-[#a6ada3] font-medium">
          {data.summaryLocal || data.summary}
        </p>

        {/* Highway Status in price card */}
        {data.highway && data.highway.status !== "unknown" && (
          <div
            className={`rounded-[16px] p-4 mt-3 flex items-start gap-3 border ${
              data.highway.status === "closed"
                ? "bg-[#ff7351]/8 border-[#ff7351]/25"
                : data.highway.status === "restricted"
                  ? "bg-[#ffd709]/8 border-[#ffd709]/25"
                  : "bg-[#8eff71]/5 border-[#8eff71]/20"
            }`}
          >
            <Truck
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                data.highway.status === "closed"
                  ? "text-[#ff7351]"
                  : data.highway.status === "restricted"
                    ? "text-[#ffd709]"
                    : "text-[#8eff71]"
              }`}
            />
            <div>
              <p
                className={`text-[14px] font-extrabold ${
                  data.highway.status === "closed"
                    ? "text-[#ff7351]"
                    : data.highway.status === "restricted"
                      ? "text-[#ffd709]"
                      : "text-[#8eff71]"
                }`}
              >
                NH44: {data.highway.status.toUpperCase()}
              </p>
              <p className="text-[13px] text-[#a6ada3] mt-0.5">
                {data.highway.advice}
              </p>
              {data.highwayKashmiri && (
                <p
                  dir="rtl"
                  className="text-[13px] text-[#f8fef3]/60 font-nastaliq mt-1"
                >
                  {data.highwayKashmiri}
                </p>
              )}
            </div>
          </div>
        )}

        {data.additionalInfo && (
          <div className="bg-[#1f281f] border border-[#434a41]/20 rounded-[16px] p-4 mt-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#8eff71]/50 group-hover:bg-[#8eff71] transition-colors" />
            <p className="text-[14px] text-[#8eff71] font-bold leading-relaxed flex items-start gap-3">
              <span className="text-[18px]">💡</span>
              <span>{data.additionalInfo}</span>
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 mt-4 border-t border-[#434a41]/20">
          <div className="flex items-center gap-2 text-[13px] font-bold text-[#a6ada3]">
            <MapPin className="w-4 h-4 text-[#ffd709]" />
            <span className="line-clamp-1">{data.market}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#a6ada3]">
              <Clock className="w-3.5 h-3.5" />
              <span>{data.lastUpdated || "Today"}</span>
            </div>
            <div
              className={`flex items-center gap-1.5 text-[11px] font-extrabold px-2.5 py-1.5 rounded-[8px] uppercase tracking-wide ${confBg}`}
            >
              <Shield className="w-3.5 h-3.5" strokeWidth={2.5} />
              {data.confidence === "high" ? (
                <Kas className="text-[11px] leading-none">بھروسہٕ مَند</Kas>
              ) : (
                <Kas className="text-[11px] leading-none">اندازَن</Kas>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

