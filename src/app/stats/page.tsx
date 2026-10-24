import type { Metadata } from "next";
import { Fragment, Suspense } from "react";
import Link from "next/link";
import { FolderTree, RefreshCw, Rss } from "lucide-react";

import { canEdit, type NewsroomOverview } from "@/features/news/schemas";
import {
  attempt,
  getProfile,
  requireUserId,
} from "@/features/news/server/api";
import { getNewsroomOverview } from "@/features/news/server/data";
import {
  DashboardShell,
  DashboardSkeleton,
} from "@/features/dashboard/components/dashboard-shell";
import { ViewHeader } from "@/features/dashboard/components/views";

export const metadata: Metadata = {
  title: "Stats",
  description: "KalevaShorts newsroom statistics: sources, articles and cycles.",
};

export const instant = false;

export default function StatsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell wide>
        <StatsGate />
      </DashboardShell>
    </Suspense>
  );
}

async function StatsGate() {
  await requireUserId();

  const result = await attempt(getProfile);

  if (!result.ok) {
    return <Notice title="Could not verify your role" body={result.message} />;
  }

  if (!canEdit(result.data)) {
    return (
      <div className="dash-view">
        <div className="dash-view__head">
          <div>
            <p className="dash-ed-eyebrow">Newsroom stats</p>
            <h1 className="dash-view__title">Editor access required.</h1>
            <p className="dash-view__sub">An admin can grant you editor access.</p>
          </div>
        </div>
        <Link className="dash-secondary" href="/dashboard">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return <Stats />;
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

type Source = NewsroomOverview["sources"][number];

/** Feeds of one publisher sit under that outlet, the way topics sit under their parent. */
function groupByOutlet(sources: Source[]) {
  const groups = new Map<string, Source[]>();
  for (const source of sources) {
    const name = source.outlet || source.name;
    groups.set(name, [...(groups.get(name) ?? []), source]);
  }
  return [...groups].map(([name, feeds]) => ({
    name,
    feeds,
    official: feeds.every((feed) => feed.official),
    articles: feeds.reduce((sum, feed) => sum + feed.articles, 0),
  }));
}

/** Feeds of one outlet often share a name, so the feed's own path tells them apart. */
function feedLabel(source: Source) {
  try {
    const path = new URL(source.feed_url ?? "").pathname
      .split("/")
      .filter((part) => part && !["feedit", "rss", "managed-listing", "feed", "feeds"].includes(part));
    if (path.length) return path.slice(-2).join(" / ");
  } catch {
    // no usable feed address: fall back to the source name
  }
  return source.name;
}

async function Stats() {
  const result = await attempt(getNewsroomOverview);

  if (!result.ok) {
    return <Notice title="Could not load the stats" body={result.message} />;
  }

  const { articles, sources, topics, jobs } = result.data;
  const outlets = groupByOutlet(sources);

  return (
    <div className="dash-view">
      <ViewHeader
        title="Newsroom stats"
        sub="What the agents have read, where it came from and how each run went."
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

      <div className="dash-ed-stack">
          <section className="dash-ed-panel">
            <div className="dash-ed-panel__head">
              <h2 className="dash-ed-panel__title">News sources</h2>
              <span className="dash-chip">{sources.length}</span>
            </div>
            {sources.length ? (
              <ul className="dash-src-list">
                {outlets.map((outlet) => (
                  <Fragment key={outlet.name}>
                    <li className="dash-src dash-src--outlet">
                      <span className="dash-src__name" title={outlet.name}>
                        {outlet.name}
                      </span>
                      {outlet.official ? <span className="dash-src__tag">official</span> : null}
                      <span className="dash-src__lang">
                        {outlet.feeds.length} {outlet.feeds.length === 1 ? "feed" : "feeds"}
                      </span>
                      <span
                        className="dash-src__count"
                        title={`${outlet.articles} ${outlet.articles === 1 ? "article" : "articles"} read`}
                      >
                        {outlet.articles}
                      </span>
                    </li>
                    {outlet.feeds.map((source) => (
                      <li
                        className="dash-src dash-src--feed"
                        data-off={source.enabled ? undefined : ""}
                        key={source.id}
                      >
                        <span className="dash-src__name" title={source.feed_url ?? source.name}>
                          {feedLabel(source)}
                        </span>
                        <span className="dash-src__lang">{source.language.toUpperCase()}</span>
                        {source.headline_only ? (
                          <span className="dash-src__tag" title="Only the headline and link are used">
                            headline only
                          </span>
                        ) : null}
                        {source.enabled ? null : (
                          <span className="dash-src__tag dash-src__tag--off">off</span>
                        )}
                        <span
                          className="dash-src__count"
                          title={`${source.articles} ${source.articles === 1 ? "article" : "articles"} read`}
                        >
                          {source.articles}
                        </span>
                      </li>
                    ))}
                  </Fragment>
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
  );
}
