import Link from "next/link";

import { attempt } from "@/features/news/server/api";
import { getFollows, getMyCommunityFeed, getMyMessages } from "@/features/news/server/data";

import { ErrorPanel } from "@/features/dashboard/components/dashboard-shell";
import { ViewHeader } from "@/features/dashboard/components/views";

import { ContributionForm } from "./contribution-form";

const statusText: Record<string, string> = {
  new: "Received",
  triaged: "With the editors",
  answered: "Answered",
  rejected: "Not used",
};

const kindText: Record<string, string> = {
  question: "Question",
  tip: "Story suggestion",
  local_knowledge: "Local knowledge",
  correction: "Correction request",
};

/**
 * Ask, suggest, share and request corrections. A member can follow any number of communities,
 * so each message says which one it is for.
 */
export async function ParticipateView() {
  const result = await attempt(async () => {
    const [follows, feed, messages] = await Promise.all([
      getFollows(),
      getMyCommunityFeed(),
      getMyMessages(),
    ]);

    return { follows, feed, messages };
  });

  if (!result.ok) {
    return (
      <ErrorPanel
        message={
          result.status === 503
            ? "The community newsroom is not available right now. Please try again later."
            : result.message
        }
      />
    );
  }

  const { follows, feed, messages } = result.data;
  const communities = follows
    .filter((card) => card.kind === "community")
    .map((card) => ({ id: card.id, name: card.name }));

  return (
    <div className="dash-view">
      <ViewHeader
        title="Take part"
        sub="This is your newsroom too. Ask, suggest, share what you know, or tell us what we got wrong. Every story is checked and approved by a named person."
        action={
          <Link className="dash-secondary" href="/dashboard/community?tab=discover">
            Follow more communities
          </Link>
        }
      />

      {communities.length ? (
        <section aria-labelledby="community-participate">
          <h2 className="dash-section-title" id="community-participate">
            Send something to a community
          </h2>
          <ContributionForm
            communities={communities}
            stories={feed.map((story) => ({ id: story.story_id, headline: story.headline }))}
          />
        </section>
      ) : (
        <div className="dash-empty">
          <h2>Follow a community to take part</h2>
          <p>
            Choose the communities you care about. You can follow as many as you like, and
            stop following any time. Then you can ask them questions and suggest stories.
          </p>
          <Link className="dash-primary" href="/dashboard/community?tab=discover">
            Choose communities
          </Link>
        </div>
      )}

      {messages.length ? (
        <section aria-labelledby="community-mine">
          <h2 className="dash-section-title" id="community-mine">
            Your contributions
          </h2>
          <ul className="dash-mine">
            {messages.map((message) => (
              <li key={message.id}>
                <span className="dash-tag">{kindText[message.kind] ?? message.kind}</span>
                <span>{message.text}</span>
                <span className="dash-muted">{statusText[message.status] ?? message.status}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
