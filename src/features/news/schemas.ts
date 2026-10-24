import { z } from "zod";

export const languageSchema = z.enum(["en", "fi", "sv"]);
export type Language = z.infer<typeof languageSchema>;

export const languageLabels: Record<Language, string> = {
  en: "English",
  fi: "Suomi",
  sv: "Svenska",
};

export const userProfileSchema = z.object({
  id: z.string(),
  clerk_user_id: z.string().nullish(),
  email: z.string().nullish(),
  display_name: z.string().nullish(),
  roles: z.array(z.string()).default(["reader"]),
  preferred_language: languageSchema.catch("en"),
  community_id: z.string().nullish(),
  topic_ids: z.array(z.string()).default([]),
  followed_source_ids: z.array(z.string()).default([]),
});
export type UserProfile = z.infer<typeof userProfileSchema>;

export const articleSummarySchema = z.object({
  id: z.string(),
  source_id: z.string().nullish(),
  source_name: z.string(),
  title: z.string(),
  summary: z.string().nullish(),
  url: z.string(),
  language: z.string(),
  author: z.string().nullish(),
  published_at: z.string().nullish(),
  topic_ids: z.array(z.string()).default([]),
  created_at: z.string(),
});
export type ArticleSummary = z.infer<typeof articleSummarySchema>;

export const articleDetailSchema = articleSummarySchema.extend({
  content: z.string().nullish(),
  updated_at: z.string(),
});
export type ArticleDetail = z.infer<typeof articleDetailSchema>;

export const translationSchema = z.object({
  id: z.string(),
  article_id: z.string(),
  language: z.string(),
  title: z.string().nullish(),
  summary: z.string().nullish(),
  content: z.string().nullish(),
});
export type Translation = z.infer<typeof translationSchema>;

export function pageSchema<T extends z.ZodType>(item: T) {
  return z.object({
    items: z.array(item),
    total: z.number(),
    page: z.number(),
    page_size: z.number(),
    pages: z.number(),
  });
}

export type TopicNode = {
  id: string;
  name: string;
  slug: string;
  language: string;
  description?: string | null;
  children: TopicNode[];
};

export const topicNodeSchema: z.ZodType<TopicNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    language: z.string(),
    description: z.string().nullish(),
    children: z.array(topicNodeSchema).default([]),
  }),
);

export const sourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  feed_url: z.string(),
  language: z.string(),
  country: z.string().nullish(),
  active: z.boolean().default(true),
});
export type Source = z.infer<typeof sourceSchema>;

export const ingestionJobSchema = z.object({
  id: z.string(),
  source_id: z.string(),
  status: z.string(),
  trigger: z.string(),
  stats: z
    .object({
      fetched: z.number().default(0),
      created: z.number().default(0),
      updated: z.number().default(0),
      skipped: z.number().default(0),
      failed: z.number().default(0),
    })
    .default({ fetched: 0, created: 0, updated: 0, skipped: 0, failed: 0 }),
  error: z.string().nullish(),
  created_at: z.string(),
});
export type IngestionJob = z.infer<typeof ingestionJobSchema>;

export function flattenTopics(
  nodes: TopicNode[],
  depth = 0,
): Array<TopicNode & { depth: number }> {
  return nodes.flatMap((node) => [
    { ...node, depth },
    ...flattenTopics(node.children, depth + 1),
  ]);
}

export function canEdit(profile: UserProfile): boolean {
  return profile.roles.some((role) => role === "editor" || role === "admin");
}

export const libraryStateSchema = z.object({
  saved: z.array(z.string()).default([]),
  downloaded: z.array(z.string()).default([]),
});

export const feedbackSchema = z.object({
  id: z.string(),
  email: z.string().nullish(),
  display_name: z.string().nullish(),
  subject: z.string().nullish(),
  message: z.string(),
  created_at: z.string(),
});
export type Feedback = z.infer<typeof feedbackSchema>;
