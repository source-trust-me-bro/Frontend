import type { ArticleSummary } from "@/features/news/schemas";
import { attempt } from "@/features/news/server/api";
import { getLibraryState } from "@/features/news/server/data";

import { NewsCard } from "./news-card";

export { formatDate } from "./format-date";

export function ArticleList({
  articles,
  saved,
  addLabels,
  communityId,
}: {
  articles: ArticleSummary[];
  saved?: Set<string> | null;
  /** Show a labelled add button (for example "Add" / "Added") instead of the bookmark icon. */
  addLabels?: [string, string];
  /** The newsroom community this list is shown for, so outbound clicks count for it. */
  communityId?: string;
}) {
  return (
    <ul className="dash-list">
      {articles.map((article) => (
        <NewsCard
          key={article.id}
          article={article}
          saved={saved ? saved.has(article.id) : undefined}
          addLabels={addLabels}
          communityId={communityId}
        />
      ))}
    </ul>
  );
}

/** Article list that also marks which stories the reader has saved. */
export async function StoryList({
  articles,
  addLabels,
  communityId,
}: {
  articles: ArticleSummary[];
  addLabels?: [string, string];
  communityId?: string;
}) {
  const state = await attempt(getLibraryState);

  return (
    <ArticleList
      articles={articles}
      saved={state.ok ? new Set(state.data.saved) : null}
      addLabels={addLabels}
      communityId={communityId}
    />
  );
}
