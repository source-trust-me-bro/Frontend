import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { StoryList } from "@/features/dashboard/components/article-list";
import { ErrorPanel } from "@/features/dashboard/components/dashboard-shell";
import { ViewHeader } from "@/features/dashboard/components/views";
import { attempt, getProfile } from "@/features/news/server/api";
import { getCommunities, getCommunityArticles } from "@/features/news/server/data";

export const metadata: Metadata = {
  title: "Community stories",
};

export const instant = false;

export default function CommunityStoriesPage({
  params,
}: PageProps<"/dashboard/community/[id]">) {
  return (
    <CommunityStories params={params} />
  );
}

/** One community's stories, ranked from the news tree, in the reader's language. */
async function CommunityStories({
  params,
}: {
  params: PageProps<"/dashboard/community/[id]">["params"];
}) {
  const { id } = await params;

  const result = await attempt(async () => {
    const [communities, profile] = await Promise.all([getCommunities(), getProfile()]);
    const community = communities.find((item) => item.id === id);

    if (!community) {
      return null;
    }

    const articles = await getCommunityArticles(community.id, profile.preferred_language);

    return { community, articles };
  });

  if (!result.ok) {
    return <ErrorPanel message={result.message} />;
  }

  if (!result.data) {
    notFound();
  }

  const { community, articles } = result.data;

  return (
    <div className="dash-view">
      <Link className="dash-back" href="/dashboard/community">
        <ArrowLeft className="dash-icon" aria-hidden="true" /> Back to community
      </Link>
      <ViewHeader title={community.name} sub={community.description} />
      {articles.length ? (
        <StoryList articles={articles} communityId={community.id} />
      ) : (
        <div className="dash-empty">
          <h2>No stories for this community yet</h2>
          <p>Stories written for this community, or about what it follows, appear here.</p>
        </div>
      )}
    </div>
  );
}
