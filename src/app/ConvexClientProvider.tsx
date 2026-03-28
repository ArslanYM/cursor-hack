"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

const isValidConvexUrl = (url: string): boolean => {
  // Check if it's a valid Convex URL (not the placeholder)
  return url.includes("convex.cloud") && !url.includes("temp-test") && !url.includes("placeholder");
};

export function ConvexClientProvider({
  children,
  convexUrl,
}: {
  children: ReactNode;
  convexUrl: string;
}) {
  const convex = useMemo(
    () => new ConvexReactClient(convexUrl),
    [convexUrl]
  );

  const isValidUrl = isValidConvexUrl(convexUrl);

  return (
    <ClerkProvider
      afterSignOutUrl="/"
      signInForceRedirectUrl="/(authenticated)"
      signUpForceRedirectUrl="/(authenticated)"
    >
      {isValidUrl ? (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      ) : (
        // When Convex URL is not set, just use Clerk provider without Convex
        <>
          {children}
        </>
      )}
    </ClerkProvider>
  );
}
