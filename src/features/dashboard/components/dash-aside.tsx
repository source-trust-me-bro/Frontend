import Link from "next/link";

import { flattenTopics } from "@/features/news/schemas";
import { attempt, getProfile } from "@/features/news/server/api";
import {
  getSources,
  getTopicTree,
  getTrending,
} from "@/features/news/server/data";

import { FollowButton } from "./article-controls";

/** Right rail: curated picks, categories and sources worth following. */
export async function DashAside() {
  const result = await attempt(async () => {
    const [picks, topics, sources, profile] = await Promise.all([
      getTrending(5),
      getTopicTree(),
      getSources(),
      getProfile(),
    ]);

    return { picks, topics, sources, profile };
  });

  if (!result.ok) {
    return null;
  }

  const { picks, topics, sources, profile } = result.data;
  const followed = new Set(profile.followed_source_ids);
  const suggestions = sources.items
    .filter((source) => source.active && !followed.has(source.id))
    .slice(0, 5);

  return (
    <aside className="dash-aside" aria-label="Curated picks and recommendations">
      <section>
        <h2 className="dash-aside__title">Curated picks</h2>
        {picks.length ? (
          <ul className="dash-picks">
            {picks.map((pick) => (
              <li key={pick.id}>
                <Link
                  className="dash-pick"
                  href={`/dashboard/articles/${pick.id}`}
                >
                  <span className="dash-pick__meta">
                    {pick.source_name} · {pick.language.toUpperCase()}
                  </span>
                  <span className="dash-pick__title">{pick.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dash-muted">Picks appear as stories are ingested.</p>
        )}
      </section>

      <section className="dash-aside__section">
        <h2 className="dash-aside__title">Categories</h2>
        {topics.length ? (
          <ul className="dash-cats">
            {flattenTopics(topics)
              .slice(0, 12)
              .map((topic) => (
                <li key={topic.id}>
                  <Link
                    className="dash-cat"
                    href={`/dashboard?topic=${topic.id}`}
                  >
                    {topic.name}
                  </Link>
                </li>
              ))}
          </ul>
        ) : (
          <p className="dash-muted">No categories yet.</p>
        )}
        <Link className="dash-more" href="/dashboard/topics">
          View more categories
        </Link>
      </section>

      {suggestions.length ? (
        <section className="dash-aside__section">
          <h2 className="dash-aside__title">Recommended follows</h2>
          <ul className="dash-follows">
            {suggestions.map((source) => (
              <li className="dash-follow-row" key={source.id}>
                <span className="dash-item__avatar" aria-hidden="true">
                  {source.name.charAt(0).toUpperCase()}
                </span>
                <span className="dash-follow-row__name">{source.name}</span>
                <FollowButton sourceId={source.id} following={false} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </aside>
  );
}
