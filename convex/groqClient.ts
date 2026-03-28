"use node";

const API_TIMEOUT_MS = 20_000;

/** Primary model first; on 429/503 Groq tries the next (often separate quota / fewer tokens). */
export const GROQ_MODEL_CANDIDATES = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "llama-3.1-70b-versatile",
] as const;

/**
 * Chat completion with automatic fallback when a model is rate-limited or overloaded.
 */
export async function groqChat(
  systemPrompt: string,
  userPrompt: string,
  jsonMode = true,
  options?: { maxTokens?: number }
): Promise<string> {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY not configured");

  const maxTokens = options?.maxTokens ?? 1800;
  let lastStatus = 0;
  let lastBody = "";

  for (const model of GROQ_MODEL_CANDIDATES) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: maxTokens,
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    if (res.ok) {
      const data: {
        choices?: Array<{ message?: { content?: string } }>;
      } = await res.json();
      const text = data.choices?.[0]?.message?.content || "";
      if (text && model !== GROQ_MODEL_CANDIDATES[0]) {
        console.warn(`[Groq] Used fallback model: ${model}`);
      }
      return text;
    }

    lastStatus = res.status;
    lastBody = await res.text();

    if (lastStatus === 429 || lastStatus === 503) {
      console.warn(
        `[Groq] ${model} returned ${lastStatus}; trying next model. Body (truncated): ${lastBody.slice(0, 200)}`
      );
      continue;
    }

    throw new Error(`Groq LLM failed (${lastStatus}): ${lastBody}`);
  }

  throw new Error(
    `Groq LLM failed after trying all models (last ${lastStatus}): ${lastBody.slice(0, 800)}`
  );
}
