import type { Metadata } from "next";

import { LibraryView } from "@/features/dashboard/components/views";

export const metadata: Metadata = {
  title: "Reading history",
  description: "Stories you opened recently.",
};

export const instant = false;

export default function HistoryPage({ searchParams }: PageProps<"/dashboard/history">) {
  return (
    <LibraryView kind="history" searchParams={searchParams} />
  );
}
