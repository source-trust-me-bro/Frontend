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
