import type { Metadata } from "next";
import { Suspense } from "react";

import {
  DashboardShell,
  DashboardSkeleton,
} from "@/features/dashboard/components/dashboard-shell";
import { AudioView } from "@/features/dashboard/components/views";

export const metadata: Metadata = {
  title: "Audio books",
  description: "Listen to stories read aloud.",
};

export const instant = false;

export default function AudioPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell>
        <AudioView />
      </DashboardShell>
    </Suspense>
  );
}
