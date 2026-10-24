"use client";

import { useState, useTransition } from "react";

import { joinCommunity } from "@/features/news/server/actions";

export function JoinButton({
  communityId,
  language,
  label,
}: {
  communityId: string;
  language?: string;
  label: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  return (
    <>
      <button
        className="dash-primary"
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await joinCommunity(communityId, language);

            setError(result.ok ? "" : (result.message ?? "That did not work."));
          })
        }
      >
        {pending ? "Joining…" : label}
      </button>
      {error ? (
        <span className="dash-status dash-status--error" role="alert">
          {error}
        </span>
      ) : null}
    </>
  );
}
