import type { FollowCard } from "@/features/news/schemas";
import { attempt } from "@/features/news/server/api";
import { getDirectory, getRecommended } from "@/features/news/server/data";

import { ErrorPanel } from "@/features/dashboard/components/dashboard-shell";
import { ViewHeader } from "@/features/dashboard/components/views";

import { FollowToggle } from "./follow-toggle";

function FollowRow({ card, showReasons = false }: { card: FollowCard; showReasons?: boolean }) {
  return (
    <li className="dash-follow-row" key={`${card.kind}-${card.id}`}>
      <span className="dash-item__avatar" aria-hidden="true">
        {card.name.charAt(0).toUpperCase()}
      </span>
      <span className="dash-follow-row__name">
        {card.name}
        <small>
          {card.kind === "official" ? "Official · " : ""}
          {card.languages.map((code) => code.toUpperCase()).join(" · ")}
          {card.followers ? ` · ${card.followers} following` : ""}
        </small>
        {showReasons && card.reasons.length ? (
          <small className="dash-follow-row__why">{card.reasons.slice(0, 2).join(" · ")}</small>
        ) : null}
      </span>
      <FollowToggle
        kind={card.kind}
        targetId={card.id}
        name={card.name}
        following={card.following}
      />
    </li>
  );
}

/** Find communities and official accounts to follow, starting with the recommended ones. */
export async function DiscoverView() {
  const result = await attempt(async () => {
    const [directory, recommended] = await Promise.all([getDirectory(), getRecommended(6)]);

    return { directory, recommended };
  });

  if (!result.ok) {
    return <ErrorPanel message={result.message} />;
  }

  const { directory, recommended } = result.data;
  const followingIds = new Set(
    [...directory.communities, ...directory.official]
      .filter((card) => card.following)
      .map((card) => `${card.kind}:${card.id}`),
  );
  const suggestions = recommended.filter((card) => !followingIds.has(`${card.kind}:${card.id}`));

  return (
    <div className="dash-view">
      <ViewHeader
        title="Discover"
        sub="Follow the communities and official sources you care about. Their stories appear in Following."
      />

      {suggestions.length ? (
        <section className="dash-article__section" aria-labelledby="recommended-follows">
          <h2 id="recommended-follows">Recommended to follow</h2>
          <ul className="dash-follow-list">
            {suggestions.map((card) => (
              <FollowRow key={`${card.kind}-${card.id}`} card={card} showReasons />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="dash-article__section" aria-labelledby="all-communities">
        <h2 id="all-communities">Communities</h2>
        <ul className="dash-follow-list">
          {directory.communities.map((card) => (
            <FollowRow key={card.id} card={card} />
          ))}
        </ul>
      </section>

      <section className="dash-article__section" aria-labelledby="official-sources">
        <h2 id="official-sources">Official sources</h2>
        <ul className="dash-follow-list">
          {directory.official.map((card) => (
            <FollowRow key={card.id} card={card} />
          ))}
        </ul>
      </section>
    </div>
  );
}
