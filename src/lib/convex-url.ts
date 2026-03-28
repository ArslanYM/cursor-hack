/**
 * Resolves the Convex deployment URL for ConvexReactClient.
 * During `next build`, `NEXT_PUBLIC_*` may be unset in CI until Vercel env is
 * configured; we use a placeholder only while `NEXT_PHASE === phase-production-build`
 * so static prerender (e.g. `/_not-found`) does not throw.
 *
 * Production: set `NEXT_PUBLIC_CONVEX_URL` in Vercel for all environments that build.
 * @see https://docs.convex.dev/production/hosting/
 */
const BUILD_TIME_PLACEHOLDER = "https://placeholder.convex.cloud";

export function getConvexUrlForProvider(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (fromEnv) {
    return fromEnv;
  }

  if (process.env.NEXT_PHASE === "phase-production-build") {
    return BUILD_TIME_PLACEHOLDER;
  }

  // Use placeholder in development environments to allow landing page to render
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "Warning: NEXT_PUBLIC_CONVEX_URL not set. Using placeholder. The app will not work properly until you add your Convex URL to environment variables."
    );
    return BUILD_TIME_PLACEHOLDER;
  }

  throw new Error(
    "Missing NEXT_PUBLIC_CONVEX_URL. Add it to .env.local (see .env.example) and to Vercel project env vars before deploy. https://docs.convex.dev/production/hosting/"
  );
}
