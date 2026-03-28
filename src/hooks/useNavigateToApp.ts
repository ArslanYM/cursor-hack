import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

/**
 * Hook to handle navigation from landing page to app
 * If user is authenticated, routes to /(authenticated)
 * If user is not authenticated, routes to /sign-up
 */
export function useNavigateToApp() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const navigateToApp = useCallback(() => {
    if (!isLoaded) return; // Wait for auth to load

    if (user) {
      router.push("/(authenticated)");
    } else {
      router.push("/sign-up");
    }
  }, [isLoaded, user, router]);

  return navigateToApp;
}
