"use node";

/**
 * Optional deep page extraction via Apify (Website Content Crawler).
 * Used when APIFY_API_TOKEN is set in Convex env — supplements Exa snippets for
 * government / table-heavy mandi pages.
 *
 * @see https://apify.com/apify/website-content-crawler
 * @see https://docs.apify.com/api/v2/act-run-sync-get-dataset-items-post
 */

const WEBSITE_CRAWLER_ACTOR = "apify~website-content-crawler";
/** Apify sync run timeout (seconds); keep total action time reasonable */
const SYNC_TIMEOUT_SEC = 75;
/** Max characters per extracted page to stay under LLM context */
const MAX_CHARS_PER_PAGE = 4500;

export function pickUrlsForDeepExtract(
  urls: string[],
  maxUrls: number
): string[] {
  if (urls.length === 0 || maxUrls <= 0) return [];
  const unique = [...new Set(urls.map((u) => u.trim()).filter(Boolean))];
  const govFirst = unique.filter((u) =>
    /gov\.in|nic\.in|agmarknet|agricoop|daf|mandi|e-nam|enam|commodity|sfac/i.test(
      u
    )
  );
  const preferred = govFirst.length > 0 ? govFirst : unique;
  return preferred.slice(0, maxUrls);
}

/**
 * Runs Website Content Crawler synchronously for one URL; returns markdown/text
 * suitable for the Groq prompt. Empty string if token missing or run fails.
 */
export async function apifyExtractSinglePage(url: string): Promise<string> {
  const token = process.env.APIFY_API_TOKEN;
  if (!token || !url) return "";

  const endpoint = new URL(
    `https://api.apify.com/v2/acts/${WEBSITE_CRAWLER_ACTOR}/run-sync-get-dataset-items`
  );
  endpoint.searchParams.set("timeout", String(SYNC_TIMEOUT_SEC));
  endpoint.searchParams.set("memory", "1024");

  const input = {
    startUrls: [{ url }],
    maxCrawlPages: 1,
    maxCrawlDepth: 0,
  };

  try {
    const res = await fetch(endpoint.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout((SYNC_TIMEOUT_SEC + 20) * 1000),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(
        `[KV:Apify] run failed (${res.status}) for ${url}: ${errText.slice(0, 200)}`
      );
      return "";
    }

    const items: unknown = await res.json();
    if (!Array.isArray(items) || items.length === 0) return "";

    const chunks: string[] = [];
    for (const item of items) {
      if (!item || typeof item !== "object") continue;
      const row = item as Record<string, unknown>;
      const raw =
        (typeof row.markdown === "string" && row.markdown) ||
        (typeof row.text === "string" && row.text) ||
        "";
      if (raw) {
        chunks.push(raw.length > MAX_CHARS_PER_PAGE ? raw.slice(0, MAX_CHARS_PER_PAGE) + "…" : raw);
      }
    }

    if (chunks.length === 0) return "";

    return [`--- Deep page extract (Apify) — ${url} ---`, chunks.join("\n\n")].join(
      "\n"
    );
  } catch (e) {
    console.warn(`[KV:Apify] extract error for ${url}:`, e);
    return "";
  }
}

/**
 * Best-effort: one deep extract from the best candidate URL. Never throws.
 */
export async function apifySupplementMandiContext(urls: string[]): Promise<string> {
  const picked = pickUrlsForDeepExtract(urls, 1);
  if (picked.length === 0) return "";
  const block = await apifyExtractSinglePage(picked[0]);
  return block;
}
