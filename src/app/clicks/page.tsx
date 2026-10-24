import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ExternalLink, MousePointerClick, Share2, Users } from "lucide-react";

import { canEdit, type ClicksReport } from "@/features/news/schemas";
import {
  attempt,
  getProfile,
  requireUserId,
} from "@/features/news/server/api";
import { getClicksReport } from "@/features/news/server/data";
import { AutoRefresh } from "@/features/community/components/auto-refresh";
import {
  DashboardShell,
  DashboardSkeleton,
} from "@/features/dashboard/components/dashboard-shell";
import { ViewHeader } from "@/features/dashboard/components/views";

export const metadata: Metadata = {
  title: "Clicks",
  description: "Which stories readers click, and which communities they come from.",
};

export const instant = false;

export default function ClicksPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell wide>
        <ClicksGate />
      </DashboardShell>
    </Suspense>
  );
}

async function ClicksGate() {
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
            <p className="dash-ed-eyebrow">Reader clicks</p>
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

  return <Clicks />;
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

function when(value?: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-FI", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Helsinki",
  }).format(new Date(value));
}

function counts(label: string, value: ClicksReport["open"]) {
  return `${value.users} ${value.users === 1 ? "reader" : "readers"} · ${value.total} ${label}`;
}

async function Clicks() {
  const result = await attempt(() => getClicksReport(30));

  if (!result.ok) {
    return <Notice title="Could not load the clicks" body={result.message} />;
  }

  const report = result.data;

  return (
    <div className="dash-view">
      <AutoRefresh active everyMs={10_000} />
      <ViewHeader
        title="Reader clicks"
        sub={`Which stories readers opened, followed to the original report or shared in the last ${report.days} days, which community they came from and why the story reached them. Readers are only counted, never named.`}
      />

      <ul className="dash-ed-stats">
        <li className="dash-ed-stat">
          <Users className="dash-ed-stat__icon" aria-hidden="true" />
          <strong>{report.readers}</strong>
          <span>Readers who clicked</span>
        </li>
        <li className="dash-ed-stat">
          <MousePointerClick className="dash-ed-stat__icon" aria-hidden="true" />
          <strong>{report.open.total}</strong>
          <span>Stories opened</span>
        </li>
        <li className="dash-ed-stat">
          <ExternalLink className="dash-ed-stat__icon" aria-hidden="true" />
          <strong>{report.outbound.total}</strong>
          <span>Clicks to the original</span>
        </li>
        <li className="dash-ed-stat">
          <Share2 className="dash-ed-stat__icon" aria-hidden="true" />
          <strong>{report.share.total}</strong>
          <span>Shares</span>
        </li>
      </ul>

      <div className="dash-ed-grid">
        <section className="dash-ed-panel">
          <div className="dash-ed-panel__head">
            <div>
              <h2 className="dash-ed-panel__title">Communities</h2>
              <p className="dash-ed-panel__sub">Where the clicks came from.</p>
            </div>
            <span className="dash-chip">{report.communities.length}</span>
          </div>
          {report.communities.length ? (
            <ul className="dash-src-list">
              {report.communities.map((row) => (
                <li className="dash-src" key={row.community_id ?? "none"}>
                  <span className="dash-src__name" title={row.name}>
                    {row.name}
                  </span>
                  <span className="dash-src__lang">
                    {row.readers} {row.readers === 1 ? "reader" : "readers"}
                  </span>
                  <span className="dash-src__count" title="Clicks">
                    {row.clicks}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dash-ed-note">No clicks yet.</p>
          )}
        </section>

        <section className="dash-ed-panel">
          <div className="dash-ed-panel__head">
            <div>
              <h2 className="dash-ed-panel__title">Stories</h2>
              <p className="dash-ed-panel__sub">
                Most-read first. Each shows why readers see it and who read it.
              </p>
            </div>
            <span className="dash-chip">{report.articles.length}</span>
          </div>
          {report.articles.length ? (
            <ul className="dash-ed-rows">
              {report.articles.map((article) => (
                <li className="dash-ed-row" key={article.id}>
                  <strong>
                    <a href={article.url} rel="noreferrer" target="_blank">
                      {article.title}
                    </a>
                  </strong>
                  <span>
                    {article.source_name} · {article.language.toUpperCase()}
                    {article.last_click_at ? ` · last click ${when(article.last_click_at)}` : ""}
                  </span>
                  <span>
                    Opened: {counts("opens", article.open)} · Original:{" "}
                    {counts("clicks", article.outbound)} · Shared: {counts("shares", article.share)}
                  </span>
                  {article.why.length ? (
                    <span>
                      <em>Why readers see it:</em> {article.why.join(" · ")}
                    </span>
                  ) : null}
                  {article.audience.length ? (
                    <span>
                      <em>Who read it:</em>{" "}
                      {article.audience.map((a) => `${a.name} (${a.readers})`).join(", ")}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="dash-ed-note">No stories have been clicked yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
