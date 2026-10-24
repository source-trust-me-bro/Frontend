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

// ---------------------------------------------------------------- community newsroom

export const communityLaneSchema = z.object({
  code: z.string(),
  label: z.string(),
  tier: z.string().default("A"),
  human_review: z.string().default("spot_check"),
});

export const communitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  regions: z.array(z.string()).default([]),
  languages: z.array(communityLaneSchema).default([]),
  channels: z
    .array(z.object({ kind: z.string(), label: z.string() }))
    .default([]),
  seasonal: z.boolean().default(false),
  trusted_voices: z
    .array(z.object({ name: z.string(), role: z.string() }))
    .default([]),
});
export type Community = z.infer<typeof communitySchema>;

export const memberSchema = z.object({
  community_id: z.string().nullish(),
  language: z.string().default("en"),
  trusted_voice_id: z.string().nullish(),
  community_role: z.enum(["member", "moderator", "admin"]).default("member"),
  review_roles: z.array(z.string()).default([]),
  review_languages: z.array(z.string()).default([]),
});
export type Member = z.infer<typeof memberSchema>;

export const publicStorySchema = z.object({
  story_id: z.string(),
  published_at: z.string(),
  headline: z.string(),
  standfirst: z.string(),
  needs: z.array(z.string()).default([]),
  risk_tier: z.string().default("low"),
  sources: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        official: z.boolean().default(false),
        origin: z.string().default("report"),
        note: z.string().default(""),
      }),
    )
    .default([]),
  context_notes: z
    .array(
      z.object({
        text: z.string(),
        kind: z.string(),
        source_url: z.string().nullish(),
      }),
    )
    .default([]),
  ai_disclosure: z.string().default(""),
  approvers: z
    .array(z.object({ role: z.string(), name: z.string(), title: z.string() }))
    .default([]),
  corrections: z
    .array(z.object({ text: z.string(), published_at: z.string().nullish() }))
    .default([]),
  renditions: z
    .array(
      z.object({
        channel: z.string(),
        language: z.string(),
        text: z.string(),
        link: z.string().nullish(),
      }),
    )
    .default([]),
});
export type PublicStory = z.infer<typeof publicStorySchema>;

export const messageKinds = [
  "question",
  "tip",
  "local_knowledge",
  "correction",
] as const;
export type MessageKind = (typeof messageKinds)[number];

export const triageSchema = z.object({
  message_id: z.string().optional(),
  action: z.string(),
  reason: z.string(),
  reply: z.string().default(""),
});
export type Triage = z.infer<typeof triageSchema>;

export const myMessageSchema = z.object({
  id: z.string(),
  kind: z.string(),
  text: z.string(),
  status: z.string(),
  created_at: z.string(),
});
export type MyMessage = z.infer<typeof myMessageSchema>;

export const reviewTaskSchema = z.object({
  type: z.string().optional(),
  story_id: z.string(),
  story_version: z.number(),
  community: z.string(),
  headline: z.string(),
  risk_tier: z.string(),
  missing_roles: z.array(z.string()).default([]),
  blocking_checks: z.array(z.string()).default([]),
  translations: z.record(z.string(), z.string()).default({}),
  pitch_id: z.string(),
  community_id: z.string().optional(),
  standfirst: z.string().default(""),
  sources: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        official: z.boolean().default(false),
        origin: z.string().default("report"),
      }),
    )
    .default([]),
  context_needing_a_human: z.array(z.string()).default([]),
});
export type ReviewTask = z.infer<typeof reviewTaskSchema>;

export const cycleStatusSchema = z.object({
  status: z.enum(["idle", "running", "done", "failed"]),
  started_at: z.string().nullish(),
  finished_at: z.string().nullish(),
  error: z.string().nullish(),
  summary: z
    .object({
      stopped_reason: z.string().nullish(),
      articles_processed: z.number().default(0),
      articles_deferred: z.number().default(0),
      new_articles: z.number(),
      events: z.number(),
      pitches: z.number(),
      stories: z.array(z.object({ title: z.string(), status: z.string() })).default([]),
    })
    .nullish(),
});
export type CycleStatus = z.infer<typeof cycleStatusSchema>;
