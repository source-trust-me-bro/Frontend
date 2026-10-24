import { z } from "zod";

export const languageSchema = z.enum(["en", "fi", "sv", "ar", "se", "uk", "ru"]);
export type Language = z.infer<typeof languageSchema>;

export const languageLabels: Record<Language, string> = {
  en: "English",
  fi: "Suomi",
  sv: "Svenska",
  ar: "العربية",
  se: "Davvisámegiella",
  uk: "Українська",
  ru: "Русский",
};

const rightToLeft = new Set(["ar", "fa", "he", "ur"]);

/** The writing direction for a language code, for the dir attribute on its text. */
export function textDirection(code: string | null | undefined): "rtl" | "ltr" {
  return code && rightToLeft.has(code.toLowerCase()) ? "rtl" : "ltr";
}

/** A language readers can choose, with how many stories its collection holds. */
export const languageInfoSchema = z.object({
  code: z.string(),
  label: z.string(),
  rtl: z.boolean().default(false),
  articles: z.number().default(0),
});
export type LanguageInfo = z.infer<typeof languageInfoSchema>;

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

/** How many readers opened a story, clicked through to its source, or shared it. */
export const clickStatsSchema = z.object({
  open_users: z.number().default(0),
  open_total: z.number().default(0),
  outbound_users: z.number().default(0),
  outbound_total: z.number().default(0),
  share_users: z.number().default(0),
  share_total: z.number().default(0),
});
export type ClickStats = z.infer<typeof clickStatsSchema>;

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
  image_url: z.string().nullish(),
  basic_info: z.string().nullish(),
  explanation: z.string().nullish(),
  event_id: z.string().nullish(),
  community_id: z.string().nullish(),
  reasons: z.array(z.string()).default([]),
  clicks: clickStatsSchema.nullish(),
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
  reading_languages: z.array(z.string()).default([]),
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

export const cycleProgressSchema = z.object({
  running: z.boolean().default(false),
  outcome: z.string().default(""),
  note: z.string().default(""),
  percent: z.number().default(0),
  stage: z.string().default(""),
  elapsed_seconds: z.number().default(0),
  eta_seconds: z.number().nullish(),
  activity: z
    .array(
      z.object({
        t: z.number().default(0),
        agent: z.string(),
        text: z.string(),
        level: z.string().default("info"),
      }),
    )
    .default([]),
  usage: z
    .object({
      calls: z.number().default(0),
      budget: z.number().default(0),
      in_flight: z.number().default(0),
      peak_in_flight: z.number().default(0),
      max_concurrent: z.number().default(0),
      avg_seconds: z.number().nullish(),
      by_task: z.record(z.string(), z.number()).default({}),
    })
    .default({
      calls: 0,
      budget: 0,
      in_flight: 0,
      peak_in_flight: 0,
      max_concurrent: 0,
      by_task: {},
    }),
  stages: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        status: z.string(),
        done: z.number().default(0),
        total: z.number().default(0),
        detail: z.string().default(""),
        percent: z.number().default(0),
        seconds: z.number().nullish(),
      }),
    )
    .default([]),
  story_steps: z.array(z.object({ key: z.string(), label: z.string() })).default([]),
  stories: z
    .array(
      z.object({
        pitch_id: z.string(),
        title: z.string(),
        community: z.string(),
        step: z.string(),
        step_label: z.string(),
        steps_done: z.number().default(0),
        steps_total: z.number().default(5),
        languages_done: z.number().default(0),
        languages_total: z.number().default(0),
        status: z.string(),
      }),
    )
    .default([]),
});
export type CycleProgress = z.infer<typeof cycleProgressSchema>;

export const cycleStatusSchema = z.object({
  progress: cycleProgressSchema.nullish(),
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

export const newsroomOverviewSchema = z.object({
  topics: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      depth: z.number(),
      events: z.number(),
      proposed: z.boolean().default(false),
      branches: z.array(z.string()).default([]),
    }),
  ),
  sources: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      outlet: z.string().nullish(),
      language: z.string(),
      feed_url: z.string().nullish(),
      official: z.boolean().default(false),
      enabled: z.boolean(),
      headline_only: z.boolean().default(false),
      articles: z.number(),
    }),
  ),
  articles: z.number(),
  jobs: z.array(cycleStatusSchema),
});
export type NewsroomOverview = z.infer<typeof newsroomOverviewSchema>;

// ------------------------------------------------------- editor click report

const clickCountSchema = z.object({ users: z.number(), total: z.number() });
const audienceRowSchema = z.object({
  community_id: z.string().nullish(),
  name: z.string(),
  readers: z.number(),
  clicks: z.number(),
});

export const clicksReportSchema = z.object({
  days: z.number(),
  readers: z.number(),
  open: clickCountSchema,
  outbound: clickCountSchema,
  share: clickCountSchema,
  communities: z.array(audienceRowSchema),
  articles: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      source_name: z.string(),
      url: z.string(),
      language: z.string(),
      written_for: z.string().nullish(),
      topics: z.array(z.string()).default([]),
      outlets: z.number().default(1),
      open: clickCountSchema,
      outbound: clickCountSchema,
      share: clickCountSchema,
      readers: z.number(),
      last_click_at: z.string().nullish(),
      audience: z.array(audienceRowSchema).default([]),
      why: z.array(z.string()).default([]),
    }),
  ),
});
export type ClicksReport = z.infer<typeof clicksReportSchema>;

// ------------------------------------------------- following, reactions and sharing

export const followCardSchema = z.object({
  kind: z.enum(["community", "official"]),
  id: z.string(),
  name: z.string(),
  description: z.string().default(""),
  languages: z.array(z.string()).default([]),
  followers: z.number().default(0),
  following: z.boolean().default(false),
  reasons: z.array(z.string()).default([]),
});
export type FollowCard = z.infer<typeof followCardSchema>;

export const directorySchema = z.object({
  communities: z.array(followCardSchema).default([]),
  official: z.array(followCardSchema).default([]),
});
export type Directory = z.infer<typeof directorySchema>;

export const engagementStatsSchema = z.object({
  likes: z.number().default(0),
  comments: z.number().default(0),
  shares: z.number().default(0),
  score: z.number().default(0),
});
export type EngagementStats = z.infer<typeof engagementStatsSchema>;

/** A story in "Following": the public story plus the edition chosen for this reader. */
export const feedItemSchema = publicStorySchema.extend({
  language: z.string().nullish(),
  available_languages: z.array(z.string()).default([]),
  because: z.array(z.string()).default([]),
  stats: engagementStatsSchema.default({ likes: 0, comments: 0, shares: 0, score: 0 }),
  liked_by_me: z.boolean().default(false),
});
export type FeedItem = z.infer<typeof feedItemSchema>;

export const shareResultSchema = z.object({
  url: z.string(),
  stats: engagementStatsSchema,
});
