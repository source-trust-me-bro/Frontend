import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, MousePointerClick, Users } from "lucide-react";
import { z } from "zod";

import {
  FollowButton,
  ReadTracker,
  SaveButton,
} from "@/features/dashboard/components/article-controls";
import {
  StoryList,
  formatDate,
} from "@/features/dashboard/components/article-list";
import { ErrorPanel } from "@/features/dashboard/components/dashboard-shell";
import {
  articleDetailSchema,
  translationSchema,
} from "@/features/news/schemas";
import { apiRequest, attempt, getProfile } from "@/features/news/server/api";
import {
  getFollows,
  getLibraryState,
  getRelatedArticles,
} from "@/features/news/server/data";
import { Markdown } from "@/features/community/components/markdown";

export const metadata: Metadata = {
  title: "Story",
};

export const instant = false;

export default function ArticlePage({
  params,
}: PageProps<"/dashboard/articles/[id]">) {
  return (
    <Article params={params} />
  );
}

async function Article({
  params,
}: {
  params: PageProps<"/dashboard/articles/[id]">["params"];
}) {
  const { id } = await params;
  const safeId = encodeURIComponent(id);

  const result = await attempt(async () => {
    const [article, translations, related] = await Promise.all([
      apiRequest(`/articles/${safeId}`, articleDetailSchema),
      apiRequest(
        `/articles/${safeId}/translations`,
        z.array(translationSchema),
      ).catch(() => []),
      // Related stories are ranked for the newsroom communities the reader follows.
      getFollows()
        .catch(() => [])
        .then((follows) =>
          getRelatedArticles(
            id,
            follows.filter((card) => card.kind === "community").map((card) => card.id),
          ),
        )
        .catch(() => []),
    ]);

    const [library, profile] = await Promise.all([
      getLibraryState().catch(() => null),
      getProfile().catch(() => null),
    ]);

    return { article, translations, related, library, profile };
  });

  if (!result.ok) {
    if (result.status === 404 || result.status === 422) {
      notFound();
    }

    return <ErrorPanel message={result.message} />;
  }

  {
    const { article, translations, related, library, profile } = result.data;

    return (
      <article className="dash-article">
        <Link className="dash-back" href="/dashboard">
          <ArrowLeft className="dash-icon" aria-hidden="true" /> Back to feed
        </Link>
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
          <i className="dash-meta__dot" aria-hidden="true" />
          <time dateTime={article.published_at ?? article.created_at}>
            {formatDate(article.published_at ?? article.created_at)}
          </time>
        </div>
        <h1 className="dash-article__title">{article.title}</h1>
        {article.image_url ? (
          <figure className="dash-article__photo">
            {/* The publisher's own image, hotlinked and credited. Never copied. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.image_url} alt="" referrerPolicy="no-referrer" />
            <figcaption>Photo: {article.source_name}</figcaption>
          </figure>
        ) : null}
        {article.summary ? (
          <p className="dash-article__dek">{article.summary}</p>
        ) : null}
        <ReadTracker articleId={article.id} />
        <div className="dash-actions">
          {library ? (
            <SaveButton
              articleId={article.id}
              saved={library.saved.includes(article.id)}
              withLabel
            />
          ) : null}
          {article.source_id && profile ? (
            <FollowButton
              sourceId={article.source_id}
              following={profile.followed_source_ids.includes(article.source_id)}
            />
          ) : null}
          {/^https?:\/\//i.test(article.url) ? (
            // The route counts the click, then redirects to the publisher.
            <a className="dash-secondary" href={`/go/${article.id}`}>
              Read the original{" "}
              <ExternalLink className="dash-icon" aria-hidden="true" />
            </a>
          ) : null}
        </div>
        <p className="dash-article__stats">
          <span title="Readers who opened this story">
            <Users className="dash-icon" aria-hidden="true" />{" "}
            {article.clicks?.open_users ?? 0} readers
          </span>
          <i className="dash-meta__dot" aria-hidden="true" />
          <span title="Readers who clicked the original report">
            <MousePointerClick className="dash-icon" aria-hidden="true" />{" "}
            {article.clicks?.outbound_users ?? 0} opened the source
          </span>
        </p>
        {article.basic_info && article.explanation ? (
          <>
            <section className="dash-article__text" aria-labelledby="story-what-happened">
              <h2 id="story-what-happened">What happened</h2>
              <Markdown text={article.basic_info} />
            </section>
            <section className="dash-article__text" aria-labelledby="story-what-it-means">
              <h2 id="story-what-it-means">What it means for you</h2>
              <Markdown text={article.explanation} />
            </section>
          </>
        ) : article.content || article.explanation ? (
          <div className="dash-article__text">
            <Markdown text={article.content || article.explanation || ""} />
          </div>
        ) : null}

        {translations.length ? (
          <section className="dash-article__section">
            <h2>Translations</h2>
            {translations.map((translation) => (
              <div className="dash-translation" key={translation.id}>
                <strong>
                  {translation.language.toUpperCase()}
                  {translation.title ? ` — ${translation.title}` : ""}
                </strong>
                {translation.summary ? <p>{translation.summary}</p> : null}
                {translation.content ? <Markdown text={translation.content} /> : null}
              </div>
            ))}
          </section>
        ) : null}

        {related.length ? (
          <section className="dash-article__section">
            <h2>Related stories</h2>
            <StoryList articles={related} sponsored={false} />
          </section>
        ) : null}
      </article>
    );
  }
}
