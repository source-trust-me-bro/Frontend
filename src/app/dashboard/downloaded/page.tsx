import type { Metadata } from "next";
import { Suspense } from "react";

import {
  DashboardShell,
  DashboardSkeleton,
} from "@/features/dashboard/components/dashboard-shell";
import { LibraryView } from "@/features/dashboard/components/views";

export const metadata: Metadata = {
  title: "Downloaded",
  description: "Stories kept for offline reading.",
};

export const instant = false;

export default function DownloadedPage({ searchParams }: PageProps<"/dashboard/downloaded">) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell>
        <LibraryView kind="downloaded" searchParams={searchParams} />
      </DashboardShell>
    </Suspense>
  );
}
