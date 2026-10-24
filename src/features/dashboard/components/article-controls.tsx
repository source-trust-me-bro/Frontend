"use client";

import { useEffect, useOptimistic, useState, useTransition } from "react";
import {
  Bookmark,
  Check,
  Download,
  Headphones,
  Pause,
  Plus,
  Trash2,
} from "lucide-react";

import {
  clearDownloads,
  clearHistory,
  recordRead,
  setDownloaded,
  setFollowingSource,
  setSaved,
  type ActionResult,
} from "@/features/news/server/actions";

type ToggleKind = "saved" | "downloaded" | "follow";

const toggles: Record<
  ToggleKind,
  (id: string, value: boolean) => Promise<ActionResult>
> = {
  saved: setSaved,
  downloaded: setDownloaded,
  follow: setFollowingSource,
};

function saveTextFile(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const link = document.createElement("a");

  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

function Toggle({
  kind,
  targetId,
  value,
  className,
  children,
  download,
}: {
  kind: ToggleKind;
  targetId: string;
  value: boolean;
  className: string;
  children: (on: boolean) => React.ReactNode;
  download?: { name: string; text: string };
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

            if (next && download) {
              saveTextFile(download.name, download.text);
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
}: {
  articleId: string;
  saved: boolean;
  withLabel?: boolean;
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
          {withLabel ? <span>{on ? "Saved" : "Save"}</span> : null}
          <span className="dash-sr">{on ? "Remove bookmark" : "Save story"}</span>
        </>
      )}
    </Toggle>
  );
}

export function DownloadButton({
  articleId,
  downloaded,
  fileName,
  fileText,
}: {
  articleId: string;
  downloaded: boolean;
  fileName: string;
  fileText: string;
}) {
  return (
    <Toggle
      kind="downloaded"
      targetId={articleId}
      value={downloaded}
      className="dash-secondary"
      download={{ name: fileName, text: fileText }}
    >
      {(on) => (
        <>
          <Download className="dash-icon" aria-hidden="true" />
          <span>{on ? "Downloaded" : "Download"}</span>
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

let activeSpeechId: string | null = null;

export function ListenButton({
  id,
  text,
  language = "en",
}: {
  id: string;
  text: string;
  language?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    () => () => {
      if (activeSpeechId === id && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        activeSpeechId = null;
      }
    },
    [id],
  );

  const toggle = () => {
    if (!("speechSynthesis" in window)) {
      setError("Speech playback is not supported in this browser.");
      return;
    }

    if (playing) {
      window.speechSynthesis.cancel();
      activeSpeechId = null;
      setPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = language;
    utterance.onend = () => {
      activeSpeechId = null;
      setPlaying(false);
    };
    utterance.onerror = () => {
      activeSpeechId = null;
      setPlaying(false);
    };
    activeSpeechId = id;
    setError("");
    setPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <button
        className={`dash-secondary${playing ? " is-on" : ""}`}
        type="button"
        aria-pressed={playing}
        onClick={toggle}
      >
        {playing ? (
          <Pause className="dash-icon" aria-hidden="true" />
        ) : (
          <Headphones className="dash-icon" aria-hidden="true" />
        )}
        <span>{playing ? "Stop" : "Listen"}</span>
      </button>
      {error ? (
        <span className="dash-status dash-status--error" role="alert">
          {error}
        </span>
      ) : null}
    </>
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

export function ClearButton({
  kind,
  label,
}: {
  kind: "history" | "downloads";
  label: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      className="dash-secondary"
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await (kind === "history" ? clearHistory() : clearDownloads());
        })
      }
    >
      <Trash2 className="dash-icon" aria-hidden="true" />
      <span>{pending ? "Clearing…" : label}</span>
    </button>
  );
}
