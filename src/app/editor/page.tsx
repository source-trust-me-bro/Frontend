import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
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
import { WorkspaceHeader } from "@/features/users/components/workspace-header";

export const metadata: Metadata = {
  title: "Editor",
  description: "Role-verified KalevaShorts editor workspace.",
};

export const instant = false;

export default function EditorPage() {
  return (
    <main className="workspace">
      <div className="workspace__shell">
        <WorkspaceHeader active="editor" />
        <Suspense fallback={<EditorSkeleton />}>
          <EditorGate />
        </Suspense>
      </div>
    </main>
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
      <>
        <div className="workspace__header">
          <p className="workspace__eyebrow">Editor workspace</p>
          <h1 className="workspace__title">Editor access required.</h1>
          <p className="workspace__lead">
            Your account has the <strong>{profile.roles.join(", ")}</strong>{" "}
            role. An admin can grant you <strong>editor</strong> access.
          </p>
        </div>
        <div className="workspace__actions">
          <Link className="workspace__nav-link" href="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </>
    );
  }

  return <EditorWorkspace />;
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="workspace__header">
      <h1 className="workspace__title">{title}</h1>
      <p className="workspace__lead">{body}</p>
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
    <>
      <div className="workspace__header">
        <p className="workspace__eyebrow">Editor workspace</p>
        <h1 className="workspace__title">Sources, topics and ingestion.</h1>
        <p className="workspace__lead">
          Running a job collects the latest stories from a source and adds the
          new ones to the feed.
        </p>
      </div>

      <div className="workspace__editor-grid">
        <section className="workspace__panel">
          <div className="workspace__panel-head">
            <h2 className="workspace__panel-title">Topic tree</h2>
            <span className="workspace__badge">{topics.length} topics</span>
          </div>
          <div className="workspace__list">
            {topics.length ? (
              topics.map((topic) => (
                <div
                  className="workspace__topic"
                  key={topic.id}
                  style={{ paddingLeft: topic.depth * 16 }}
                >
                  <strong>{topic.name}</strong>
                  <span>{topic.language.toUpperCase()}</span>
                </div>
              ))
            ) : (
              <p className="workspace__panel-note">No topics yet.</p>
            )}
          </div>
        </section>

        <div className="workspace__list">
          <section className="workspace__panel">
            <div className="workspace__panel-head">
              <h2 className="workspace__panel-title">News sources</h2>
              <span className="workspace__badge">{sources.total}</span>
            </div>
            <div className="workspace__list">
              {sources.items.length ? (
                sources.items.map((source) => (
                  <form
                    className="workspace__list-item"
                    action={runIngestion}
                    key={source.id}
                  >
                    <input type="hidden" name="source_id" value={source.id} />
                    <strong>{source.name}</strong>
                    <span>
                      {source.language.toUpperCase()}
                      {source.active ? "" : " · inactive"} · {source.feed_url}
                    </span>
                    <button
                      className="workspace__button"
                      type="submit"
                      disabled={!source.active}
                    >
                      Run ingestion
                    </button>
                  </form>
                ))
              ) : (
                <p className="workspace__panel-note">
                  No sources yet.
                </p>
              )}
            </div>
          </section>

          <section className="workspace__panel workspace__panel--dark">
            <div className="workspace__panel-head">
              <h2 className="workspace__panel-title">Recent jobs</h2>
            </div>
            <div className="workspace__list">
              {jobs.items.length ? (
                jobs.items.map((job) => (
                  <div className="workspace__list-item" key={job.id}>
                    <strong>
                      {sourceNames.get(job.source_id) ?? "Removed source"} ·{" "}
                      {job.status}
                    </strong>
                    <span>
                      {job.stats.created} new · {job.stats.skipped} skipped ·{" "}
                      {job.stats.failed} failed
                      {job.error ? ` · ${job.error}` : ""}
                    </span>
                  </div>
                ))
              ) : (
                <p className="workspace__panel-note">No jobs have run yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>

      <section className="workspace__panel workspace__panel--span-12">
        <div className="workspace__panel-head">
          <h2 className="workspace__panel-title">Reader feedback</h2>
          <span className="workspace__badge">{feedback.total}</span>
        </div>
        <div className="workspace__list">
          {feedback.items.length ? (
            feedback.items.map((item) => (
              <div className="workspace__list-item" key={item.id}>
                <strong>
                  {item.subject || "No subject"} ·{" "}
                  {item.display_name || item.email || "Reader"}
                </strong>
                <span>{item.message}</span>
              </div>
            ))
          ) : (
            <p className="workspace__panel-note">No feedback yet.</p>
          )}
        </div>
      </section>
    </>
  );
}

function EditorSkeleton() {
  return (
    <div className="workspace__skeleton" aria-hidden="true">
      <div className="workspace__skeleton-bar"></div>
      <div className="workspace__skeleton-bar"></div>
    </div>
  );
}
