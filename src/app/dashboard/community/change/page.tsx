import type { Metadata } from "next";
import { Suspense } from "react";

import {
  DashboardShell,
  DashboardSkeleton,
  ErrorPanel,
} from "@/features/dashboard/components/dashboard-shell";
import { CommunityPicker } from "@/features/community/components/community-view";
import { attempt } from "@/features/news/server/api";
import { getCommunities, getMember } from "@/features/news/server/data";

export const metadata: Metadata = {
  title: "Change community",
};

export const instant = false;

export default function ChangeCommunityPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell>
        <Picker />
      </DashboardShell>
    </Suspense>
  );
}

async function Picker() {
  const result = await attempt(async () => {
    const [member, communities] = await Promise.all([getMember(), getCommunities()]);

    return { member, communities };
  });

  if (!result.ok) {
    return <ErrorPanel message={result.message} />;
  }

  return (
    <CommunityPicker
      communities={result.data.communities}
      currentId={result.data.member.community_id}
    />
  );
}
