import type { Metadata } from "next";
import { Suspense } from "react";

import {
  DashboardShell,
  DashboardSkeleton,
} from "@/features/dashboard/components/dashboard-shell";
import { Feed } from "@/features/dashboard/components/feed";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your KalevaShorts news feed, personalised by language and interests.",
};

export const instant = false;

export default function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell>
        <Feed searchParams={searchParams} />
      </DashboardShell>
    </Suspense>
  );
}
