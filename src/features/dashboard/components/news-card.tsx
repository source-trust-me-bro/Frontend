import Link from "next/link";
import { ExternalLink, MousePointerClick, Users } from "lucide-react";

import type { ArticleSummary } from "@/features/news/schemas";

import { SaveButton } from "./article-controls";
import { formatDate } from "./format-date";

/**
 * One story card: photo from the feed, headline, the basic facts, the start of the explanation,
 * how many readers opened it and clicked the source, and why it is shown here.
 */
export function NewsCard({
  article,
  saved,
  addLabels,
  communityId,
}: {
  article: ArticleSummary;
  saved?: boolean;
  /** Show a labelled add button (for example "Add" / "Added") instead of the bookmark icon. */
  addLabels?: [string, string];
  communityId?: string;
}) {
  const clicks = article.clicks;
  const original = `/go/${article.id}${communityId ? `?c=${encodeURIComponent(communityId)}` : ""}`;

  return (
    <li className={`dash-news${article.image_url ? "" : " dash-news--no-photo"}`}>
      {article.image_url ? (
        <Link className="dash-news__photo" href={`/dashboard/articles/${article.id}`} tabIndex={-1}>
          {/* The publisher's own image, hotlinked and credited. Never copied. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image_url}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          <span className="dash-news__credit">Photo: {article.source_name}</span>
        </Link>
      ) : null}

      <div className="dash-news__body">
        <div className="dash-item__meta">
          <span>{article.source_name}</span>
          <i className="dash-meta__dot" aria-hidden="true" />
          <span>{article.language.toUpperCase()}</span>
          <i className="dash-meta__dot" aria-hidden="true" />
          <time dateTime={article.published_at ?? article.created_at}>
            {formatDate(article.published_at ?? article.created_at)}
          </time>
        </div>

        <h3 className="dash-item__title">
          <Link href={`/dashboard/articles/${article.id}`}>{article.title}</Link>
        </h3>

        {article.basic_info ? (
          <p className="dash-news__facts">
            <strong>What happened.</strong> {article.basic_info}
          </p>
        ) : article.summary ? (
          <p className="dash-item__text">{article.summary}</p>
        ) : null}

        {article.explanation ? (
          <p className="dash-news__why">
            <strong>What it means for you.</strong> {article.explanation}
          </p>
        ) : null}

        {article.reasons?.length ? (
          <p className="dash-news__reasons">{article.reasons.join(" · ")}</p>
        ) : null}

        <div className="dash-news__foot">
          {clicks ? (
            <span className="dash-news__stat" title="Readers who opened this story">
              <Users className="dash-icon" aria-hidden="true" /> {clicks.open_users}
            </span>
          ) : null}
          {clicks ? (
            <span className="dash-news__stat" title="Readers who clicked the original report">
              <MousePointerClick className="dash-icon" aria-hidden="true" /> {clicks.outbound_users}
            </span>
          ) : null}
          {/^https?:\/\//i.test(article.url) ? (
            <a className="dash-news__source" href={original}>
              Read the original <ExternalLink className="dash-icon" aria-hidden="true" />
            </a>
          ) : null}
          {saved !== undefined ? (
            <SaveButton
              articleId={article.id}
              saved={saved}
              withLabel={Boolean(addLabels)}
              labels={addLabels}
            />
          ) : null}
        </div>
      </div>
    </li>
  );
}
