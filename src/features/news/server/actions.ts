"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  canEdit,
  ingestionJobSchema,
  languageSchema,
  userProfileSchema,
} from "../schemas";
import { ApiError, apiRequest, errorMessage, getProfile, requireUserId } from "./api";

export type FormState = { status: "idle" | "success" | "error"; message: string };

const updateProfileSchema = z.object({
  display_name: z.string().trim().max(120).optional(),
  preferred_language: languageSchema,
  topic_ids: z.array(z.string().min(1)),
});

export async function updateProfile(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUserId();

  const parsed = updateProfileSchema.safeParse({
    display_name: formData.get("display_name")?.toString() || undefined,
    preferred_language: formData.get("preferred_language"),
    topic_ids: formData.getAll("topic_ids").map(String),
  });

  if (!parsed.success) {
    return { status: "error", message: "Check your name and language, then try again." };
  }

  try {
    await apiRequest("/users/me", userProfileSchema, {
      method: "PATCH",
      body: {
        ...(parsed.data.display_name
          ? { display_name: parsed.data.display_name }
          : {}),
        preferred_language: parsed.data.preferred_language,
        topic_ids: parsed.data.topic_ids,
      },
    });
  } catch (error) {
    return { status: "error", message: errorMessage(error) };
  }

  revalidatePath("/dashboard", "layout");

  return { status: "success", message: "Your profile was saved." };
}

export async function runIngestion(formData: FormData): Promise<void> {
  await requireUserId();

  const profile = await getProfile();

  // FastAPI enforces this again; checking here avoids a pointless round trip.
  if (!canEdit(profile)) {
    throw new ApiError(403, "Editor access is required.");
  }

  const sourceId = formData.get("source_id")?.toString();

  if (!sourceId) {
    throw new ApiError(400, "Choose a source to ingest.");
  }

  await apiRequest("/ingestion/jobs", ingestionJobSchema, {
    method: "POST",
    body: { source_id: sourceId },
  });

  revalidatePath("/editor");
}

export type ActionResult = { ok: boolean; message?: string };

const idSchema = z.string().min(1).max(64);

async function command(
  path: string,
  method: "PUT" | "POST" | "DELETE",
  body?: unknown,
): Promise<ActionResult> {
  await requireUserId();

  try {
    await apiRequest(path, z.unknown(), { method, body });
  } catch (error) {
    return { ok: false, message: errorMessage(error) };
  }

  revalidatePath("/dashboard", "layout");

  return { ok: true };
}

export async function setSaved(
  articleId: string,
  value: boolean,
): Promise<ActionResult> {
  return command(`/library/${idSchema.parse(articleId)}/saved`, "PUT", { value });
}

export async function setDownloaded(
  articleId: string,
  value: boolean,
): Promise<ActionResult> {
  return command(`/library/${idSchema.parse(articleId)}/downloaded`, "PUT", {
    value,
  });
}

export async function setFollowingSource(
  sourceId: string,
  value: boolean,
): Promise<ActionResult> {
  return command(`/follows/sources/${idSchema.parse(sourceId)}`, "PUT", { value });
}

export async function recordRead(articleId: string): Promise<ActionResult> {
  await requireUserId();

  try {
    await apiRequest(`/library/${idSchema.parse(articleId)}/read`, z.void(), {
      method: "POST",
    });
  } catch (error) {
    return { ok: false, message: errorMessage(error) };
  }

  return { ok: true };
}

export async function clearHistory(): Promise<ActionResult> {
  await requireUserId();

  try {
    await apiRequest("/library/history", z.void(), { method: "DELETE" });
  } catch (error) {
    return { ok: false, message: errorMessage(error) };
  }

  revalidatePath("/dashboard", "layout");

  return { ok: true };
}

export async function clearDownloads(): Promise<ActionResult> {
  await requireUserId();

  try {
    await apiRequest("/library/downloaded", z.void(), { method: "DELETE" });
  } catch (error) {
    return { ok: false, message: errorMessage(error) };
  }

  revalidatePath("/dashboard", "layout");

  return { ok: true };
}

const feedbackInputSchema = z.object({
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1).max(4000),
});

export async function sendFeedback(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUserId();

  const parsed = feedbackInputSchema.safeParse({
    subject: formData.get("subject")?.toString() || undefined,
    message: formData.get("message")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { status: "error", message: "Write a message (up to 4000 characters)." };
  }

  try {
    await apiRequest("/feedback", z.unknown(), {
      method: "POST",
      body: parsed.data,
    });
  } catch (error) {
    return { status: "error", message: errorMessage(error) };
  }

  revalidatePath("/editor");

  return { status: "success", message: "Thanks. Your feedback was sent to the team." };
}

// ---------------------------------------------------------------- community newsroom

import { messageKinds, triageSchema, type Triage } from "../schemas";

export async function joinCommunity(
  communityId: string,
  language?: string,
): Promise<ActionResult> {
  return command("/newsroom/me/community", "PUT", {
    community_id: idSchema.parse(communityId),
    language: language || undefined,
  });
}

export type ContributionState = {
  status: "idle" | "success" | "error";
  message: string;
  triage?: Triage;
};

const contributionSchema = z.object({
  kind: z.enum(messageKinds),
  text: z.string().trim().min(1).max(4000),
  story_id: z.string().max(64).optional(),
});

/** A question, tip, piece of local knowledge, or a request for a correction. */
export async function sendContribution(
  _previous: ContributionState,
  formData: FormData,
): Promise<ContributionState> {
  await requireUserId();

  const parsed = contributionSchema.safeParse({
    kind: formData.get("kind"),
    text: formData.get("text"),
    story_id: formData.get("story_id")?.toString() || undefined,
  });

  if (!parsed.success) {
    return { status: "error", message: "Choose what you are sending and write a message." };
  }

  try {
    const triage = await apiRequest("/newsroom/messages", triageSchema, {
      method: "POST",
      body: parsed.data,
      timeoutMs: 120_000, // the model reads the message
    });

    revalidatePath("/dashboard/community");

    return {
      status: "success",
      message: "Thank you. The newsroom received it.",
      triage,
    };
  } catch (error) {
    return { status: "error", message: errorMessage(error) };
  }
}

const reviewSchema = z.object({
  pitch_id: z.string().min(1).max(64),
  role: z.enum([
    "editor_in_chief",
    "language_reviewer",
    "community_reviewer",
    "subject_expert",
  ]),
  decision: z.enum(["approve", "reject", "request_changes"]),
  notes: z.string().max(2000).default(""),
});

/**
 * The reviewer is the signed-in person: the API takes the name from the account and checks
 * their rights. A refusal comes back as a message, never as a crashed page.
 */
export async function submitReview(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUserId();

  const parsed = reviewSchema.safeParse({
    pitch_id: formData.get("pitch_id"),
    role: formData.get("role"),
    decision: formData.get("decision"),
    notes: formData.get("notes")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { status: "error", message: "That decision was not understood. Reload and try again." };
  }

  if (parsed.data.decision === "request_changes" && !parsed.data.notes.trim()) {
    return { status: "error", message: "Say what should change, so the agents can fix it." };
  }

  try {
    await apiRequest(`/newsroom/review/${parsed.data.pitch_id}`, z.unknown(), {
      timeoutMs: 150_000, // re-checking a story can call the model
      method: "POST",
      body: {
        decisions: [
          {
            role: parsed.data.role,
            decision: parsed.data.decision,
            notes: parsed.data.notes,
          },
        ],
      },
    });
  } catch (error) {
    return { status: "error", message: errorMessage(error) };
  }

  revalidatePath("/editor");
  revalidatePath("/dashboard/community");

  return {
    status: "success",
    message:
      parsed.data.decision === "approve"
        ? "Recorded under your name."
        : parsed.data.decision === "reject"
          ? "Rejected."
          : "Sent back to the agents with your notes.",
  };
}

export async function runNewsroomCycle(): Promise<FormState> {
  await requireUserId();

  try {
    await apiRequest("/newsroom/cycle", z.unknown(), { method: "POST", body: {} });
  } catch (error) {
    return { status: "error", message: errorMessage(error) };
  }

  revalidatePath("/editor");

  return { status: "success", message: "The agents started a cycle." };
}

export async function stopNewsroomCycle(): Promise<FormState> {
  await requireUserId();

  try {
    await apiRequest("/newsroom/cycle/stop", z.unknown(), { method: "POST" });
  } catch (error) {
    return { status: "error", message: errorMessage(error) };
  }

  revalidatePath("/editor");

  return { status: "success", message: "Stopping. Whatever was collected stays saved." };
}

const sourceSchema = z.object({
  story_id: z.string().min(1).max(64),
  name: z.string().trim().min(1).max(200),
  url: z.string().trim().url().max(2048),
  official: z.boolean(),
});

/** Editors check the sources the agents attached and add more if they need to. */
export async function addStorySource(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUserId();

  const parsed = sourceSchema.safeParse({
    story_id: formData.get("story_id"),
    name: formData.get("name"),
    url: formData.get("url"),
    official: formData.get("official") === "on",
  });

  if (!parsed.success) {
    return { status: "error", message: "Give the source a name and a full web address." };
  }

  try {
    await apiRequest(`/newsroom/stories/${parsed.data.story_id}/sources`, z.unknown(), {
      method: "POST",
      body: {
        name: parsed.data.name,
        url: parsed.data.url,
        official: parsed.data.official,
      },
    });
  } catch (error) {
    return { status: "error", message: errorMessage(error) };
  }

  revalidatePath("/editor");

  return { status: "success", message: "Source added." };
}

export type AccountHit = { id: string; display_name: string; email_hint: string };

const accountHitSchema = z.object({
  id: z.string(),
  display_name: z.string(),
  email_hint: z.string().default(""),
});

/** Editors and community admins find the person to appoint by name. */
export async function searchAccounts(
  query: string,
): Promise<{ ok: true; accounts: AccountHit[] } | { ok: false; message: string }> {
  await requireUserId();

  const q = query.trim();

  if (q.length < 2) {
    return { ok: false, message: "Type at least two letters of the name." };
  }

  try {
    const accounts = await apiRequest(
      `/newsroom/staff/users?q=${encodeURIComponent(q)}`,
      z.array(accountHitSchema),
    );

    return { ok: true, accounts };
  } catch (error) {
    return { ok: false, message: errorMessage(error) };
  }
}

const appointSchema = z.object({
  user_id: z.string().min(1).max(64),
  community_id: z.string().max(64).optional(),
  community_role: z.enum(["member", "moderator", "admin"]),
  review_roles: z.array(
    z.enum(["language_reviewer", "community_reviewer", "subject_expert"]),
  ),
  review_languages: z.array(z.string().min(1).max(12)).max(20),
});

/**
 * Community admins and moderators are the community's trusted voices. The backend decides
 * who may appoint whom: editors anyone in any community, a community admin only moderators
 * in their own community.
 */
export async function appointCommunityRole(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUserId();

  const parsed = appointSchema.safeParse({
    user_id: formData.get("user_id"),
    community_id: formData.get("community_id")?.toString() || undefined,
    community_role: formData.get("community_role"),
    review_roles: formData.getAll("review_roles").map(String),
    review_languages: formData.getAll("review_languages").map(String),
  });

  if (!parsed.success) {
    return { status: "error", message: "Choose a person from the search results first." };
  }

  try {
    await apiRequest("/newsroom/staff/community-role", z.unknown(), {
      method: "POST",
      body: parsed.data,
    });
  } catch (error) {
    return { status: "error", message: errorMessage(error) };
  }

  revalidatePath("/dashboard/community/moderate");
  revalidatePath("/editor");

  return {
    status: "success",
    message:
      parsed.data.community_role === "member"
        ? "Their trusted-voice role was removed."
        : "Saved. They can now review in the roles you gave them.",
  };
}
