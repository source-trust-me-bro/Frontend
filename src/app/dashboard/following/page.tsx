import type { Metadata } from "next";

import { FollowingView } from "@/features/dashboard/components/views";

export const metadata: Metadata = {
  title: "Following",
  description: "News sources you follow.",
};

export const instant = false;

export default function FollowingPage({ searchParams }: PageProps<"/dashboard/following">) {
  return (
    <FollowingView searchParams={searchParams} />
  );
}
