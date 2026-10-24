"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Re-renders the page every few seconds while a background job is running. */
export function AutoRefresh({ active, everyMs = 6000 }: { active: boolean; everyMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    if (!active) {
      return;
    }

    const timer = window.setInterval(() => router.refresh(), everyMs);

    return () => window.clearInterval(timer);
  }, [active, everyMs, router]);

  return null;
}
