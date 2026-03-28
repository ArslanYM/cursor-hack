"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const API_TIMEOUT_MS = 25_000;

function formatPipelineError(error: unknown): string {
  if (!(error instanceof Error)) return "Processing failed";
  const name = error.name;
  const msg = error.message.toLowerCase();
  if (
    name === "TimeoutError" ||
    name === "AbortError" ||
    msg.includes("timeout") ||
    msg.includes("aborted")
  ) {
    return (
      "نیٚٹَورٕ وَکھٕ — دُبارٕ کوشِش کٔرِو — Network timed out. Check internet and try again."
    );
  }
  return error.message;
}

export const processFarmerQuery = action({
  args: {
    queryId: v.id("queries"),
    audioBase64: v.string(),
    audioMimeType: v.string(),
  },
  handler: async (ctx, args) => {
    const { queryId, audioBase64, audioMimeType } = args;

    try {
      console.log(`[KV] Starting pipeline for query ${queryId}, audio size: ${audioBase64.length} chars`);

      await ctx.runMutation(internal.farmerQuery.updateQuery, {
        queryId,
        status: "transcribing",
      });

      console.log("[KV] Step 1/3: Transcribing audio via Groq Whisper...");
      const transcript = await transcribeAudio(audioBase64, audioMimeType);
      console.log(`[KV] Transcription complete: "${transcript.slice(0, 80)}..."`);

      await ctx.runMutation(internal.farmerQuery.updateQuery, {
        queryId,
        transcript,
        status: "searching",
      });

      console.log("[KV] Step 2/3: Searching mandi prices via Exa...");
      const searchResults = await searchMandiPrices(transcript);
      console.log(`[KV] Search complete: ${searchResults.length} chars of results`);

      console.log("[KV] Step 3/3: Structuring response via Groq LLM...");
      const structuredResponse = await structureResponse(
        transcript,
        searchResults
      );
      console.log("[KV] Pipeline complete!");

      await ctx.runMutation(internal.farmerQuery.updateQuery, {
        queryId,
        aiResponse: JSON.stringify(structuredResponse),
        status: "complete",
      });

      return structuredResponse;
    } catch (error) {
      const errorMessage = formatPipelineError(error);
      console.error(`[KV] Pipeline failed: ${errorMessage}`);
      await ctx.runMutation(internal.farmerQuery.updateQuery, {
        queryId,
        status: "error",
        errorMessage,
      });
      throw new Error(errorMessage);
    }
  },
});

async function transcribeAudio(
  audioBase64: string,
  mimeType: string
): Promise<string> {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");

  const audioBuffer = Buffer.from(audioBase64, "base64");

  const ext = mimeType.includes("webm")
    ? "webm"
    : mimeType.includes("mp4")
      ? "mp4"
      : mimeType.includes("wav")
        ? "wav"
        : mimeType.includes("ogg")
          ? "ogg"
          : "webm";

  const formData = new FormData();
  const blob = new Blob([audioBuffer], { type: mimeType });
  formData.append("file", blob, `recording.${ext}`);
  formData.append("model", "whisper-large-v3");
  formData.append("response_format", "json");

  const response = await fetch(
    "https://api.groq.com/openai/v1/audio/transcriptions",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
      body: formData,
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    }
  );

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(
      `Groq transcription failed (${response.status}): ${errBody}`
    );
  }

  const result: { text: string } = await response.json();
  return result.text;
}

async function searchMandiPrices(transcript: string): Promise<string> {
  const EXA_API_KEY = process.env.EXA_API_KEY;
  if (!EXA_API_KEY) throw new Error("EXA_API_KEY is not configured");

  const searchQuery = `Kashmir Srinagar mandi market prices ${transcript} agricultural commodity rates today India`;

  const response = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": EXA_API_KEY,
    },
    body: JSON.stringify({
      query: searchQuery,
      type: "neural",
      useAutoprompt: true,
      numResults: 5,
      contents: {
        text: { maxCharacters: 1500 },
      },
    }),
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Exa search failed (${response.status}): ${errBody}`);
  }

  const data: {
    results?: Array<{ title?: string; text?: string; url?: string }>;
  } = await response.json();

  return (
    data.results
      ?.map(
        (r) =>
          `Source: ${r.title || "Unknown"}\nURL: ${r.url || ""}\n${r.text || ""}`
      )
      .join("\n\n---\n\n") || "No search results found for this query."
  );
}

async function structureResponse(
  transcript: string,
  searchResults: string
): Promise<Record<string, unknown>> {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");

  const systemPrompt = `You are an agricultural market analyst for farmers in Kashmir, India.
Given a farmer's voice query (transcribed from Kashmiri, Hindi, or Urdu) and web search results about mandi prices, extract and return structured price information.

You MUST respond with valid JSON matching this schema exactly:
{
  "commodity": "English name (e.g. Apple, Walnut, Saffron)",
  "commodityLocal": "Hindi/Urdu name in Devanagari (e.g. सेब, अखरोट, केसर)",
  "commodityKashmiri": "Kashmiri name in Nastaliq script (e.g. ٹشونٹھ, دوٗن, کونگ)",
  "market": "Market/Mandi name (e.g. Srinagar, Sopore)",
  "currentPrice": <number in INR per quintal, or null if unavailable>,
  "previousPrice": <number or null>,
  "unit": "per quintal",
  "priceChange": <percentage change as number, positive=up negative=down, 0 if unknown>,
  "priceDirection": "up" | "down" | "stable",
  "lastUpdated": "Today" or a date string,
  "summary": "1-2 sentence summary in simple English",
  "summaryLocal": "Same summary in simple Hindi using Devanagari script",
  "summaryKashmiri": "Same summary in simple Kashmiri using Nastaliq (Perso-Arabic) script",
  "confidence": "high" | "medium" | "low",
  "additionalInfo": "Optional farming tip or market insight, or null"
}

Rules:
- Use real data from the search results when available
- If exact prices aren't found, give the best available estimate and set confidence to "low"
- Keep summaries extremely simple — the audience may have limited literacy
- ALWAYS include the Kashmiri Nastaliq translation (summaryKashmiri) — this is the primary language
- Also include Hindi/Devanagari (summaryLocal) as a secondary language
- For commodityKashmiri, use common Kashmiri names: ٹشونٹھ (apple), دوٗن (walnut), کونگ (saffron), تامُل (rice), کَنَک (wheat), بادام (almond)`;

  const response = await fetch(
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
          {
            role: "user",
            content: `Farmer's query: "${transcript}"\n\nSearch results about mandi prices:\n${searchResults}`,
          },
        ],
        temperature: 0.2,
        max_tokens: 1024,
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    }
  );

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Groq LLM failed (${response.status}): ${errBody}`);
  }

  const data: {
    choices?: Array<{ message?: { content?: string } }>;
  } = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Empty response from Groq LLM");
  }

  try {
    return JSON.parse(content);
  } catch {
    return {
      commodity: "Unknown",
      commodityLocal: "अज्ञात",
      commodityKashmiri: "نامعلوم",
      market: "Srinagar",
      currentPrice: null,
      previousPrice: null,
      unit: "per quintal",
      priceChange: 0,
      priceDirection: "stable",
      lastUpdated: "Today",
      summary: content,
      summaryLocal: "जानकारी उपलब्ध नहीं है",
      summaryKashmiri: "معلومات دستیاب نٕہ چھِ",
      confidence: "low",
      additionalInfo: null,
    };
  }
}
