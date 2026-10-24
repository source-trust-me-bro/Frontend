import Link from "next/link";
import type { ReactNode } from "react";

import { attempt, getProfile } from "@/features/news/server/api";
import {
  getFollowedSources,
  getFollowingFeed,
  getLibraryPage,
  getSources,
  getTrending,
  type LibraryKind,
} from "@/features/news/server/data";
import {
  apiRequest,
} from "@/features/news/server/api";
import {
  articleSummarySchema,
  pageSchema,
} from "@/features/news/schemas";

import { ListenButton, ClearButton, FollowButton } from "./article-controls";
import { StoryList, formatDate } from "./article-list";
import { ErrorPanel } from "./dashboard-shell";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function pageNumber(searchParams: SearchParams): Promise<number> {
  const raw = (await searchParams).page;
  const value = Array.isArray(raw) ? raw[0] : raw;

  return Math.max(1, Number.parseInt(value ?? "1", 10) || 1);
}

export function ViewHeader({
  title,
  sub,
  action,
}: {
  title: string;
  sub: string;
  action?: ReactNode;
}) {
  return (
    <div className="dash-view__head">
      <div>
        <h1 className="dash-view__title">{title}</h1>
        <p className="dash-view__sub">{sub}</p>
      </div>
      {action}
    </div>
  );
}

function Empty({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="dash-empty">
      <h2>{title}</h2>
      <p>{body}</p>
      {href && cta ? (
        <Link className="dash-primary" href={href}>
          {cta}
        </Link>
      ) : null}
    </div>
  );
}

function Pager({
  base,
  page,
  pages,
}: {
  base: string;
  page: number;
  pages: number;
}) {
  if (pages <= 1) {
    return null;
  }

  return (
    <nav className="dash-pager" aria-label="Pagination">
      {page > 1 ? (
        <Link href={`${base}?page=${page - 1}`}>← Previous</Link>
      ) : (
        <span />
      )}
      <span>
        Page {page} of {pages}
      </span>
      {page < pages ? (
        <Link href={`${base}?page=${page + 1}`}>Next →</Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

const libraryCopy: Record<
  LibraryKind,
  {
    title: string;
    sub: string;
    base: string;
    emptyTitle: string;
    emptyBody: string;
  }
> = {
  saved: {
    title: "Saved stories",
    sub: "Stories you bookmarked for later.",
    base: "/dashboard/saved",
    emptyTitle: "Nothing saved yet",
    emptyBody: "Use the bookmark on any story and it will appear here.",
  },
  history: {
    title: "Reading history",
    sub: "Stories you have opened recently.",
    base: "/dashboard/history",
    emptyTitle: "No reading history yet",
    emptyBody: "Open a story to start your history.",
  },
  downloaded: {
    title: "Downloaded stories",
    sub: "Stories you kept for offline reading.",
    base: "/dashboard/downloaded",
    emptyTitle: "No downloads yet",
    emptyBody: "Open a story and choose Download to keep it here.",
  },
};

export async function LibraryView({
  kind,
  searchParams,
}: {
  kind: LibraryKind;
  searchParams: SearchParams;
}) {
  const page = await pageNumber(searchParams);
  const copy = libraryCopy[kind];
  const result = await attempt(() => getLibraryPage(kind, page));

  if (!result.ok) {
    return <ErrorPanel message={result.message} />;
  }

  const { items, pages, total } = result.data;
  const clear =
    items.length && kind !== "saved" ? (
      <ClearButton
        kind={kind === "history" ? "history" : "downloads"}
        label={kind === "history" ? "Clear history" : "Clear downloads"}
      />
    ) : null;

  return (
    <div className="dash-view">
      <ViewHeader
        title={copy.title}
        sub={`${copy.sub} ${total ? `${total} in total.` : ""}`.trim()}
        action={clear}
      />
      {items.length ? (
        <>
          <StoryList articles={items} />
          <Pager base={copy.base} page={page} pages={pages} />
        </>
      ) : (
        <Empty
          title={copy.emptyTitle}
          body={copy.emptyBody}
          href="/dashboard"
          cta="Browse stories"
        />
      )}
    </div>
  );
}

export async function TrendingView() {
  const result = await attempt(() => getTrending(20));

  if (!result.ok) {
    return <ErrorPanel message={result.message} />;
  }

  return (
    <div className="dash-view">
      <ViewHeader
        title="Now trending"
        sub="The stories readers opened most this week."
      />
      {result.data.length ? (
        <StoryList articles={result.data} />
      ) : (
        <Empty
          title="Nothing is trending yet"
          body="Trending fills in as readers open stories."
        />
      )}
    </div>
  );
}

export async function AudioView() {
  const result = await attempt(() =>
    apiRequest("/articles?page_size=20", pageSchema(articleSummarySchema)),
  );

  if (!result.ok) {
    return <ErrorPanel message={result.message} />;
  }

  const articles = result.data.items;

  return (
    <div className="dash-view">
      <ViewHeader
        title="Audio books"
        sub="Listen to stories read aloud by your browser's speech engine."
      />
      {articles.length ? (
        <ul className="dash-audio-list">
          {articles.map((article) => (
            <li className="dash-audio-item" key={article.id}>
              <div className="dash-audio-item__body">
                <span className="dash-item__meta">
                  {article.source_name} · {article.language.toUpperCase()} ·{" "}
                  {formatDate(article.published_at ?? article.created_at)}
                </span>
                <Link
                  className="dash-item__title"
                  href={`/dashboard/articles/${article.id}`}
                >
                  {article.title}
                </Link>
              </div>
              <ListenButton
                id={article.id}
                language={article.language}
                text={[article.title, article.summary]
                  .filter(Boolean)
                  .join(". ")}
              />
            </li>
          ))}
        </ul>
      ) : (
        <Empty
          title="No stories to play"
          body="Stories appear once editors ingest news sources."
        />
      )}
    </div>
  );
}

export async function FollowingView({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = await pageNumber(searchParams);
  const result = await attempt(async () => {
    const [profile, sources, followed, feed] = await Promise.all([
      getProfile(),
      getSources(),
      getFollowedSources(),
      getFollowingFeed(page),
    ]);

    return { profile, sources, followed, feed };
  });

  if (!result.ok) {
    return <ErrorPanel message={result.message} />;
  }

  const { sources, followed, feed } = result.data;
  const followedIds = new Set(followed.map((source) => source.id));
  const suggestions = sources.items.filter(
    (source) => source.active && !followedIds.has(source.id),
  );

  return (
    <div className="dash-view">
      <ViewHeader
        title="Following"
        sub="News sources you follow and their latest stories."
      />

      {followed.length ? (
        <ul className="dash-follow-list">
          {followed.map((source) => (
            <li className="dash-follow-row" key={source.id}>
              <span className="dash-item__avatar" aria-hidden="true">
                {source.name.charAt(0).toUpperCase()}
              </span>
              <span className="dash-follow-row__name">{source.name}</span>
              <FollowButton sourceId={source.id} following />
            </li>
          ))}
        </ul>
      ) : null}

      {suggestions.length ? (
        <section className="dash-article__section">
          <h2>Sources to follow</h2>
          <ul className="dash-follow-list">
            {suggestions.map((source) => (
              <li className="dash-follow-row" key={source.id}>
                <span className="dash-item__avatar" aria-hidden="true">
                  {source.name.charAt(0).toUpperCase()}
                </span>
                <span className="dash-follow-row__name">
                  {source.name}
                  <small>{source.language.toUpperCase()}</small>
                </span>
                <FollowButton sourceId={source.id} following={false} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!followed.length && !suggestions.length ? (
        <Empty
          title="No sources yet"
          body="Editors add news sources in the editor workspace."
        />
      ) : null}

      {feed.items.length ? (
        <section className="dash-article__section">
          <h2>Latest from your sources</h2>
          <StoryList articles={feed.items} />
          <Pager base="/dashboard/following" page={page} pages={feed.pages} />
        </section>
      ) : null}
    </div>
  );
}

const helpItems = [
  {
    question: "How is my For you feed chosen?",
    answer:
      "It shows stories in your reading language, narrowed to the topics you picked in Settings. Change either at any time.",
  },
  {
    question: "What do Saved, Read history and Downloaded do?",
    answer:
      "Saved keeps bookmarks, Read history lists stories you opened, and Download keeps a text copy of a story. All three are stored on your account, so they follow you across devices.",
  },
  {
    question: "How does following work?",
    answer:
      "You follow news sources. The Following tab shows the latest stories from every source you follow.",
  },
  {
    question: "How does audio work?",
    answer:
      "Listen uses your browser's built-in speech engine, so it works offline and no audio leaves your device. Voices depend on your browser and operating system.",
  },
  {
    question: "Who can add sources and topics?",
    answer:
      "Editors and admins. They manage sources, topics and ingestion in the Editor workspace. Ask an admin if you need editor access.",
  },
];

export function HelpView() {
  return (
    <div className="dash-view">
      <ViewHeader
        title="Help"
        sub="Answers to common questions about KalevaShorts."
      />
      <div className="dash-help">
        {helpItems.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
      <Link className="dash-secondary" href="/dashboard/feedback">
        Send feedback
      </Link>
    </div>
  );
}
