"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Re-renders the page every few seconds while a background job is running. It skips the tick
 * when the tab is hidden, so a forgotten tab does not keep reloading the whole page.
 */
export function AutoRefresh({ active, everyMs = 10_000 }: { active: boolean; everyMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    if (!active) {
      return;
    }

    const refresh = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    };
    const timer = window.setInterval(refresh, everyMs);

    // Catch up at once when the tab becomes visible again.
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [active, everyMs, router]);

  return null;
}
