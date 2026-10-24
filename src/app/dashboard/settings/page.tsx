import type { Metadata } from "next";
import { z } from "zod";

import { ErrorPanel } from "@/features/dashboard/components/dashboard-shell";
import { SettingsForm } from "@/features/dashboard/components/settings-form";
import { flattenTopics, topicNodeSchema } from "@/features/news/schemas";
import { apiRequest, attempt, getProfile } from "@/features/news/server/api";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your KalevaShorts reading language and interests.",
};

export const instant = false;

export default function SettingsPage() {
  return (
    <Settings />
  );
}

async function Settings() {
  const result = await attempt(async () => {
    const [profile, tree] = await Promise.all([
      getProfile(),
      apiRequest("/topics/tree", z.array(topicNodeSchema)),
    ]);

    return { profile, tree };
  });

  if (!result.ok) {
    return <ErrorPanel message={result.message} />;
  }

  const { profile, tree } = result.data;

  return (
    <div className="dash-view">
      <div className="dash-view__head">
        <div>
          <h1 className="dash-view__title">Settings</h1>
          <p className="dash-view__sub">
            Your language and interests shape the For you feed.
          </p>
        </div>
      </div>
      <SettingsForm
        displayName={profile.display_name ?? ""}
        email={profile.email ?? null}
        language={profile.preferred_language}
        selectedTopicIds={profile.topic_ids}
        topics={flattenTopics(tree).map(({ id, name, depth }) => ({
          id,
          name,
          depth,
        }))}
      />
    </div>
  );
}
