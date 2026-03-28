/**
 * Resolves the Convex deployment URL for ConvexReactClient.
 * During `next build`, `NEXT_PUBLIC_*` may be unset in CI until Vercel env is
 * configured; we use a placeholder only while `NEXT_PHASE === phase-production-build`
 * so static prerender (e.g. `/_not-found`) does not throw.
 *
 * Production: set `NEXT_PUBLIC_CONVEX_URL` in Vercel for all environments that build.
 * @see https://docs.convex.dev/production/hosting/
 */
const BUILD_TIME_PLACEHOLDER = "https://temp-test-123.convex.cloud";

export function getConvexUrlForProvider(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (fromEnv) {
    return fromEnv;
  }

  // Always use placeholder as fallback - don't throw error in any environment
  // This allows the landing page to work while authenticated features degrade gracefully
  console.warn(
    "Warning: NEXT_PUBLIC_CONVEX_URL not set. Using temporary placeholder. The authenticated app features will not work until you add your Convex URL to environment variables in Vercel settings."
  );
  return BUILD_TIME_PLACEHOLDER;
}
