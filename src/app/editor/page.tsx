import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import {
  FolderTree,
  MessageSquare,
  RefreshCw,
  Rss,
} from "lucide-react";
import { z } from "zod";

import {
  canEdit,
  feedbackSchema,
  flattenTopics,
  ingestionJobSchema,
  pageSchema,
  sourceSchema,
  topicNodeSchema,
} from "@/features/news/schemas";
import {
  apiRequest,
  attempt,
  getProfile,
  requireUserId,
} from "@/features/news/server/api";
import { runIngestion } from "@/features/news/server/actions";
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
    <Suspense fallback={<DashboardSkeleton showAside={false} />}>
      <DashboardShell showAside={false} wide>
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
  const result = await attempt(async () => {
    const [sources, topics, jobs, feedback] = await Promise.all([
      apiRequest("/sources?page_size=100", pageSchema(sourceSchema)),
      apiRequest("/topics/tree", z.array(topicNodeSchema)),
      apiRequest("/ingestion/jobs?page_size=10", pageSchema(ingestionJobSchema)),
      apiRequest("/feedback?page_size=10", pageSchema(feedbackSchema)),
    ]);

    return { sources, topics: flattenTopics(topics), jobs, feedback };
  });

  if (!result.ok) {
    return <Notice title="Could not load the workspace" body={result.message} />;
  }

  const { sources, topics, jobs, feedback } = result.data;
  const sourceNames = new Map(sources.items.map((item) => [item.id, item.name]));

  return (
    <div className="dash-view">
      <ViewHeader
        title="Sources, topics and ingestion"
        sub="Running a job collects the latest stories from a source and adds the new ones to the feed."
      />

      <ul className="dash-ed-stats">
        <li className="dash-ed-stat">
          <FolderTree className="dash-ed-stat__icon" aria-hidden="true" />
          <strong>{topics.length}</strong>
          <span>Topics in the tree</span>
        </li>
        <li className="dash-ed-stat">
          <Rss className="dash-ed-stat__icon" aria-hidden="true" />
          <strong>{sources.total}</strong>
          <span>News sources</span>
        </li>
        <li className="dash-ed-stat">
          <RefreshCw className="dash-ed-stat__icon" aria-hidden="true" />
          <strong>{jobs.items.length}</strong>
          <span>Recent jobs</span>
        </li>
        <li className="dash-ed-stat">
          <MessageSquare className="dash-ed-stat__icon" aria-hidden="true" />
          <strong>{feedback.total}</strong>
          <span>Reader feedback</span>
        </li>
      </ul>

      <div className="dash-ed-grid">
        <section className="dash-ed-panel">
          <div className="dash-ed-panel__head">
            <h2 className="dash-ed-panel__title">Topic tree</h2>
            <span className="dash-chip">{topics.length} topics</span>
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
                    {topic.language.toUpperCase()}
                  </span>
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
              <span className="dash-chip">{sources.total}</span>
            </div>
            {sources.items.length ? (
              <ul className="dash-ed-list">
                {sources.items.map((source) => (
                  <li key={source.id}>
                    <form className="dash-ed-source" action={runIngestion}>
                      <input type="hidden" name="source_id" value={source.id} />
                      <span className="dash-ed-source__body">
                        <strong>{source.name}</strong>
                        <span className="dash-ed-source__meta">
                          {source.language.toUpperCase()}
                          {source.active ? "" : " · inactive"} · {source.feed_url}
                        </span>
                      </span>
                      <button
                        className="dash-ed-btn dash-ed-btn--primary"
                        type="submit"
                        disabled={!source.active}
                      >
                        Run ingestion
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dash-ed-note">No sources yet.</p>
            )}
          </section>

          <section className="dash-ed-panel dash-ed-panel--navy">
            <div className="dash-ed-panel__head">
              <h2 className="dash-ed-panel__title">Recent jobs</h2>
            </div>
            {jobs.items.length ? (
              <ul className="dash-ed-list">
                {jobs.items.map((job) => (
                  <li className="dash-ed-job" key={job.id}>
                    <strong>
                      {sourceNames.get(job.source_id) ?? "Removed source"}
                      <span className="dash-ed-status">{job.status}</span>
                    </strong>
                    <span>
                      {job.stats.created} new · {job.stats.skipped} skipped ·{" "}
                      {job.stats.failed} failed
                      {job.error ? ` · ${job.error}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dash-ed-note">No jobs have run yet.</p>
            )}
          </section>
        </div>
      </div>

      <EditorDesk />

      <section className="dash-ed-panel">
        <div className="dash-ed-panel__head">
          <h2 className="dash-ed-panel__title">Reader feedback</h2>
          <span className="dash-chip">{feedback.total}</span>
        </div>
        {feedback.items.length ? (
          <ul className="dash-ed-rows">
            {feedback.items.map((item) => (
              <li className="dash-ed-row" key={item.id}>
                <strong>
                  {item.subject || "No subject"} ·{" "}
                  {item.display_name || item.email || "Reader"}
                </strong>
                <span>{item.message}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dash-ed-note">No feedback yet.</p>
        )}
      </section>
    </div>
  );
}
