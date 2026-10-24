import type { Metadata } from "next";
import { Suspense } from "react";

import {
  DashboardShell,
  DashboardSkeleton,
} from "@/features/dashboard/components/dashboard-shell";
import { LibraryView } from "@/features/dashboard/components/views";

export const metadata: Metadata = {
  title: "Saved",
  description: "Stories you bookmarked.",
};

export const instant = false;

export default function SavedPage({ searchParams }: PageProps<"/dashboard/saved">) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell>
        <LibraryView kind="saved" searchParams={searchParams} />
      </DashboardShell>
    </Suspense>
  );
}
