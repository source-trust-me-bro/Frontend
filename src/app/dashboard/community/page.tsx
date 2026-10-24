import type { Metadata } from "next";
import { Suspense } from "react";

import {
  DashboardShell,
  DashboardSkeleton,
} from "@/features/dashboard/components/dashboard-shell";
import { CommunityView } from "@/features/community/components/community-view";

export const metadata: Metadata = {
  title: "Community",
  description:
    "News explained for your community, approved by named people, with a say for you.",
};

export const instant = false;

export default function CommunityPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell>
        <CommunityView />
      </DashboardShell>
    </Suspense>
  );
}
