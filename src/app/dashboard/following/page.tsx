import type { Metadata } from "next";
import { Suspense } from "react";

import {
  DashboardShell,
  DashboardSkeleton,
} from "@/features/dashboard/components/dashboard-shell";
import { FollowingView } from "@/features/dashboard/components/views";

export const metadata: Metadata = {
  title: "Following",
  description: "News sources you follow.",
};

export const instant = false;

export default function FollowingPage({ searchParams }: PageProps<"/dashboard/following">) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell>
        <FollowingView searchParams={searchParams} />
      </DashboardShell>
    </Suspense>
  );
}
