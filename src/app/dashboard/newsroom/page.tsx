import type { Metadata } from "next";

import { NewsroomView } from "@/features/dashboard/components/newsroom-view";

export const metadata: Metadata = {
  title: "Newsroom",
  description: "Every story our editors have published.",
};

export const instant = false;

export default function NewsroomPage({ searchParams }: PageProps<"/dashboard/newsroom">) {
  return (
    <NewsroomContent searchParams={searchParams} />
  );
}

async function NewsroomContent({
  searchParams,
}: {
  searchParams: PageProps<"/dashboard/newsroom">["searchParams"];
}) {
  const raw = (await searchParams).page;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const page = Math.max(1, Number.parseInt(value ?? "1", 10) || 1);

  return <NewsroomView page={page} />;
}
