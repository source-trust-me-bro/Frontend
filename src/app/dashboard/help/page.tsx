import type { Metadata } from "next";

import { HelpView } from "@/features/dashboard/components/views";

export const metadata: Metadata = {
  title: "Help",
  description: "Answers to common questions.",
};

export const instant = false;

export default function HelpPage() {
  return (
    <HelpView />
  );
}
