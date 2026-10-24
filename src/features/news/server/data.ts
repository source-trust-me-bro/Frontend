import "server-only";

import { cache } from "react";
import { z } from "zod";

import {
  articleSummarySchema,
  clickStatsSchema,
  libraryStateSchema,
  pageSchema,
  sourceSchema,
  topicNodeSchema,
} from "../schemas";
import { apiRequest } from "./api";

export type LibraryKind = "saved" | "history";

export const getLibraryState = cache(() =>
  apiRequest("/library/state", libraryStateSchema),
);

export const getTopicTree = cache(() =>
  apiRequest("/topics/tree", z.array(topicNodeSchema)),
);

export const getSources = cache(() =>
  apiRequest("/sources?page_size=100", pageSchema(sourceSchema)),
);

export const getFollowedSources = cache(() =>
  apiRequest("/follows/sources", z.array(sourceSchema)),
);

/** Most-read stories. Pass the reader's language, or stories in every language are mixed in. */
export function getTrending(limit: number, language?: string) {
  const query = new URLSearchParams({ limit: String(limit) });

  if (language) {
    query.set("language", language);
  }

  return apiRequest(
    `/articles/trending?${query}`,
    z.array(articleSummarySchema),
  );
}

export function getLibraryPage(kind: LibraryKind, page: number) {
  return apiRequest(
    `/library/${kind}?page=${page}&page_size=20`,
    pageSchema(articleSummarySchema),
  );
}

export function getFollowingFeed(page: number) {
  return apiRequest(
    `/feeds/following?page=${page}&page_size=20`,
    pageSchema(articleSummarySchema),
  );
}

/** Stories related to one article, ranked for the reader's communities (newsroom ids). */
export function getRelatedArticles(
  articleId: string,
  communities: string[],
  limit = 6,
) {
  const query = new URLSearchParams({ limit: String(limit) });

  for (const community of communities) {
    query.append("community", community);
  }

  return apiRequest(
    `/articles/${encodeURIComponent(articleId)}/related?${query}`,
    z.array(articleSummarySchema),
  );
}

/** Stories for one newsroom community, ranked from the news tree. */
export function getCommunityArticles(
  communityId: string,
  language: string,
  limit = 20,
) {
  const query = new URLSearchParams({ language, limit: String(limit) });

  return apiRequest(
    `/feeds/community/${encodeURIComponent(communityId)}?${query}`,
    z.array(articleSummarySchema),
  );
}

/** Only the publisher's URL of a story, with a short timeout for the "Read the original" redirect. */
export async function getArticleSourceUrl(articleId: string, timeoutMs = 4000) {
  const article = await apiRequest(
    `/articles/${encodeURIComponent(articleId)}`,
    z.object({ url: z.string().nullish() }),
    { timeoutMs },
  );

  return article.url ?? null;
}

export type ClickKind = "open" | "outbound" | "share";

/** Counts one click on a story for the signed-in reader and returns the new totals. */
export function recordClick(
  articleId: string,
  kind: ClickKind,
  communityId: string | null,
  timeoutMs?: number,
) {
  return apiRequest(`/clicks/${encodeURIComponent(articleId)}`, clickStatsSchema, {
    method: "POST",
    body: { kind, community_id: communityId },
    timeoutMs,
  });
}

// ---------------------------------------------------------------- community newsroom

import {
  clicksReportSchema,
  communitySchema,
  cycleStatusSchema,
  directorySchema,
  feedItemSchema,
  followCardSchema,
  languageInfoSchema,
  memberSchema,
  myMessageSchema,
  newsroomOverviewSchema,
  publicStorySchema,
  reviewTaskSchema,
} from "../schemas";

export const getCommunities = cache(() =>
  apiRequest("/newsroom/communities", z.array(communitySchema)),
);

export const getMember = cache(() => apiRequest("/newsroom/me", memberSchema));

export function getCommunityFeed(
  communityId: string,
  destination: "dashboard" | "community",
) {
  return apiRequest(
    `/newsroom/feed?community_id=${encodeURIComponent(communityId)}&destination=${destination}`,
    z.array(publicStorySchema),
  );
}

export const getMyMessages = cache(() =>
  apiRequest("/newsroom/messages/mine", z.array(myMessageSchema)),
);

export function getNewsroomOverview() {
  return apiRequest("/newsroom/overview", newsroomOverviewSchema);
}

export function getClicksReport(days = 30) {
  return apiRequest(`/clicks/report?days=${days}`, clicksReportSchema);
}

export function getCycleStatus() {
  return apiRequest("/newsroom/cycle/latest", cycleStatusSchema);
}

export function getReviewQueue() {
  return apiRequest("/newsroom/review-queue", z.array(reviewTaskSchema));
}

// ------------------------------------------------------- following (communities, accounts)

export const getDirectory = cache(() => apiRequest("/newsroom/directory", directorySchema));

export const getFollows = cache(() =>
  apiRequest("/newsroom/follows", z.array(followCardSchema)),
);

export function getRecommended(limit = 8) {
  return apiRequest(
    `/newsroom/follows/recommended?limit=${limit}`,
    z.array(followCardSchema),
  );
}

/** Stories from what the reader follows, only in the languages they read. */
export function getMyCommunityFeed() {
  return apiRequest("/newsroom/feed/following", z.array(feedItemSchema));
}

/** Every language readers can choose, and how many stories each has. */
export const getLanguages = cache(() =>
  apiRequest("/languages", z.array(languageInfoSchema)),
);
