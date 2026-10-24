import { Fragment } from "react";

import type { ArticleSummary } from "@/features/news/schemas";
import { attempt } from "@/features/news/server/api";
import { getLibraryState } from "@/features/news/server/data";

import { NewsCard } from "./news-card";
import { SponsorSlot } from "./sponsor-slot";

export { formatDate } from "./format-date";

/** A sponsored box sits after every this many stories. */
const SPONSOR_EVERY = 3;

export function ArticleList({
  articles,
  saved,
  addLabels,
  communityId,
  sponsored = true,
}: {
  /** Show a labelled sponsored box between stories. */
  sponsored?: boolean;
  articles: ArticleSummary[];
  saved?: Set<string> | null;
  /** Show a labelled add button (for example "Add" / "Added") instead of the bookmark icon. */
  addLabels?: [string, string];
  /** The newsroom community this list is shown for, so outbound clicks count for it. */
  communityId?: string;
}) {
  return (
    <ul className="dash-list">
      {articles.map((article, index) => (
        <Fragment key={article.id}>
          <NewsCard
            article={article}
            saved={saved ? saved.has(article.id) : undefined}
            addLabels={addLabels}
            communityId={communityId}
          />
          {sponsored && (index + 1) % SPONSOR_EVERY === 0 && index < articles.length - 1 ? (
            <SponsorSlot index={(index + 1) / SPONSOR_EVERY - 1} />
          ) : null}
        </Fragment>
      ))}
    </ul>
  );
}

/** Article list that also marks which stories the reader has saved. */
export async function StoryList({
  articles,
  addLabels,
  communityId,
  sponsored = true,
}: {
  articles: ArticleSummary[];
  addLabels?: [string, string];
  communityId?: string;
  sponsored?: boolean;
}) {
  const state = await attempt(getLibraryState);

  return (
    <ArticleList
      articles={articles}
      sponsored={sponsored}
      saved={state.ok ? new Set(state.data.saved) : null}
      addLabels={addLabels}
      communityId={communityId}
    />
  );
}
