import type { Metadata } from "next";

import { CommunityTabs, parseTab } from "@/features/community/components/community-tabs";
import { ParticipateView } from "@/features/community/components/community-view";
import { DiscoverView } from "@/features/community/components/discover-view";
import { FollowingStoriesView } from "@/features/community/components/following-view";

export const metadata: Metadata = {
  title: "Community",
  description:
    "News explained for your community, approved by named people, with a say for you.",
};

export const instant = false;

export default function CommunityPage({ searchParams }: PageProps<"/dashboard/community">) {
  return (
    <CommunityTabsPage searchParams={searchParams} />
  );
}

async function CommunityTabsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const tab = parseTab((await searchParams).tab);

  return (
    <>
      <CommunityTabs active={tab} />
      {tab === "following" ? (
        <FollowingStoriesView />
      ) : tab === "discover" ? (
        <DiscoverView />
      ) : (
        <ParticipateView />
      )}
    </>
  );
}
