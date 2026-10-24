import Link from "next/link";

import { articleSummarySchema, pageSchema } from "@/features/news/schemas";
import { apiRequest, attempt, getProfile } from "@/features/news/server/api";

import { StoryList } from "./article-list";
import { ErrorPanel } from "./dashboard-shell";
import { ViewHeader } from "./views";

const PAGE_SIZE = 20;

function newsroomPage(page: number, language?: string) {
  const query = new URLSearchParams({
    newsroom: "true",
    page: String(page),
    page_size: String(PAGE_SIZE),
  });

  if (language) {
    query.set("language", language);
  }

  return apiRequest(`/articles?${query}`, pageSchema(articleSummarySchema));
}

/** Every story an editor has published. Readers add the ones they want to their list. */
export async function NewsroomView({ page }: { page: number }) {
  const result = await attempt(async () => {
    const profile = await getProfile();
    const mine = await newsroomPage(page, profile.preferred_language);

    // Nothing in the reader's language yet: show every language rather than an empty page.
    if (mine.total === 0) {
      return { articles: await newsroomPage(page), allLanguages: true, profile };
    }

    return { articles: mine, allLanguages: false, profile };
  });

  if (!result.ok) {
    return <ErrorPanel message={result.message} />;
  }

  const { articles, allLanguages, profile } = result.data;

  return (
    <div className="dash-view">
      <ViewHeader
        title="Newsroom"
        sub={
          allLanguages
            ? "Every story our editors have published. Add the ones you want to your list."
            : `Every story our editors have published, in ${profile.preferred_language.toUpperCase()}. Add the ones you want to your list.`
        }
        action={
          <Link className="dash-secondary" href="/dashboard/saved">
            My list
          </Link>
        }
      />

      {articles.items.length ? (
        <StoryList articles={articles.items} addLabels={["Add", "Added"]} />
      ) : (
        <div className="dash-empty">
          <h2>No stories published yet</h2>
          <p>Stories appear here as soon as an editor publishes them to the dashboard.</p>
        </div>
      )}

      {articles.pages > 1 ? (
        <nav className="dash-pager" aria-label="Pagination">
          {page > 1 ? (
            <Link href={`/dashboard/newsroom?page=${page - 1}`}>← Previous</Link>
          ) : (
            <span />
          )}
          <span>
            Page {articles.page} of {articles.pages}
          </span>
          {page < articles.pages ? (
            <Link href={`/dashboard/newsroom?page=${page + 1}`}>Next →</Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}
