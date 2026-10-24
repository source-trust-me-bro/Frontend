import type { Metadata } from "next";

import { Feed } from "@/features/dashboard/components/feed";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your KalevaShorts news feed, personalised by language and interests.",
};

export const instant = false;

export default function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  return (
    <Feed searchParams={searchParams} />
  );
}
