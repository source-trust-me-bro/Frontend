import type { Metadata } from "next";
import { Suspense } from "react";

import {
  DashboardShell,
  DashboardSkeleton,
} from "@/features/dashboard/components/dashboard-shell";
import { HelpView } from "@/features/dashboard/components/views";

export const metadata: Metadata = {
  title: "Help",
  description: "Answers to common questions.",
};

export const instant = false;

export default function HelpPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell>
        <HelpView />
      </DashboardShell>
    </Suspense>
  );
}
