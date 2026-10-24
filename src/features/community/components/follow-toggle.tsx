"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Check, Plus } from "lucide-react";

import { setFollowing } from "@/features/news/server/actions";

/** Follow or unfollow a community or an official account. */
export function FollowToggle({
  kind,
  targetId,
  name,
  following,
}: {
  kind: "community" | "official";
  targetId: string;
  name: string;
  following: boolean;
}) {
  const [on, setOn] = useOptimistic(following);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  return (
    <>
      <button
        className={`dash-follow${on ? " is-on" : ""}`}
        type="button"
        aria-pressed={on}
        aria-label={`${on ? "Unfollow" : "Follow"} ${name}`}
        disabled={pending}
        onClick={() => {
          const next = !on;

          setError("");
          startTransition(async () => {
            setOn(next);

            const result = await setFollowing(kind, targetId, next);

            if (!result.ok) {
              setError(result.message ?? "That did not work.");
            }
          });
        }}
      >
        {on ? (
          <>
            <Check className="dash-icon" aria-hidden="true" />
            <span>Following</span>
          </>
        ) : (
          <>
            <Plus className="dash-icon" aria-hidden="true" />
            <span>Follow</span>
          </>
        )}
      </button>
      {error ? (
        <span className="dash-status dash-status--error" role="alert">
          {error}
        </span>
      ) : null}
    </>
  );
}
