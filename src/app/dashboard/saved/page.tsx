import type { Metadata } from "next";

import { LibraryView } from "@/features/dashboard/components/views";

export const metadata: Metadata = {
  title: "Saved",
  description: "Stories you bookmarked.",
};

export const instant = false;

export default function SavedPage({ searchParams }: PageProps<"/dashboard/saved">) {
  return (
    <LibraryView kind="saved" searchParams={searchParams} />
  );
}
