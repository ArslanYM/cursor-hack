"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

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

  return (
    <ClerkProvider
      afterSignOutUrl="/"
      signInForceRedirectUrl="/(authenticated)"
      signUpForceRedirectUrl="/(authenticated)"
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
