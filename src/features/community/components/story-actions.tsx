"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";

import { setLiked, shareStory } from "@/features/news/server/actions";
import type { EngagementStats } from "@/features/news/schemas";

const platforms: { id: string; label: string }[] = [
  { id: "facebook", label: "Facebook" },
  { id: "x", label: "X" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "telegram", label: "Telegram" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "email", label: "E-mail" },
  { id: "copy_link", label: "Copy link" },
];

/** Like and share a story, and see how many others did. */
export function StoryActions({
  storyId,
  stats,
  liked,
}: {
  storyId: string;
  stats: EngagementStats;
  liked: boolean;
}) {
  const [state, setState] = useOptimistic({ liked, likes: stats.likes });
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="dash-actions">
      <button
        type="button"
        className={`dash-chip${state.liked ? " is-active" : ""}`}
        aria-pressed={state.liked}
        disabled={pending}
        onClick={() => {
          const next = !state.liked;

          setMessage("");
          startTransition(async () => {
            setState({ liked: next, likes: state.likes + (next ? 1 : -1) });

            const result = await setLiked(storyId, next);

            if (!result.ok) {
              setMessage(result.message ?? "That did not work.");
            }
          });
        }}
      >
        <Heart className="dash-icon" aria-hidden="true" />
        <span>{state.liked ? "Liked" : "Like"}</span>
        <span className="dash-muted">{state.likes}</span>
      </button>

      <span className="dash-chip" title="Comments">
        <MessageCircle className="dash-icon" aria-hidden="true" />
        <span className="dash-muted">{stats.comments}</span>
      </span>

      <button
        type="button"
        className="dash-chip"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Share2 className="dash-icon" aria-hidden="true" />
        <span>Share</span>
        <span className="dash-muted">{stats.shares}</span>
      </button>

      {open ? (
        <ul className="dash-share" aria-label="Share this story">
          {platforms.map((platform) => (
            <li key={platform.id}>
              <button
                type="button"
                className="dash-chip"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await shareStory(storyId, platform.id);

                    if (!result.ok) {
                      setMessage(result.message);
                      return;
                    }

                    if (platform.id === "copy_link") {
                      await navigator.clipboard?.writeText(result.url).catch(() => undefined);
                      setMessage("Link copied.");
                    } else {
                      window.open(result.url, "_blank", "noopener,noreferrer");
                      setMessage("");
                    }

                    setOpen(false);
                  })
                }
              >
                {platform.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {message ? (
        <span className="dash-status" role="status">
          {message}
        </span>
      ) : null}
    </div>
  );
}
