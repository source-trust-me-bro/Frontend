import Link from "next/link";

import type { ArticleSummary } from "@/features/news/schemas";
import { attempt } from "@/features/news/server/api";
import { getLibraryState } from "@/features/news/server/data";

import { SaveButton } from "./article-controls";

export function formatDate(iso: string | null | undefined): string {
  if (!iso) {
    return "";
  }

  return new Intl.DateTimeFormat("en-FI", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Helsinki",
  }).format(new Date(iso));
}

export function ArticleList({
  articles,
  saved,
}: {
  articles: ArticleSummary[];
  saved?: Set<string> | null;
}) {
  return (
    <ul className="dash-list">
      {articles.map((article) => (
        <li className="dash-item" key={article.id}>
          <span className="dash-item__avatar" aria-hidden="true">
            {article.source_name.charAt(0).toUpperCase()}
          </span>
          <div className="dash-item__body">
            <div className="dash-item__meta">
              <span>{article.source_name}</span>
              <i className="dash-meta__dot" aria-hidden="true" />
              <span>{article.language.toUpperCase()}</span>
              {article.author ? (
                <>
                  <i className="dash-meta__dot" aria-hidden="true" />
                  <span>{article.author}</span>
                </>
              ) : null}
            </div>
            <h3 className="dash-item__title">
              <Link href={`/dashboard/articles/${article.id}`}>
                {article.title}
              </Link>
            </h3>
            {article.summary ? (
              <p className="dash-item__text">{article.summary}</p>
            ) : null}
            <time
              className="dash-item__time"
              dateTime={article.published_at ?? article.created_at}
            >
              {formatDate(article.published_at ?? article.created_at)}
            </time>
          </div>
          {saved ? (
            <SaveButton articleId={article.id} saved={saved.has(article.id)} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/** Article list that also marks which stories the reader has saved. */
export async function StoryList({ articles }: { articles: ArticleSummary[] }) {
  const state = await attempt(getLibraryState);

  return (
    <ArticleList
      articles={articles}
      saved={state.ok ? new Set(state.data.saved) : null}
    />
  );
}
