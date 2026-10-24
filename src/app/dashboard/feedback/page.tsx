import type { Metadata } from "next";

import { FeedbackForm } from "@/features/dashboard/components/feedback-form";
import { ViewHeader } from "@/features/dashboard/components/views";

export const metadata: Metadata = {
  title: "Send feedback",
  description: "Tell the KalevaShorts team what should change next.",
};

export const instant = false;

export default function FeedbackPage() {
  return (
    <div className="dash-view">
      <ViewHeader
        title="Send feedback"
        sub="Tell the team what should change next."
      />
      <FeedbackForm />
    </div>
  );
}
