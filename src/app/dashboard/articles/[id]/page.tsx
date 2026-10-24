import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { z } from "zod";

import {
  DownloadButton,
  FollowButton,
  ListenButton,
  ReadTracker,
  SaveButton,
} from "@/features/dashboard/components/article-controls";
import {
  StoryList,
  formatDate,
} from "@/features/dashboard/components/article-list";
import {
  DashboardShell,
  DashboardSkeleton,
  ErrorPanel,
} from "@/features/dashboard/components/dashboard-shell";
import {
  articleDetailSchema,
  articleSummarySchema,
  translationSchema,
} from "@/features/news/schemas";
import { apiRequest, attempt, getProfile } from "@/features/news/server/api";
import { getLibraryState } from "@/features/news/server/data";

export const metadata: Metadata = {
  title: "Story",
};

export const instant = false;

export default function ArticlePage({
  params,
}: PageProps<"/dashboard/articles/[id]">) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell>
        <Article params={params} />
      </DashboardShell>
    </Suspense>
  );
}

function paragraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
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
      apiRequest(
        `/articles/${safeId}/related`,
        z.array(articleSummarySchema),
      ).catch(() => []),
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
    const listenText = [article.title, article.summary, article.content]
      .filter(Boolean)
      .join(". ");
    const fileText = [
      article.title,
      `${article.source_name} · ${article.url}`,
      "",
      article.summary ?? "",
      "",
      article.content ?? "",
    ].join("\n");

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
        {article.summary ? (
          <p className="dash-article__dek">{article.summary}</p>
        ) : null}
        <ReadTracker articleId={article.id} />
        <div className="dash-actions">
          {library ? (
            <>
              <SaveButton
                articleId={article.id}
                saved={library.saved.includes(article.id)}
                withLabel
              />
              <DownloadButton
                articleId={article.id}
                downloaded={library.downloaded.includes(article.id)}
                fileName={`${article.title.slice(0, 60).replace(/[^\p{L}\p{N}]+/gu, "-")}.txt`}
                fileText={fileText}
              />
            </>
          ) : null}
          <ListenButton
            id={article.id}
            text={listenText}
            language={article.language}
          />
          {article.source_id && profile ? (
            <FollowButton
              sourceId={article.source_id}
              following={profile.followed_source_ids.includes(article.source_id)}
            />
          ) : null}
          <a
            className="dash-secondary"
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the original{" "}
            <ExternalLink className="dash-icon" aria-hidden="true" />
          </a>
        </div>
        {article.content ? (
          <div className="dash-article__text">
            {paragraphs(article.content).map((text, index) => (
              <p key={index}>{text}</p>
            ))}
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
                {translation.content
                  ? paragraphs(translation.content).map((text, index) => (
                      <p key={index}>{text}</p>
                    ))
                  : null}
              </div>
            ))}
          </section>
        ) : null}

        {related.length ? (
          <section className="dash-article__section">
            <h2>Related stories</h2>
            <StoryList articles={related} />
          </section>
        ) : null}
      </article>
    );
  }
}
