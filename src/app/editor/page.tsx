import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { FolderTree, RefreshCw, Rss } from "lucide-react";

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

  const { articles, sources, topics, jobs } = result.data;
  const topicNames = new Map(topics.map((topic) => [topic.id, topic.name]));
  // Branches are symmetric, so every link appears on both of its topics.
  const links = topics.reduce((sum, topic) => sum + topic.branches.length, 0) / 2;

  return (
    <div className="dash-view">
      <ViewHeader
        title="Sources, topics and newsroom runs"
        sub="The agents read these feeds when you run a newsroom cycle, sort what they find into the topic tree and write the stories below."
      />

      <ul className="dash-ed-stats">
        <li className="dash-ed-stat">
          <FolderTree className="dash-ed-stat__icon" aria-hidden="true" />
          <strong>{topics.length}</strong>
          <span>Topics in the tree</span>
        </li>
        <li className="dash-ed-stat">
          <Rss className="dash-ed-stat__icon" aria-hidden="true" />
          <strong>{articles}</strong>
          <span>Articles collected</span>
        </li>
        <li className="dash-ed-stat">
          <RefreshCw className="dash-ed-stat__icon" aria-hidden="true" />
          <strong>{jobs.length}</strong>
          <span>Recent cycles</span>
        </li>
      </ul>

      <div className="dash-ed-grid">
        <section className="dash-ed-panel">
          <div className="dash-ed-panel__head">
            <h2 className="dash-ed-panel__title">Topic tree</h2>
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
            <ul className="dash-ed-list">
              {topics.map((topic) => (
                <li
                  className="dash-ed-topic"
                  key={topic.id}
                  style={{ marginLeft: `${topic.depth * 0.875}rem` }}
                >
                  <span className="dash-ed-topic__name">{topic.name}</span>
                  <span className="dash-ed-topic__lang">
                    {topic.events} {topic.events === 1 ? "event" : "events"}
                    {topic.proposed ? " · proposed" : ""}
                  </span>
                  {topic.branches.length ? (
                    <span className="dash-ed-topic__branches">
                      Linked to:{" "}
                      {topic.branches
                        .map((id) => topicNames.get(id))
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="dash-ed-note">No topics yet.</p>
          )}
        </section>

        <div className="dash-ed-stack">
          <section className="dash-ed-panel">
            <div className="dash-ed-panel__head">
              <h2 className="dash-ed-panel__title">News sources</h2>
              <span className="dash-chip">{sources.length}</span>
            </div>
            {sources.length ? (
              <ul className="dash-src-list">
                {sources.map((source) => (
                  <li className="dash-src" data-off={source.enabled ? undefined : ""} key={source.id}>
                    <span className="dash-src__name" title={source.name}>
                      {source.name}
                    </span>
                    <span className="dash-src__lang">{source.language.toUpperCase()}</span>
                    {source.official ? <span className="dash-src__tag">official</span> : null}
                    {source.headline_only ? (
                      <span className="dash-src__tag" title="Only the headline and link are used">
                        headline only
                      </span>
                    ) : null}
                    {source.enabled ? null : <span className="dash-src__tag dash-src__tag--off">off</span>}
                    <span
                      className="dash-src__count"
                      title={`${source.articles} ${source.articles === 1 ? "article" : "articles"} read`}
                    >
                      {source.articles}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dash-ed-note">No sources yet.</p>
            )}
          </section>

          <section className="dash-ed-panel dash-ed-panel--navy">
            <div className="dash-ed-panel__head">
              <h2 className="dash-ed-panel__title">Recent cycles</h2>
            </div>
            {jobs.length ? (
              <ul className="dash-ed-list">
                {jobs.map((job) => (
                  <li className="dash-ed-job" key={job.started_at}>
                    <strong>
                      {job.started_at
                        ? new Intl.DateTimeFormat("en-FI", {
                            dateStyle: "medium",
                            timeStyle: "short",
                            timeZone: "Europe/Helsinki",
                          }).format(new Date(job.started_at))
                        : "Cycle"}
                      <span className="dash-ed-status">{job.status}</span>
                    </strong>
                    <span>
                      {job.summary
                        ? `${job.summary.articles_processed} articles read · ${job.summary.events} events · ${job.summary.pitches} stories prepared${job.summary.stopped_reason ? ` · stopped (${job.summary.stopped_reason})` : ""}`
                        : (job.error ?? "")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dash-ed-note">No cycle has run since the service started.</p>
            )}
          </section>
        </div>
      </div>

      <EditorDesk />
    </div>
  );
}
