import type { Metadata } from "next";
import { Suspense } from "react";

import {
  DashboardShell,
  DashboardSkeleton,
} from "@/features/dashboard/components/dashboard-shell";
import { TrendingView } from "@/features/dashboard/components/views";

export const metadata: Metadata = {
  title: "Now trending",
  description: "The stories readers opened most this week.",
};

export const instant = false;

export default function TrendingPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell>
        <TrendingView />
      </DashboardShell>
    </Suspense>
  );
}
