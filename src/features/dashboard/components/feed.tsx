import Link from "next/link";
import { Search } from "lucide-react";

import {
  articleSummarySchema,
  canEdit,
  flattenTopics,
  pageSchema,
  topicNodeSchema,
} from "@/features/news/schemas";
import { apiRequest, attempt, getProfile } from "@/features/news/server/api";
import { getFollowingFeed, getTrending } from "@/features/news/server/data";
import { z } from "zod";

import { StoryList } from "./article-list";
import { ErrorPanel } from "./dashboard-shell";

const PAGE_SIZE = 20;

type Tab = "for-you" | "trending" | "following";

type Params = { tab?: string; q?: string; topic?: string; page?: string };

function href(params: Params): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value && !(key === "page" && value === "1")) {
      search.set(key, value);
    }
  }

  const query = search.toString();

  return query ? `/dashboard?${query}` : "/dashboard";
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function Feed({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const rawTab = first(raw.tab);
  const tab: Tab =
    rawTab === "trending" || rawTab === "following" ? rawTab : "for-you";
  const q = first(raw.q)?.trim() || undefined;
  const topic = first(raw.topic) || undefined;
  const page = Math.max(1, Number.parseInt(first(raw.page) ?? "1", 10) || 1);
  const filtered = Boolean(q || topic);
  const searching = filtered && tab !== "following";

  const result = await attempt(async () => {
    const profile = await getProfile();
    const query = new URLSearchParams({
      page: String(page),
      page_size: String(PAGE_SIZE),
    });

    const topicsRequest = apiRequest("/topics/tree", z.array(topicNodeSchema));
    let articlesRequest;

    if (searching) {
      if (q) query.set("q", q);
      if (topic) query.set("topic_id", topic);
      // Search the reader's language only, like the feed: one language collection, not all.
      query.set("language", profile.preferred_language);
      articlesRequest = apiRequest(
        `/articles?${query}`,
        pageSchema(articleSummarySchema),
      );
    } else if (tab === "following") {
      articlesRequest = getFollowingFeed(page);
    } else if (tab === "trending") {
      articlesRequest = getTrending(20, profile.preferred_language).then((items) => ({
        items,
        total: items.length,
        page: 1,
        page_size: items.length || 1,
        pages: 1,
      }));
    } else {
      articlesRequest = apiRequest(
        `/feeds/personalized?${query}`,
        pageSchema(articleSummarySchema),
      );
    }

    const [articles, topics] = await Promise.all([
      articlesRequest,
      topicsRequest,
    ]);

    return { profile, articles, topics };
  });

  if (!result.ok) {
    return <ErrorPanel message={result.message} />;
  }

  const { profile, articles, topics } = result.data;
  const activeTopic = flattenTopics(topics).find((item) => item.id === topic);
  const current: Params = { tab: tab === "for-you" ? undefined : tab, q, topic };

  return (
    <div className="dash-home">
      <form className="dash-search" action="/dashboard" role="search">
        <Search className="dash-search__icon dash-icon" aria-hidden="true" />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search news"
          aria-label="Search news"
        />
        {tab !== "for-you" ? (
          <input type="hidden" name="tab" value={tab} />
        ) : null}
        {topic ? <input type="hidden" name="topic" value={topic} /> : null}
        <button className="dash-primary" type="submit">
          Search
        </button>
      </form>

      {topics.length ? (
        <ul className="dash-chips">
          {topics.map((item) => (
            <li key={item.id}>
              <Link
                className={`dash-chip${topic === item.id ? " is-active" : ""}`}
                href={href({ ...current, topic: topic === item.id ? undefined : item.id })}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="dash-tabs" role="tablist" aria-label="Feed">
        <Link
          className={`dash-tab${tab === "for-you" ? " is-active" : ""}`}
          href={href({ q, topic })}
          role="tab"
          aria-selected={tab === "for-you"}
        >
          For you
        </Link>
        <Link
          className={`dash-tab${tab === "trending" ? " is-active" : ""}`}
          href={href({ tab: "trending", q, topic })}
          role="tab"
          aria-selected={tab === "trending"}
        >
          Trending
        </Link>
        <Link
          className={`dash-tab${tab === "following" ? " is-active" : ""}`}
          href={href({ tab: "following", q, topic })}
          role="tab"
          aria-selected={tab === "following"}
        >
          Following
        </Link>
      </div>

      {searching ? (
        <div className="dash-results">
          <span>
            {articles.total} {articles.total === 1 ? "story" : "stories"}
            {activeTopic ? ` in ${activeTopic.name}` : ""}
            {q ? ` matching “${q}”` : ""}
          </span>
          <Link href={href({ tab: current.tab })}>Clear filters</Link>
        </div>
      ) : tab === "for-you" ? (
        <p className="dash-results">
          Stories in {profile.preferred_language.toUpperCase()}
          {profile.topic_ids.length ? " matching your interests" : ""}.
        </p>
      ) : null}

      {articles.items.length ? (
        <StoryList articles={articles.items} />
      ) : (
        <div className="dash-empty">
          <h2>No stories found</h2>
          <p>
            {filtered
              ? "Try a different search or clear the filters."
              : canEdit(profile)
                ? "Run a newsroom cycle in the editor workspace, then publish a story to the dashboard."
                : "Stories appear here as soon as an editor publishes them."}
          </p>
          {canEdit(profile) && !filtered && tab === "for-you" ? (
            <Link className="dash-primary" href="/editor">
              Open editor
            </Link>
          ) : null}
        </div>
      )}

      {articles.pages > 1 ? (
        <nav className="dash-pager" aria-label="Pagination">
          {page > 1 ? (
            <Link href={href({ ...current, page: String(page - 1) })}>
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          <span>
            Page {articles.page} of {articles.pages}
          </span>
          {page < articles.pages ? (
            <Link href={href({ ...current, page: String(page + 1) })}>
              Next →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}
