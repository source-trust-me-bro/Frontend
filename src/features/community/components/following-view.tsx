import Link from "next/link";

import { attempt } from "@/features/news/server/api";
import {
  getFollows,
  getLanguages,
  getMember,
  getMyCommunityFeed,
} from "@/features/news/server/data";

import { ErrorPanel } from "@/features/dashboard/components/dashboard-shell";
import { ViewHeader } from "@/features/dashboard/components/views";

import { FollowToggle } from "./follow-toggle";
import { ReadingLanguages, type LanguageOption } from "./reading-languages";
import { StoryActions } from "./story-actions";
import { StoryCard } from "./story-card";

/**
 * The stories from everything the reader follows, in the languages they read. Nothing from a
 * community they do not follow, and no edition in a language they do not read.
 */
export async function FollowingStoriesView() {
  const result = await attempt(async () => {
    const [member, follows, feed, languages] = await Promise.all([
      getMember(),
      getFollows(),
      getMyCommunityFeed(),
      getLanguages(),
    ]);

    return { member, follows, feed, languages };
  });

  if (!result.ok) {
    return <ErrorPanel message={result.message} />;
  }

  const { member, follows, feed, languages } = result.data;
  const reads = [member.language, ...member.reading_languages];
  const labels = new Map(languages.map((item) => [item.code, item.label]));
  // Every supported language can be chosen, with how many stories it has.
  const options: LanguageOption[] = languages.map((item) => ({
    code: item.code,
    label: item.label,
    count: item.articles,
  }));

  return (
    <div className="dash-view">
      <ViewHeader
        title="Following"
        sub="Stories from the communities and official sources you follow, in the languages you read."
        action={
          <Link className="dash-secondary" href="/dashboard/community?tab=discover">
            Find more to follow
          </Link>
        }
      />

      <ReadingLanguages
        options={options}
        main={member.language}
        alsoReads={member.reading_languages}
      />

      {follows.length ? (
        <ul className="dash-follow-list" aria-label="You follow">
          {follows.map((card) => (
            <li className="dash-follow-row" key={`${card.kind}-${card.id}`}>
              <span className="dash-item__avatar" aria-hidden="true">
                {card.name.charAt(0).toUpperCase()}
              </span>
              <span className="dash-follow-row__name">
                {card.name}
                <small>{card.kind === "official" ? "Official source" : "Community"}</small>
              </span>
              <FollowToggle kind={card.kind} targetId={card.id} name={card.name} following />
            </li>
          ))}
        </ul>
      ) : (
        <div className="dash-empty">
          <h2>You do not follow anything yet</h2>
          <p>
            Follow communities and official sources, and their stories appear here. Nothing is
            shown until you choose what you care about.
          </p>
          <Link className="dash-primary" href="/dashboard/community?tab=discover">
            Choose what to follow
          </Link>
        </div>
      )}

      {follows.length && !feed.length ? (
        <div className="dash-empty">
          <h2>Nothing to read yet</h2>
          <p>
            There are no approved stories in{" "}
            {reads.map((code) => labels.get(code) ?? code).join(", ")} from what you follow. Add
            another language you read, or follow more communities.
          </p>
        </div>
      ) : null}

      {feed.length ? (
        <div className="dash-stories">
          {feed.map((item) => {
            // Only the editions in languages the reader reads, never the others.
            const story = {
              ...item,
              renditions: item.renditions.filter((r) => reads.includes(r.language)),
            };

            return (
              <div key={item.story_id}>
                <StoryCard story={story} language={item.language ?? member.language} />
                <StoryActions
                  storyId={item.story_id}
                  stats={item.stats}
                  liked={item.liked_by_me}
                />
                {item.because.length ? (
                  <p className="dash-muted dash-story__because">{item.because.join(" · ")}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
