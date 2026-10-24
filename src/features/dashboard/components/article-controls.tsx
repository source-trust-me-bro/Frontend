"use client";

import { useEffect, useOptimistic, useState, useTransition } from "react";
import {
  Bookmark,
  Check,
  Plus,
  Trash2,
} from "lucide-react";

import {
  clearHistory,
  recordRead,
  setFollowingSource,
  setSaved,
  type ActionResult,
} from "@/features/news/server/actions";

type ToggleKind = "saved" | "follow";

const toggles: Record<
  ToggleKind,
  (id: string, value: boolean) => Promise<ActionResult>
> = {
  saved: setSaved,
  follow: setFollowingSource,
};

function Toggle({
  kind,
  targetId,
  value,
  className,
  children,
}: {
  kind: ToggleKind;
  targetId: string;
  value: boolean;
  className: string;
  children: (on: boolean) => React.ReactNode;
}) {
  const [on, setOn] = useOptimistic(value);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  return (
    <>
      <button
        className={`${className}${on ? " is-on" : ""}`}
        type="button"
        aria-pressed={on}
        disabled={pending}
        onClick={() => {
          const next = !on;

          setError("");
          startTransition(async () => {
            setOn(next);

            const result = await toggles[kind](targetId, next);

            if (!result.ok) {
              setError(result.message ?? "That did not work.");
              return;
            }
          });
        }}
      >
        {children(on)}
      </button>
      {error ? (
        <span className="dash-status dash-status--error" role="alert">
          {error}
        </span>
      ) : null}
    </>
  );
}

export function SaveButton({
  articleId,
  saved,
  withLabel = false,
  labels = ["Save", "Saved"],
}: {
  articleId: string;
  saved: boolean;
  withLabel?: boolean;
  /** Visible text when not saved and when saved. */
  labels?: [string, string];
}) {
  return (
    <Toggle
      kind="saved"
      targetId={articleId}
      value={saved}
      className={withLabel ? "dash-secondary" : "dash-item__save"}
    >
      {(on) => (
        <>
          <Bookmark
            className="dash-icon"
            aria-hidden="true"
            fill={on ? "currentColor" : "none"}
          />
          {withLabel ? <span>{on ? labels[1] : labels[0]}</span> : null}
          <span className="dash-sr">{on ? "Remove bookmark" : "Save story"}</span>
        </>
      )}
    </Toggle>
  );
}

export function FollowButton({
  sourceId,
  following,
}: {
  sourceId: string;
  following: boolean;
}) {
  return (
    <Toggle
      kind="follow"
      targetId={sourceId}
      value={following}
      className="dash-follow"
    >
      {(on) =>
        on ? (
          <>
            <Check className="dash-icon" aria-hidden="true" />
            <span>Following</span>
          </>
        ) : (
          <>
            <Plus className="dash-icon" aria-hidden="true" />
            <span>Follow</span>
          </>
        )
      }
    </Toggle>
  );
}

const recorded = new Set<string>();

/** Adds the story to the reader's history once per page view. */
export function ReadTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    if (recorded.has(articleId)) {
      return;
    }

    recorded.add(articleId);
    void recordRead(articleId);
  }, [articleId]);

  return null;
}

export function ClearButton({ label }: { label: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      className="dash-secondary"
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await clearHistory();
        })
      }
    >
      <Trash2 className="dash-icon" aria-hidden="true" />
      <span>{pending ? "Clearing…" : label}</span>
    </button>
  );
}
