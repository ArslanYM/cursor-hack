"use node";

import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const API_TIMEOUT_MS = 20_000;

interface ExaResult {
  title?: string;
  text?: string;
  url?: string;
}

async function exaSearch(
  query: string,
  numResults = 5,
  maxChars = 1500
): Promise<ExaResult[]> {
  const EXA_API_KEY = process.env.EXA_API_KEY;
  if (!EXA_API_KEY) throw new Error("EXA_API_KEY not configured");

  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": EXA_API_KEY,
    },
    body: JSON.stringify({
      query,
      type: "neural",
      useAutoprompt: true,
      numResults,
      contents: { text: { maxCharacters: maxChars } },
    }),
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Exa search failed (${res.status}): ${body}`);
  }

  const data: { results?: ExaResult[] } = await res.json();
  return data.results ?? [];
}

function formatExaResults(results: ExaResult[]): string {
  return (
    results
      .map(
        (r) =>
          `Source: ${r.title || "Unknown"}\nURL: ${r.url || ""}\n${r.text || ""}`
      )
      .join("\n\n---\n\n") || "No results found."
  );
}

async function groqChat(
  systemPrompt: string,
  userPrompt: string,
  jsonMode = true
): Promise<string> {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY not configured");

  const res = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 2048,
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Groq LLM failed (${res.status}): ${body}`);
  }

  const data: {
    choices?: Array<{ message?: { content?: string } }>;
  } = await res.json();

  return data.choices?.[0]?.message?.content || "";
}

/* ─── Individual data streams ─── */

async function fetchNews(location: string): Promise<{
  weather: ExaResult[];
  general: ExaResult[];
}> {
  const [weather, general] = await Promise.allSettled([
    exaSearch(
      `${location} Kashmir weather warning alert today agriculture`,
      3,
      800
    ),
    exaSearch(
      `${location} Kashmir agriculture news farmer update today`,
      3,
      800
    ),
  ]);

  return {
    weather: weather.status === "fulfilled" ? weather.value : [],
    general: general.status === "fulfilled" ? general.value : [],
  };
}

async function fetchHighwayStatus(): Promise<ExaResult[]> {
  return exaSearch(
    "Srinagar Jammu highway NH44 status today open closed traffic",
    3,
    600
  );
}

async function fetchSubsidies(): Promise<ExaResult[]> {
  return exaSearch(
    "Kashmir Jammu agriculture farmer subsidy scheme PM-Kisan government notification deadline 2025 2026",
    4,
    1000
  );
}

async function fetchPestInfo(crops: string[]): Promise<ExaResult[]> {
  const cropStr = crops.join(", ");
  return exaSearch(
    `${cropStr} pest disease warning Kashmir India agriculture university bulletin`,
    3,
    800
  );
}

async function fetchMarketSentiment(crops: string[]): Promise<ExaResult[]> {
  const cropStr = crops.join(" ");
  return exaSearch(
    `Kashmir ${cropStr} farmer trade news market sentiment protest mandi`,
    3,
    600
  );
}

/* ─── Synthesize all streams into a briefing via LLM ─── */

async function synthesizeBriefing(
  location: string,
  crops: string[],
  streams: {
    news: { weather: ExaResult[]; general: ExaResult[] };
    highway: ExaResult[];
    subsidies: ExaResult[];
    pest: ExaResult[];
    sentiment: ExaResult[];
  }
): Promise<Record<string, unknown>> {
  const systemPrompt = `You are a Kashmiri agricultural intelligence assistant. Given 5 raw data streams about a farmer's region, produce a structured daily briefing.

Return valid JSON:
{
  "morningBriefing": "3 sentences max, in simple English — the key things a farmer needs to know today",
  "morningBriefingKashmiri": "Same briefing in Kashmiri Nastaliq script",
  "morningBriefingHindi": "Same briefing in simple Hindi Devanagari",
  "voiceScript": "A 30-second script the AI can read aloud to the farmer — conversational, warm, actionable",
  "alerts": [
    {
      "category": "weather|highway|subsidy|pest|market",
      "severity": "critical|warning|info",
      "title": "Short title in English",
      "titleKashmiri": "Kashmiri Nastaliq translation",
      "body": "1-2 sentence detail",
      "bodyKashmiri": "Kashmiri translation",
      "bodyHindi": "Hindi translation"
    }
  ],
  "highway": {
    "status": "open|closed|restricted",
    "detail": "1 sentence about NH44 Srinagar-Jammu highway",
    "advice": "Should the farmer harvest or wait? 1 sentence"
  },
  "subsidies": [
    {
      "name": "Scheme name",
      "deadline": "Date or 'ongoing'",
      "detail": "1 sentence what it is and who qualifies"
    }
  ],
  "pestWarnings": [
    {
      "crop": "Crop name",
      "issue": "Pest/disease name",
      "action": "What to do — 1 sentence"
    }
  ],
  "marketVibe": "1 sentence: is the market optimistic, pessimistic, or stable?"
}

Rules:
- Be extremely concise. Farmers have limited time and literacy.
- If a data stream has no useful data, omit that section or mark it neutral.
- Highway advice is CRITICAL: if road is closed, tell the farmer NOT to harvest perishables.
- Subsidies: highlight only those with approaching deadlines.
- Voice script should be warm, like a neighbor telling you the news.`;

  const userPrompt = `Location: ${location}
Crops: ${crops.join(", ")}

--- WEATHER & NEWS ---
${formatExaResults([...streams.news.weather, ...streams.news.general])}

--- HIGHWAY STATUS ---
${formatExaResults(streams.highway)}

--- GOVERNMENT SUBSIDIES ---
${formatExaResults(streams.subsidies)}

--- PEST & DISEASE BULLETINS ---
${formatExaResults(streams.pest)}

--- MARKET SENTIMENT ---
${formatExaResults(streams.sentiment)}`;

  const content = await groqChat(systemPrompt, userPrompt, true);

  try {
    return JSON.parse(content);
  } catch {
    return {
      morningBriefing: content,
      morningBriefingKashmiri: "",
      morningBriefingHindi: "",
      voiceScript: content,
      alerts: [],
      highway: { status: "unknown", detail: content, advice: "" },
      subsidies: [],
      pestWarnings: [],
      marketVibe: "",
    };
  }
}

/* ─── Main action: getSmartContext ─── */

export const getSmartContext = action({
  args: {
    location: v.optional(v.string()),
    crops: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const location = args.location || "Srinagar";
    const crops = args.crops?.length ? args.crops : ["Apple", "Walnut", "Saffron"];

    console.log(`[KV:Smart] Starting smart context for ${location}, crops: ${crops.join(", ")}`);

    const [newsResult, highwayResult, subsidyResult, pestResult, sentimentResult] =
      await Promise.allSettled([
        fetchNews(location),
        fetchHighwayStatus(),
        fetchSubsidies(),
        fetchPestInfo(crops),
        fetchMarketSentiment(crops),
      ]);

    const streams = {
      news:
        newsResult.status === "fulfilled"
          ? newsResult.value
          : { weather: [], general: [] },
      highway:
        highwayResult.status === "fulfilled" ? highwayResult.value : [],
      subsidies:
        subsidyResult.status === "fulfilled" ? subsidyResult.value : [],
      pest: pestResult.status === "fulfilled" ? pestResult.value : [],
      sentiment:
        sentimentResult.status === "fulfilled" ? sentimentResult.value : [],
    };

    console.log(
      `[KV:Smart] Data fetched — news:${streams.news.weather.length + streams.news.general.length} highway:${streams.highway.length} subsidies:${streams.subsidies.length} pest:${streams.pest.length} sentiment:${streams.sentiment.length}`
    );

    console.log("[KV:Smart] Synthesizing briefing via LLM...");
    const briefing = await synthesizeBriefing(location, crops, streams);
    console.log("[KV:Smart] Briefing complete!");

    const alerts = Array.isArray(briefing.alerts)
      ? (briefing.alerts as Array<{
          category: string;
          severity: string;
          title: string;
          body: string;
        }>)
      : [];

    const highway = briefing.highway as
      | { status: string; detail: string; advice: string }
      | undefined;

    const subsidies = Array.isArray(briefing.subsidies)
      ? (briefing.subsidies as Array<{
          name: string;
          deadline?: string;
          detail: string;
        }>)
      : [];

    await ctx.runMutation(internal.smartContextMutations.saveBriefing, {
      tokenIdentifier: identity.tokenIdentifier,
      location,
      crops,
      smartContext: JSON.stringify(briefing),
      voiceScript: (briefing.voiceScript as string) || "",
      alerts,
      highway: highway || undefined,
      subsidies: subsidies.length > 0 ? subsidies : undefined,
    });

    for (const alert of alerts) {
      const cat = alert.category as
        | "weather"
        | "highway"
        | "subsidy"
        | "pest"
        | "market";
      const sev = alert.severity as "critical" | "warning" | "info";
      if (
        ["weather", "highway", "subsidy", "pest", "market"].includes(cat) &&
        ["critical", "warning", "info"].includes(sev)
      ) {
        await ctx.runMutation(internal.smartContextMutations.saveAlert, {
          category: cat,
          severity: sev,
          title: alert.title || "",
          body: alert.body || "",
          bodyKashmiri: (alert as Record<string, string>).bodyKashmiri || undefined,
        });
      }
    }

    return briefing;
  },
});

/* ─── Pest diagnostic action (standalone voice flow) ─── */

export const diagnosePest = action({
  args: {
    symptoms: v.string(),
    crop: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const crop = args.crop || "crops";
    console.log(`[KV:Pest] Diagnosing: "${args.symptoms}" for ${crop}`);

    const results = await exaSearch(
      `${crop} ${args.symptoms} pest disease diagnosis treatment Kashmir India agriculture research`,
      5,
      1200
    );

    const content = await groqChat(
      `You are an agricultural pest/disease expert for Kashmir farmers. Given symptom descriptions and research results, diagnose the likely issue and give actionable treatment advice.

Return valid JSON:
{
  "diagnosis": "Most likely pest/disease name",
  "diagnosisLocal": "Hindi name",
  "diagnosisKashmiri": "Kashmiri Nastaliq name",
  "confidence": "high|medium|low",
  "symptoms": ["symptom 1", "symptom 2"],
  "treatment": "2-3 sentence treatment in simple English",
  "treatmentLocal": "Hindi translation",
  "treatmentKashmiri": "Kashmiri Nastaliq translation",
  "prevention": "1 sentence prevention tip",
  "urgency": "immediate|soon|monitor",
  "voiceScript": "A warm 20-second script explaining the issue and what to do, as if talking to a neighbor"
}`,
      `Crop: ${crop}\nSymptoms described by farmer: "${args.symptoms}"\n\nResearch results:\n${formatExaResults(results)}`,
      true
    );

    try {
      return JSON.parse(content);
    } catch {
      return {
        diagnosis: "Unknown",
        diagnosisLocal: "अज्ञात",
        diagnosisKashmiri: "نامعلوم",
        confidence: "low",
        symptoms: [args.symptoms],
        treatment: content,
        treatmentLocal: "",
        treatmentKashmiri: "",
        prevention: "",
        urgency: "monitor",
        voiceScript: content,
      };
    }
  },
});
