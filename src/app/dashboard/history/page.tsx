import type { Metadata } from "next";
import { Suspense } from "react";

import {
  DashboardShell,
  DashboardSkeleton,
} from "@/features/dashboard/components/dashboard-shell";
import { LibraryView } from "@/features/dashboard/components/views";

export const metadata: Metadata = {
  title: "Reading history",
  description: "Stories you opened recently.",
};

export const instant = false;

export default function HistoryPage({ searchParams }: PageProps<"/dashboard/history">) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell>
        <LibraryView kind="history" searchParams={searchParams} />
      </DashboardShell>
    </Suspense>
  );
}
