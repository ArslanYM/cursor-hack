"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Dev + Turbopack: cache-first SW breaks lucide-react / chunk loading after HMR.
    if (process.env.NODE_ENV !== "production") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* SW registration failed — acceptable */
      });
    }
  }, []);

  return null;
}
