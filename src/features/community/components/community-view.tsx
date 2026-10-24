import Link from "next/link";

import type { Community } from "@/features/news/schemas";
import { attempt } from "@/features/news/server/api";
import {
  getCommunities,
  getCommunityFeed,
  getMember,
  getMyMessages,
} from "@/features/news/server/data";

import { ErrorPanel } from "@/features/dashboard/components/dashboard-shell";
import { ViewHeader } from "@/features/dashboard/components/views";

import { ContributionForm } from "./contribution-form";
import { JoinButton } from "./join-button";
import { StoryCard } from "./story-card";

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

export function CommunityPicker({
  communities,
  currentId,
}: {
  communities: Community[];
  currentId?: string | null;
}) {
  return (
    <div className="dash-view">
      <ViewHeader
        title={currentId ? "Change your community" : "Find your community"}
        sub="Local news, explained for you. Choose the community that fits. You can change it later."
      />
      <ul className="dash-communities">
        {communities.map((community) => (
          <li className="dash-community" key={community.id}>
            <h2>{community.name}</h2>
            <p>{community.description}</p>
            <p className="dash-muted">
              Languages: {community.languages.map((lane) => lane.label).join(", ")}
              {community.seasonal ? " · Built for a short stay" : ""}
            </p>
            {community.trusted_voices.length ? (
              <p className="dash-muted">
                Reviewed with: {community.trusted_voices.map((v) => v.role).join(", ")}
              </p>
            ) : null}
            {community.id === currentId ? (
              <span className="dash-tag">Your community</span>
            ) : (
              <JoinButton
                communityId={community.id}
                language={community.languages[0]?.code}
                label="Join this community"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function CommunityView() {
  const result = await attempt(async () => {
    const [member, communities] = await Promise.all([getMember(), getCommunities()]);

    return { member, communities };
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

  const { member, communities } = result.data;
  const mine = communities.find((item) => item.id === member.community_id);

  if (!mine) {
    return <CommunityPicker communities={communities} />;
  }

  const feedResult = await attempt(async () => {
    const [feed, messages] = await Promise.all([
      getCommunityFeed(mine.id),
      getMyMessages(),
    ]);

    return { feed, messages };
  });

  if (!feedResult.ok) {
    return <ErrorPanel message={feedResult.message} />;
  }

  const { feed, messages } = feedResult.data;

  return (
    <div className="dash-view">
      <ViewHeader
        title={mine.name}
        sub="Every story here was checked and approved by a named person. Agents help find and explain the news. People decide what is published."
        action={
          <Link className="dash-secondary" href="/dashboard/community/change">
            Change community
          </Link>
        }
      />

      <section aria-labelledby="community-stories">
        <h2 className="dash-section-title" id="community-stories">
          Stories for you
        </h2>
        {feed.length ? (
          <div className="dash-stories">
            {feed.map((story) => (
              <StoryCard key={story.story_id} story={story} language={member.language} />
            ))}
          </div>
        ) : (
          <div className="dash-empty">
            <h2>Nothing approved yet</h2>
            <p>
              New stories appear here after an editor approves them. You can already ask a
              question or suggest a story below.
            </p>
          </div>
        )}
      </section>

      <section aria-labelledby="community-participate">
        <h2 className="dash-section-title" id="community-participate">
          Take part
        </h2>
        <p className="dash-muted">
          This is your newsroom too. Ask, suggest, share what you know, or tell us what we got
          wrong.
        </p>
        <ContributionForm
          stories={feed.map((story) => ({ id: story.story_id, headline: story.headline }))}
        />
      </section>

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
