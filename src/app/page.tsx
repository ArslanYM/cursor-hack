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
  RefreshCw,
  MessageCircle,
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
}

/* ────────────────────────────────────────────
   Main Page — Chat Interface
   ──────────────────────────────────────────── */

export default function KisanVoice() {
  const { user, isLoaded } = useUser();
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (isLoaded && user) {
      storeUser().catch(() => {});
    }
  }, [isLoaded, user, storeUser]);

  const [activeQueryId, setActiveQueryId] = useState<Id<"queries"> | null>(
    null
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isPipelinePending, setIsPipelinePending] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const activeQueryData = useQuery(
    api.farmerQuery.getQueryById,
    activeQueryId ? { queryId: activeQueryId } : "skip"
  );

  const history = useQuery(api.farmerQuery.getUserHistory) ?? [];

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

  /* ── Silence detection cleanup ── */
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

  /* ── Stop recording ── */
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
        /* optional in some browsers */
      }
      rec.stop();
    }
  }, [cleanupAudioAnalysis]);

  /* ── Start recording ── */
  const startRecording = useCallback(async () => {
    setError(null);
    setActiveQueryId(null);
    setIsPipelinePending(false);
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

          const qId = await createQuery({
            status: "transcribing",
          });
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

      /* ── Adaptive VAD via RMS energy detection ── */
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

  /* ── Derived state ── */
  const isProcessing =
    isPipelinePending ||
    activeQueryData?.status === "transcribing" ||
    activeQueryData?.status === "searching";

  const completedChats = history.filter(
    (q) => q.status === "complete" && q.aiResponse
  );

  const firstName = user?.firstName || "Farmer";

  /* ── Render ── */
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-card-border px-5 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2.5">
            <Wheat className="w-6 h-6 text-primary" strokeWidth={2.5} />
            <span className="text-[20px] font-extrabold tracking-tight text-foreground">
              KisanVoice
            </span>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </div>
      </header>

      {/* ── Chat Area ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full">
        {/* Welcome message (always shown at top) */}
        <div className="mb-6">
          <div className="bg-card border border-card-border rounded-2xl p-5 shadow-sm">
            <p className="text-[20px] font-bold text-foreground mb-1">
              <Kas>اسلام علیکم</Kas> {firstName}! 👋
            </p>
            <p className="text-[17px] text-muted leading-relaxed">
              <Kas>بٹن دبایِو تہٕ بولِو — منڈی نرخ پُچھِو</Kas>
            </p>
            <p className="text-[14px] text-muted/70 mt-1">
              बटन दबाएं और बोलें — मंडी भाव पूछें
            </p>
          </div>
        </div>

        {/* Chat history */}
        {completedChats
          .slice()
          .reverse()
          .map((chat) => {
            let parsed: PriceData | null = null;
            try {
              parsed = JSON.parse(chat.aiResponse!) as PriceData;
            } catch {
              /* skip bad entries */
            }
            return (
              <div key={chat._id} className="mb-4">
                {/* User bubble */}
                {chat.transcript && (
                  <div className="flex justify-end mb-2">
                    <div className="bg-primary text-white rounded-2xl rounded-br-md px-5 py-3 max-w-[85%] shadow-sm">
                      <p className="text-[18px] font-semibold leading-relaxed">
                        🎤 {chat.transcript}
                      </p>
                      <p className="text-[12px] text-white/60 mt-1 text-right">
                        {timeAgo(chat.timestamp)}
                      </p>
                    </div>
                  </div>
                )}

                {/* AI response bubble */}
                {parsed && (
                  <div className="flex justify-start">
                    <div className="max-w-[92%]">
                      <MiniResultCard data={parsed} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        {/* Active recording / processing state */}
        {isRecording && (
          <div className="flex justify-end mb-2">
            <div className="bg-danger/10 border-2 border-danger/30 rounded-2xl rounded-br-md px-5 py-3 max-w-[85%]">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-danger" />
                </span>
                <span className="text-[18px] font-bold text-danger">
                  <Kas>بۄزان چھِو...</Kas>
                </span>
                <span className="text-[14px] text-muted">सुन रहे हैं</span>
              </div>
            </div>
          </div>
        )}

        {activeQueryData?.transcript &&
          activeQueryData.status !== "complete" && (
            <div className="flex justify-end mb-2">
              <div className="bg-primary text-white rounded-2xl rounded-br-md px-5 py-3 max-w-[85%] shadow-sm">
                <p className="text-[18px] font-semibold leading-relaxed">
                  🎤 {activeQueryData.transcript}
                </p>
              </div>
            </div>
          )}

        {isProcessing && !isRecording && (
          <div className="flex justify-start mb-2">
            <div className="bg-card border border-card-border rounded-2xl rounded-bl-md px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-[18px] font-bold text-foreground">
                  <Kas>
                    {activeQueryData?.status === "transcribing"
                      ? "سمجان چھِو..."
                      : "نرخ لبان چھِو..."}
                  </Kas>
                </span>
              </div>
              <p className="text-[14px] text-muted mt-1">
                {activeQueryData?.status === "transcribing"
                  ? "समझ रहे हैं..."
                  : "कीमतें खोज रहे हैं..."}
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex justify-start mb-2">
            <div className="bg-danger-light border border-danger/20 rounded-2xl rounded-bl-md px-5 py-4 max-w-[92%]">
              <p className="text-[16px] font-semibold text-danger">
                ⚠️ {error}
              </p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-[14px] text-danger underline font-medium cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Bottom Suggestions (when no history) ── */}
      {completedChats.length === 0 && !isRecording && !isProcessing && (
        <div className="px-4 pb-3 max-w-lg mx-auto w-full">
          <p className="text-[14px] text-muted text-center mb-2 font-medium">
            <Kas>یِتھ بولِو:</Kas> · ऐसे बोलें:
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { emoji: "🍎", label: "سیب — सेब" },
              { emoji: "🥜", label: "اخروٹ — अखरोट" },
              { emoji: "🌸", label: "کونگ — केसर" },
            ].map((s) => (
              <div
                key={s.label}
                className="shrink-0 bg-card border border-card-border rounded-xl px-4 py-2.5 flex items-center gap-2"
              >
                <span className="text-[22px]">{s.emoji}</span>
                <span className="text-[14px] font-semibold text-foreground/70 whitespace-nowrap">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Mic Bar (sticky bottom) ── */}
      <div className="sticky bottom-0 z-30 bg-background/95 backdrop-blur-sm border-t border-card-border px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-4">
          {completedChats.length > 0 && !isRecording && !isProcessing && (
            <div className="flex items-center gap-1.5 text-[13px] text-muted">
              <MessageCircle className="w-4 h-4" />
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
              "relative w-20 h-20 rounded-full flex items-center justify-center",
              "transition-all duration-300 active:scale-95 cursor-pointer",
              "focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40",
              isRecording
                ? "bg-danger shadow-[0_0_40px_rgba(220,38,38,0.3)] animate-recording-pulse"
                : isProcessing
                  ? "bg-primary/50 cursor-wait"
                  : "bg-primary shadow-[0_4px_30px_rgba(232,93,4,0.35)] hover:shadow-[0_4px_40px_rgba(232,93,4,0.5)]",
              "disabled:opacity-50 disabled:cursor-wait",
            ].join(" ")}
          >
            {isProcessing ? (
              <Loader2 className="w-9 h-9 text-white animate-spin" />
            ) : isRecording ? (
              <Square className="w-8 h-8 text-white fill-white" />
            ) : (
              <Mic className="w-9 h-9 text-white" strokeWidth={2} />
            )}
          </button>

          <p className="text-[13px] text-muted font-medium w-20 text-center">
            {isRecording ? (
              <span className="text-danger font-bold">
                <Kas>بولِو...</Kas>
              </span>
            ) : isProcessing ? (
              <Kas>جاری...</Kas>
            ) : (
              <>
                <Kas>بولِو</Kas>
                <br />
                <span className="text-[11px]">बोलें</span>
              </>
            )}
          </p>
        </div>
      </div>
    </main>
  );
}

/* ────────────────────────────────────────────
   Mini Result Card (chat bubble style)
   ──────────────────────────────────────────── */

function MiniResultCard({ data }: { data: PriceData }) {
  const directionConfig = {
    up: {
      Icon: TrendingUp,
      bg: "bg-success-light",
      text: "text-success",
      label: "↑",
    },
    down: {
      Icon: TrendingDown,
      bg: "bg-danger-light",
      text: "text-danger",
      label: "↓",
    },
    stable: {
      Icon: Minus,
      bg: "bg-gray-100",
      text: "text-muted",
      label: "—",
    },
  };

  const dir = directionConfig[data.priceDirection] || directionConfig.stable;
  const DirIcon = dir.Icon;

  const confBg =
    data.confidence === "high"
      ? "bg-success-light text-success"
      : "bg-amber-50 text-amber-600";

  return (
    <div className="bg-card border border-card-border rounded-2xl rounded-bl-md overflow-hidden shadow-sm">
      {/* Header row */}
      <div className="p-4 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[32px] leading-none">
            {getCommodityEmoji(data.commodity)}
          </span>
          <div className="flex-1 min-w-0">
            {data.commodityKashmiri && (
              <p className="text-[18px] font-bold text-foreground leading-tight">
                <Kas>{data.commodityKashmiri}</Kas>
              </p>
            )}
            <p className="text-[16px] font-semibold text-foreground/70">
              {data.commodityLocal || data.commodity}
            </p>
          </div>
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[14px] font-bold ${dir.bg} ${dir.text}`}
          >
            <DirIcon className="w-4 h-4" strokeWidth={2.5} />
            {dir.label} {Math.abs(data.priceChange).toFixed(1)}%
          </div>
        </div>

        {/* Price */}
        <p className="text-[36px] font-extrabold leading-none text-foreground tracking-tight">
          {formatPrice(data.currentPrice)}
        </p>
        <p className="text-[13px] text-muted mt-1 font-medium">
          {data.unit || "per quintal"}
        </p>
      </div>

      {/* Summary */}
      <div className="px-4 pb-4 space-y-2">
        {data.summaryKashmiri && (
          <p
            dir="rtl"
            className="text-[16px] leading-relaxed text-foreground/80 font-nastaliq"
          >
            {data.summaryKashmiri}
          </p>
        )}
        <p className="text-[14px] leading-relaxed text-muted">
          {data.summaryLocal || data.summary}
        </p>

        {data.additionalInfo && (
          <div className="bg-accent rounded-xl p-3 mt-2">
            <p className="text-[13px] text-foreground/70 font-medium leading-relaxed">
              💡 {data.additionalInfo}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-[12px] text-muted">
            <MapPin className="w-3.5 h-3.5" />
            <span>{data.market}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[12px] text-muted">
              <Clock className="w-3.5 h-3.5" />
              <span>{data.lastUpdated || "Today"}</span>
            </div>
            <div
              className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${confBg}`}
            >
              <Shield className="w-3 h-3" />
              {data.confidence === "high" ? (
                <Kas className="text-[10px]">بھروسہٕ مَند</Kas>
              ) : (
                <Kas className="text-[10px]">اندازَن</Kas>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
