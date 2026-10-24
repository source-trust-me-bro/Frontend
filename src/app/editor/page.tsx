import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import { canEdit } from "@/features/news/schemas";
import {
  attempt,
  getProfile,
  requireUserId,
} from "@/features/news/server/api";
import { linkTopics } from "@/features/news/server/actions";
import { getNewsroomOverview } from "@/features/news/server/data";
import { DeskForm } from "@/features/community/components/desk-form";
import { EditorAside } from "@/features/community/components/editor-aside";
import { EditorDesk } from "@/features/community/components/editor-desk";
import { TopicTree } from "@/features/community/components/topic-tree";
import {
  DashboardShell,
  DashboardSkeleton,
} from "@/features/dashboard/components/dashboard-shell";
import { ViewHeader } from "@/features/dashboard/components/views";

export const metadata: Metadata = {
  title: "Editor",
  description: "Role-verified KalevaShorts editor workspace.",
};

export const instant = false;

export default function EditorPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell wide aside={<EditorAside />}>
        <EditorGate />
      </DashboardShell>
    </Suspense>
  );
}

async function EditorGate() {
  await requireUserId();

  const result = await attempt(getProfile);

  if (!result.ok) {
    return <Notice title="Could not verify your role" body={result.message} />;
  }

  const profile = result.data;

  // Roles live on the FastAPI profile, which also enforces them on every call.
  if (!canEdit(profile)) {
    return (
      <div className="dash-view">
        <div className="dash-view__head">
          <div>
            <p className="dash-ed-eyebrow">Editor workspace</p>
            <h1 className="dash-view__title">Editor access required.</h1>
            <p className="dash-view__sub">
              Your account has the <strong>{profile.roles.join(", ")}</strong>{" "}
              role. An admin can grant you <strong>editor</strong> access.
            </p>
          </div>
        </div>
        <Link className="dash-secondary" href="/dashboard">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return <EditorWorkspace />;
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="dash-view">
      <div className="dash-empty">
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
    </div>
  );
}

async function EditorWorkspace() {
  const result = await attempt(getNewsroomOverview);

  if (!result.ok) {
    return <Notice title="Could not load the workspace" body={result.message} />;
  }

  const { topics } = result.data;
  // A link is stored on both of its topics; count each pair of existing topics once.
  const known = new Set(topics.map((topic) => topic.id));
  const links = new Set(
    topics.flatMap((topic) =>
      topic.branches
        .filter((id) => id !== topic.id && known.has(id))
        .map((id) => [topic.id, id].sort().join("|")),
    ),
  ).size;

  return (
    <div className="dash-view">
      <ViewHeader
        title="Topics and stories"
        sub="The agents sort what they read into the topic tree and write the stories below. Sources, article counts and cycle history are on the Stats page."
      />

      <div className="dash-ed-grid">
        <section className="dash-ed-panel dash-ed-panel--tree">
          <div className="dash-ed-panel__head">
            <div>
              <h2 className="dash-ed-panel__title">Topic tree</h2>
              <p className="dash-ed-panel__sub">
                What the newsroom covers, and how it connects.
              </p>
            </div>
            <span className="dash-chip">
              {topics.length} topics · {links} links
            </span>
            <DeskForm action={linkTopics}>
              <button className="dash-ed-btn" type="submit">
                Link related topics
              </button>
            </DeskForm>
          </div>
          {topics.length ? (
            <TopicTree topics={topics} />
          ) : (
            <p className="dash-ed-note">No topics yet.</p>
          )}
        </section>

      </div>

      <EditorDesk />
    </div>
  );
}
