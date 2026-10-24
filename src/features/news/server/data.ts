import "server-only";

import { cache } from "react";
import { z } from "zod";

import {
  articleSummarySchema,
  libraryStateSchema,
  pageSchema,
  sourceSchema,
  topicNodeSchema,
} from "../schemas";
import { apiRequest } from "./api";

export type LibraryKind = "saved" | "downloaded" | "history";

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

export function getTrending(limit: number) {
  return apiRequest(
    `/articles/trending?limit=${limit}`,
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
